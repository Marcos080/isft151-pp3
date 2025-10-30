export class AuthService {
    
    // Método para el REGISTRO (POST /auth/register)
    static async register({ name, username, email, password }) {
        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, username, email, password })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 return { success: false, message: errorData.message || "Error al registrar usuario." };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error de conexión:", error);
            return { success: false, message: "Error de conexión con el servidor (verifique que Express esté corriendo)." };
        }
    }

    // Método para el LOGIN (POST /auth/login)
    static async login({ username, password }) {
        try {
            const response = await fetch("http://localhost:3000/auth/login", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }) 
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 return { success: false, message: errorData.message || "Credenciales inválidas." };
            }

            const data = await response.json();
            return data; 
        } catch (error) {
            console.error("Error de conexión:", error);
            return { success: false, message: "Error de conexión con el servidor (verifique que Express esté corriendo)." };
        }
    }
}