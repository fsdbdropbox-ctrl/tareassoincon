import { GridSortModel } from "@mui/x-data-grid/models";
import { Material, MaterialFilter } from "../types/materials";
import { getValidToken } from "./authService";

const BASE_URL = "https://desarrollo.emisuite.es/snc-mf-api";



// función para buscar materiales
// post a https://desarrollo.emisuite.es/snc-mf-api/v1/materials/search
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
        let url = `${BASE_URL}/v1/materials/search?page=${page}&size=${pageSize}`;
        if (sortModel && sortModel.length > 0) {
            const sort = sortModel[0];
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
            throw new Error(`Error searching materials: ${response.statusText}`);
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
// post a https://desarrollo.emisuite.es/snc-mf-api/v1/materials
// manda un body con los datos del material
// y devuelve el material
export const createMaterial = async (materialData: Partial<Material>): Promise<Material> => {
    const token = await getValidToken();

    const fullMaterialData = {
        ...materialData,
        clientId: 1,
        active: true,
        versionLock: 0
    }

    const response = await fetch(`${BASE_URL}/v1/materials`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(fullMaterialData)
    });

    if (!response.ok) {
        throw new Error(`Error creating material: ${response.statusText}`);
    }
    return response.json();
}

// función para actualizar un material
// put a https://desarrollo.emisuite.es/snc-mf-api/v1/materials/{materialId}
// manda un body con los datos del material
// y devuelve el material actualizado
export const updateMaterial = async (materialId: number, materialData: Partial<Material>): Promise<Material> => {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/v1/materials/${materialId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(materialData)
    });
    if (!response.ok) {
        throw new Error(`Error updating material: ${response.statusText}`);
    }
    return response.json();
}


// función para borrar un material
// delete a https://desarrollo.emisuite.es/snc-mf-api/v1/materials/{materialId}
// y devuelve void
export const deleteMaterial = async (materialId: number): Promise<void> => {
    const token = await getValidToken();
    const response = await fetch(`${BASE_URL}/v1/materials/${materialId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Error deleting material: ${response.statusText}`);
    }
}