// importamos la interfaz Factory
// src/api/factoryService.ts
// esto sirve para obtener las fábricas
// de un cliente específico desde la API
import { Factory } from "../types/factory";

// URL base de la API, ajusta esto según la api que estés utilizando
// podría ser una URL local o una URL de producción
// ejemplos: 
// http://localhost:8080/snc-mf-api 
// https://desarrollo.emisuite.es/snc-mf-api/
const BASE_URL = "http://192.168.0.30:8080/snc-mf-api";


// función para obtener las fábricas de un cliente específico
// recibe el ID del cliente como parámetro y devuelve una promesa que resuelve a un array de fábricas
// valor esperado: un array de objetos que cumplen con la interfaz Factory
// valor devuelto un objeto literal con todos los datos de la fábrica
// ejemplo de uso:
// getFactories(1)
//     .then(factories => console.log(factories))
//     .catch(error => console.error("Error fetching factories:", error));
// ejemplo de resultado esperado:
// para verlo ir a postman y hacer una petición GET a
// http://192.168.0.30:8080/snc-mf-api/v1/clients/1/factories

export const getFactories = async (clientId: number): Promise<Factory[]> => {

    try {
        const response = await fetch(`${BASE_URL}/v1/clients/${clientId}/factories`);
        if (!response.ok) {
            throw new Error(`Error fetching factories: ${response.statusText}`);
        }
        const factories = await response.json();
        return factories;
    } catch (error) {
        console.error("Error fetching factories:", error);
        throw error;
    }


}