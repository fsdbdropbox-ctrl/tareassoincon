// importamos la interfaz Factory
// src/api/factoryService.ts
// esto sirve para obtener las fábricas
// de un cliente específico desde la API
import { GridSortModel } from "@mui/x-data-grid/models";
import { Factory } from "../types/factory";

// URL base de la API, ajusta esto según la api que estés utilizando
// podría ser una URL local o una URL de producción
// ejemplos: 
// http://localhost:8080/snc-mf-api 
// https://desarrollo.emisuite.es/snc-mf-api/
const BASE_URL = "https://desarrollo.emisuite.es/snc-mf-api";

// variable para almacenar la promesa de refresco del token
// evitamos que se hagan múltiples peticiones de refresco del token
//  al mismo tiempo
let refreshTokenPromise: Promise<string> | null = null;


// función para obtener el token de autenticación
// post a https://desarrollo.emisuite.es/snc-security-ws/authenticate
// manda un body con el username y password, y devuelve el token que se recibe en la respuesta


export const logingAndGetToken = async () => {

    try {
        const response = await fetch("https://desarrollo.emisuite.es/snc-security-ws/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": "root",
                "password": "emi123!2025"
            })
        });

        if (!response.ok) {
            throw new Error(`Error logging in: ${response.statusText}`);
        }
        const data = await response.json();
        const token = data.token;

        const expirationTime = new Date().getTime() + (5 * 60 * 60 * 1000); // 5 hora en milisegundos

        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expirationTime.toString());

        return token;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}


// función para obtener un token válido,
//  ya sea el que está almacenado en localStorage o uno nuevo
//  si el token actual ha expirado

export const getValidToken = async () => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();
    // si el token existe y no ha expirado, lo devolvemos
    if (token && tokenExpiration && currentTime < parseInt(tokenExpiration)) {
        return token;
    }
    // si el token ha expirado o no existe, obtenemos uno nuevo
    if (refreshTokenPromise != null) {
        console.log("El token ya se está refrescando, espere un momento");
        return refreshTokenPromise;
    }
    // si no se está refrescando el token, lo hacemos nosotros
    console.log("El token ha expirado o no existe, obteniendo uno nuevo...");
    refreshTokenPromise = logingAndGetToken();
    try {
        // esperamos a que se obtenga el nuevo token y lo devolvemos
        const newToken = await refreshTokenPromise;
        return newToken;
    } finally {
        // una vez que se ha obtenido el nuevo token,
        //  limpiamos la promesa de refresco
        refreshTokenPromise = null;
    }

}




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
        // obtenemos un token válido para la autenticación
        const token = await getValidToken();
        // hacemos la petición a la API para obtener las fábricas del cliente,
        //  incluyendo el token en la cabecera de autorización
        const response = await fetch(`${BASE_URL}/v1/clients/${clientId}/factories`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
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

export const searchFactories = async (
    clientId: number,
    filters: any,
    page: number,
    size: number,
    sortModel: GridSortModel
): Promise<{ factories: Factory[], total: number }> => {
    const token = await getValidToken();

    try {
        let url = `${BASE_URL}/v1/clients/${clientId}/locations/search?page=${page}&size=${size}`;

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
            throw new Error(`Error posting factory: ${response.statusText}`);
        }
        const data = await response.json();


        return {
            factories: data.content || [],
            total: data.totalElements || 0
        };

    } catch (error) {
        console.error("Error searching factories:", error);
        throw error;
    }
}

