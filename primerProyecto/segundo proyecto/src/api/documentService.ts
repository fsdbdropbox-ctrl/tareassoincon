import { getValidToken } from "./authService";

const BASE_URL_DOCS = "https://desarrollo.emisuite.es/emisuite-documentmanager-api";

export const processFileUpload = (
    fieldName: string,
    file: any,
    metadata: any,
    load: (id: string) => void,
    error: (err: string) => void,
    progress: (computable: boolean, loaded: number, total: number) => void,
    abort: () => void
) => {

    // controlador para cancelar una subida
    const controller = new AbortController();

    // extraemos el nombre sin la extension para la URL
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || "imagen";

    // parámetros necesarios para la subida según el swagger
    const params = new URLSearchParams({
        name: nameWithoutExt,
        idVersion: "1",
        pathbase: "Emisuite/My Factory/materials"

    });

    getValidToken().then(token => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        fetch(`${BASE_URL_DOCS}/file/createDocument?${params.toString()}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: formData,
            signal: controller.signal
        }).then(response => {
            if (!response.ok) { throw new Error("Error en el servidor: " + response.status); }
            return response.json();
        }).then(data => {
            const serverId = data.uuidDocument?.toString();
            if (serverId) { load(serverId) }
            else { error("El servidor respondió pero no mandó Id del documento") }
        }).catch(err => {
            if (err.name !== 'AbortError') {
                console.error("Error subiendo archivo: " + err)
                error(err.message);
            }

        });
    }).catch(() => {
        error("Error de autenticación");
    })



    return {
        abort: () => {
            controller.abort();
            abort;
        }
    };
};

const imageCache: Record<string, Promise<string>> = {};
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

export const fetchImagePreview = (
    imageUuid: string,
): Promise<string> => {

    if (!imageUuid || imageUuid === "null" || imageUuid === "undefined") { return Promise.reject("Sin imagen") };

    if (!uuidRegex.test(imageUuid.toString())) {
        return Promise.reject("Id antiguo");
    }

    if (imageUuid in imageCache) {
        return imageCache[imageUuid];
    }
    const fetchPromise = (async () => {
        const token = await getValidToken();

        const requestBody = {
            filter: {
                ids: [imageUuid],
                includeData: true,
                quality: "LOW",
            },
            page: 0,
            size: 1
        };

        const response = await fetch(`${BASE_URL_DOCS}/file/searchImages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) { throw new Error("Error al buscar la imagen") }
        const data = await response.json();

        if (data && data.length > 0) {
            const imageInfo = data[0];
            return `data:${imageInfo.mimeType};base64,${imageInfo.fileData}`;
        } else {
            throw new Error("Imagen no encontrada en el servidor");
        }
    })();

    imageCache[imageUuid] = fetchPromise;

    fetchPromise.catch(() => {
        delete imageCache[imageUuid];
    })
    return fetchPromise;

}


export const preloadImagesIntoCache = (imagesUuids: (string | null | undefined)[]) => {

    const validUuids = [...new Set(imagesUuids)].filter(
        (id): id is string =>
            !!id &&
            id !== "null" &&
            id !== "undefined" &&
            uuidRegex.test(id.toString()) &&
            !(id in imageCache)
    );

    if (validUuids.length === 0) return;

    const batchPromise = (async () => {
        const token = await getValidToken();

        const requestBody = {
            filter: {
                ids: validUuids,
                includeData: true,
                quality: "LOW",
            },
            page: 0,
            size: validUuids.length
        };


        const response = await fetch(`${BASE_URL_DOCS}/file/searchImages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(requestBody),

        });


        if (!response.ok) {
            throw new Error("Error al hacer la petición masiva");
        }
        const data = await response.json();

        const resultMap: Record<string, string> = {};
        if (Array.isArray(data)) {
            data.forEach((img: any) => {
                if (img.fileData) {
                    resultMap[img.id] = `data:${img.mimeType};base64,${img.fileData}`;
                }
            });

        }
        return resultMap;
    })();

    validUuids.forEach(uuid => {
        imageCache[uuid] = batchPromise.then(resultMap => {
            if (resultMap[uuid]) {
                return resultMap[uuid];
            } else {
                throw new Error("El servidor no devolvió esta imagen en el bloque de uuids");
            }
        }).catch(err => {
            delete imageCache[uuid];
            throw err;
        })
    })
}




export const getNumericIdFromUuid = async (imageUuid: string): Promise<number | null> => {
    const token = await getValidToken();

    const requestBody = {
        filter: {
            ids: [imageUuid],
            includeData: false
        },
        page: 0,
        size: 1
    };
    const searchResponse = await fetch(`${BASE_URL_DOCS}/file/searchImages`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });
    if (!searchResponse.ok) {
        throw new Error("Error buscando los metadatos de la imagen");
    }
    const searchData = await searchResponse.json();
    if (!searchData || searchData.length === 0) {
        return null;
    }

    const docInfo = searchData[0];

    const numericId = docInfo.idDocs || docInfo.idDoc || docInfo.idDocument || docInfo.id;

    if (numericId === undefined || numericId === null) {
        console.error("Respuesta del servidor sin Id numérico: " + docInfo);
        throw new Error("El servidor no devolvio el Id numérico");
    }
    return Number(numericId);
}



export const downloadDocument = async (imageUuid: string, suggestedName?: string) => {
    const token = await getValidToken();


    const numericId = await getNumericIdFromUuid(imageUuid);

    const response = await fetch(`${BASE_URL_DOCS}/file/downloadFile/${numericId}/1`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error("Error al descargar la imagen: " + response.statusText);


    const blob = await response.blob();
    const extension = blob.type ? blob.type.split('/')[1] : 'jpg';

    const safeName = suggestedName ? suggestedName.replace(/[^a-z0-9]/gi, '_').toLocaleLowerCase() : `doc_${numericId}`;
    const finalFileName = `${safeName}.${extension}`;


    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = finalFileName;

    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

}


export const deleteDocument = async (imageUuid: string) => {

    const numericId = await getNumericIdFromUuid(imageUuid);
    if (!numericId) return true;

    const token = await getValidToken()
    const deleteRes = await fetch(`${BASE_URL_DOCS}/document/${numericId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!deleteRes.ok) {
        throw new Error(`Error al borrar el documento: ${deleteRes.statusText}`);
    }
    return true;

}