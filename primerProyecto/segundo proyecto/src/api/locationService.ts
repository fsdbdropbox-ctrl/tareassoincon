import { getValidToken } from "./authService";
import { MasterLocation, LocationMaterial } from "../types/MasterLocations";

const BASE_URL_VS = "https://desarrollo.emisuite.es/snc-vs-api";
const CLIENT_ID = 1;

const BASE_URL_MF = "https://desarrollo.emisuite.es/snc-mf-api";

export const getLocationMaterials = async (locationId: number): Promise<LocationMaterial[]> => {

    const token = await getValidToken();

    const response = await fetch(`${BASE_URL_VS}/v1/clients/${CLIENT_ID}/locations/${locationId}/materials`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error(`Error fetching materials: ${response.statusText}`);
    }
    const data = await response.json();
    return data._embedded?.locationMaterials || [];
}


// export const getMasterLocations = async (): Promise<MasterLocation[]> => {
//     const token = await getValidToken();
//     const response = await fetch(`${BASE_URL_MF}/v1/clients/${CLIENT_ID}/locations`, {
//         method: "GET",
//         headers: { "Authorization": `Bearer ${token}` }
//     });

//     if (!response.ok) throw new Error(`Error cargando localizaciones maestras: ${response.statusText}`);
//     return response.json();
// };


export const searchMasterLocations = async (
    page: number = 0,
    size: number = 5,
    filters: any = {}
): Promise<{ locations: MasterLocation[], total: number }> => {
    const token = await getValidToken();

    const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
    )

    const response = await fetch(`${BASE_URL_MF}/v1/clients/${CLIENT_ID}/locations/search?page=${page}&size=${size}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }, body: JSON.stringify(cleanedFilters)
    });
    if (!response.ok) {
        throw new Error("Error buscando localizaciones: " + response.statusText);
    }
    const data = await response.json();

    return {
        locations: data.content || data,
        total: data.totalElements || data.length || 0
    };
};

export const addMaterialToLocation = async (materialData: Partial<LocationMaterial>): Promise<LocationMaterial> => {
    const token = await getValidToken();

    const fullData = {
        ...materialData,
        clientId: CLIENT_ID,
        active: true,
        versionLock: 0
    };

    const response = await fetch(`${BASE_URL_VS}/v1/clients/${CLIENT_ID}/locationMaterials`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(fullData)
    });

    if (!response.ok) throw new Error(`Error añadiendo el material: ${response.statusText}`);
    return response.json();
}



export const updateLocationMaterial = async (id: number, materialData: Partial<LocationMaterial>): Promise<LocationMaterial> => {

    const token = await getValidToken();

    const response = await fetch(`${BASE_URL_VS}/v1/clients/${CLIENT_ID}/locationMaterials/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(materialData)
    });
    if (!response.ok) throw new Error(`Error actualizando material: ${response.statusText}`);
    return response.json();
};



export const deleteLocationMaterial = async (id: number): Promise<void> => {

    const token = await getValidToken();

    const response = await fetch(`${BASE_URL_VS}/v1/clients/${CLIENT_ID}/locationMaterials/${id}`, {

        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) throw Error(`Error eliminando material: ${response.statusText}`)

};


export const getLocationById = async (id: number) => {

    const token = await getValidToken();
    const response = await fetch(`${BASE_URL_MF}/v1/clients/${CLIENT_ID}/locations/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error("Error al obtener la localización");
    }
    return response.json();
}

export const deleteLocation = async (locationId: number): Promise<void> => {
    const token = await getValidToken();

    const response = await fetch(`${BASE_URL_MF}/v1/clients/${CLIENT_ID}/locations/${locationId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(`Error eliminando localización: ${response.statusText}`);

}



export const createLocation = async (locationData: Partial<MasterLocation>): Promise<MasterLocation> => {
    const token = await getValidToken();

    const { id, createdAt, modifiedAt, modifiedBy, ...cleanData } = locationData as any;

    const fullLocationData = {
        clientId: CLIENT_ID,
        name: cleanData.name || "",
        code: cleanData.code || "",
        description: cleanData.description || "",
        externalCode: cleanData.externalCode || "",
        allowStorage: Boolean(cleanData.allowStorage),
        allowOtherMaterials: Boolean(cleanData.allowOtherMaterials),
        allowMaterialRequests: Boolean(cleanData.allowMaterialRequests),
        imageUuid: cleanData.imageUuid && cleanData.imageUuid !== "" ? cleanData.imageUuid : null,
        active: true,
        versionLock: 0,
        length: 1,
        height: 1,
        width: 1,
        maxBoxAllowed: 1,
        childrenNumber: 0,
        layoutId: null,
        layoutMap: null,
        parentLocationId: null
    };

    const response = await fetch(`${BASE_URL_MF}/v1/clients/${CLIENT_ID}/locations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(fullLocationData)
    });

    if (!response.ok) {
        throw new Error(`Error creando localización: ${response.statusText}`);
    }
    return response.json();
};


export const updateLocation = async (locationId: number, locationData: Partial<MasterLocation>): Promise<MasterLocation> => {
    const token = await getValidToken();

    const response = await fetch(`${BASE_URL_MF}/v1/clients/${CLIENT_ID}/locations/${locationId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(locationData)
    });

    if (!response.ok) {
        throw new Error(`Error actualizando localización: ${response.statusText}`);
    }
    return response.json();
};

