// /services/PetService.js
export class PetService {
    static async fetchAllPets() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3000/pets", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error(`Error al obtener mascotas (HTTP ${res.status})`);
            return await res.json();

        } catch (error) {
            console.error("❌ Error en PetService:", error);
            throw error;
        }
    }
}
