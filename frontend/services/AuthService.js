// services/AuthService.js
export class AuthService {

    // 🔐 Inicia sesión y guarda el token
    static async login({ username, password }) {
        try {
            const res = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.success && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user)); // opcional
            }

            return data;
        } catch (err) {
            console.error("Error en login:", err);
            return { success: false, error: err.message };
        }
    }


    

    // 🧾 Verifica si el token guardado sigue siendo válido
    static async verifyToken() {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const res = await fetch("/auth/verify", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) return false;

            const data = await res.json();
            return data.valid;
        } catch (err) {
            console.error("Error verificando token:", err);
            return false;
        }
    }

    // 🚪 Elimina el token y datos del usuario
    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("token borrado");
    }

    // ⚙️ Método auxiliar: obtiene el token actual
    static getToken() {
        return localStorage.getItem("token");
    }

    // ⚙️ Método auxiliar: cabeceras autenticadas para otros fetch
    static getAuthHeaders() {
        const token = this.getToken();
        return {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };
    }

    static getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Error leyendo token:", e);
        return null;
    }
    }


 // Método para el REGISTRO (POST /auth/register)
    static async register({ name, username, email, password }) {
        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, username, email, password })
            });
            // Si la respuesta no es 2xx, la manejamos como error (ej: 409 Conflict)
            if (!response.ok) {
                 const errorData = await response.json();
                 return { success: false, message: errorData.message || "Error al registrar usuario." };
            }
            // Si el registro es 201 Created
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error de conexión:", error);
            return { success: false, message: "Error de conexión con el servidor (verifique que Express esté corriendo)." };
        }
    }

    

}
