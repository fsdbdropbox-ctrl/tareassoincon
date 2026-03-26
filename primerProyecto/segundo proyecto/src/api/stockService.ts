import { getValidToken } from "./authService";

const BASE_URL_VS = "https://desarrollo.emisuite.es/snc-vs-api";


export const getInitialPhysicalStock = async (clientId: number = 1) => {
    const token = await getValidToken();

    const response = await fetch(`${BASE_URL_VS}/v1/clients/${clientId}/stock/physical`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({})

    });
    if (!response.ok) {
        throw new Error("Error obteniendo el stock inicial");
    }
    return response.json();
}
