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

    // extraemos el nombre y la extension para la URL
    const extension = file.name.split(".").pop() || "png";
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || "imagen";

    // parámetros necesarios para la subida según el swagger
    const params = new URLSearchParams({
        name: nameWithoutExt,
        typeDoc: extension,
        idVersion: "1",
        idUser: "1",
        versionStatus: "1",
        reason: "1",
    });

    getValidToken().then(token => {
        const formData = new FormData();
        formData.append(fieldName, file, file.name);

        fetch(`${BASE_URL_DOCS}/file/uploadFile?${params.toString()}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
            signal: controller.signal
        }).then(response => {
            if (!response.ok) { throw new Error("Error en el servidor: " + response.status); }
            return response.json();
        })
            .then(data => {
                const serverId = data.idDocument?.toString();
                if (serverId) { load(serverId) }
                else { error("El servidor respondió pero no mandó Id del documento") }
            }).catch(err => {
                if (err.name !== 'AborError') {
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


export const downloadImage = async (
    idDocument: string,
    idVersion: string = "1"
): Promise<string> => {
    const token = await getValidToken();

    const response = await fetch(`${BASE_URL_DOCS}/file/downloadFile/${idDocument}/${idVersion}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/octet-stream"
        }
    });
    if (!response.ok) {
        throw new Error("No se pudo cargar la imagen")
    }
    const blob = await response.blob();

    return URL.createObjectURL(blob);
}