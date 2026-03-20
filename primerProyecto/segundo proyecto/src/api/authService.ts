// src/api/authService.ts

let refreshTokenPromise: Promise<string> | null = null;

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