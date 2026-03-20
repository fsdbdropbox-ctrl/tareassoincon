import { GridSortModel } from "@mui/x-data-grid/models";
import { Material, MaterialFilter } from "../types/materials";
import { getValidToken } from "./authService";

const BASE_URL = "https://desarrollo.emisuite.es/snc-mf-api";
const CLIENT_ID = 1;


// función para buscar materiales
// post a https://desarrollo.emisuite.es/snc-mf-api/v1/materials/clients/{id}/materialGenerics/search
// manda un body con los filtros, la página y el tamaño de la página
// y devuelve los materiales y el total de materiales
export const searchMaterials = async (
    filters: MaterialFilter,
    page: number,
    pageSize: number,
    sortModel: GridSortModel
): Promise<{ materials: Material[], total: number }> => {
    const token = await getValidToken();
    try {
        // Ajustamos la URL a la estructura real: /v1/clients/{id}/materialGenerics/search
        let url = `${BASE_URL}/v1/clients/${CLIENT_ID}/materialGenerics/search?page=${page}&size=${pageSize}`;

        if (sortModel && sortModel.length > 0) {
            const sort = sortModel[0];
            // Importante: El separador suele ser ; o , según la API
            url += `&sort=${sort.field}%3B${sort.sort}`;
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(filters)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return {
            materials: data.content || [],
            total: data.totalElements || 0
        };
    } catch (error) {
        console.error("Error searching materials:", error);
        throw error;
    }
}


// función para crear un material
// post a https://desarrollo.emisuite.es/snc-mf-api/v1/clients/{id}/materialGenerics
// manda un body con los datos del material
// y devuelve el material
export const createMaterial = async (materialData: Partial<Material>): Promise<Material> => {
    const token = await getValidToken();
    const fullMaterialData = {
        ...materialData,
        clientId: CLIENT_ID,
        active: true,
        versionLock: 0
    }

    const response = await fetch(`${BASE_URL}/v1/clients/${CLIENT_ID}/materialGenerics`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(fullMaterialData)
    });

    if (!response.ok) throw new Error(`Error creating material: ${response.statusText}`);
    return response.json();
}

// 3. ACTUALIZAR (Cambio de ruta)
export const updateMaterial = async (materialId: number, materialData: Partial<Material>): Promise<Material> => {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/v1/clients/${CLIENT_ID}/materialGenerics/${materialId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(materialData)
    });
    if (!response.ok) throw new Error(`Error updating material: ${response.statusText}`);
    return response.json();
}

// 4. BORRAR (Cambio de ruta)
export const deleteMaterial = async (materialId: number): Promise<void> => {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/v1/clients/${CLIENT_ID}/materialGenerics/${materialId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error(`Error deleting material: ${response.statusText}`);
}