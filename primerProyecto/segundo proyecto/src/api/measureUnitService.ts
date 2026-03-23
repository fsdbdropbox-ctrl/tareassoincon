import { getValidToken, logingAndGetToken } from "./authService";

const BASE_URL = "https://desarrollo.emisuite.es/snc-mf-api"
const CLIENT_ID = 1;

export const getMeasureUnits = async (clientId: number = CLIENT_ID) => {
    const token = await getValidToken();

    try {

        const response = await fetch(`${BASE_URL}/v1/clients/${clientId}/measureUnits`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching measureUnits: ${response.statusText}`);
        }
        const measureUnits = await response.json();
        return measureUnits;
    } catch (error) {
        console.error("Error fetching measureUnits:", error);
        throw error;
    }
}