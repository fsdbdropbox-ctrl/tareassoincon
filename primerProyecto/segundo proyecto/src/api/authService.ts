// src/api/authService.ts

let refreshTokenPromise: Promise<string> | null = null;

export const logingAndGetToken = async () => {
    try {
        const response = await fetch("http://192.168.0.30:8080/snc-security-ws/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": "root",
                "password": "emi123!2025" // Ajusta si la contraseña cambió
            })
        });

        if (!response.ok) {
            throw new Error(`Error logging in: ${response.statusText}`);
        }
        const data = await response.json();
        const token = data.token;
        const expirationTime = new Date().getTime() + (5 * 60 * 60 * 1000);

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

    if (token && tokenExpiration && currentTime < parseInt(tokenExpiration)) {
        return token;
    }

    if (refreshTokenPromise != null) {
        return refreshTokenPromise;
    }

    refreshTokenPromise = logingAndGetToken();
    try {
        const newToken = await refreshTokenPromise;
        return newToken;
    } finally {
        refreshTokenPromise = null;
    }
}