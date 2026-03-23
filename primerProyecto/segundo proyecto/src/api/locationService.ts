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


export const getMasterLocations = async (): Promise<MasterLocation[]> => {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL_MF}/v1/clients/${CLIENT_ID}/locations`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(`Error cargando localizaciones maestras: ${response.statusText}`);
    return response.json();
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



