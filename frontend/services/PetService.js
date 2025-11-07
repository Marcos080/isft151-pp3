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

    // Agregar mascota
    static async addPet({ id_owner, name, age, description }) {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3000/pet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id_owner, name, age, description })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error agregando mascota");
            }

            return await res.json();
        } catch (error) {
            console.error("❌ Error al agregar mascota:", error);
            throw error;
        }
    }

    // Borrar mascota
    static async deletePet(id) {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3000/pet", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error borrando mascota");
            }

            return await res.json();
        } catch (error) {
            console.error("❌ Error al borrar mascota:", error);
            throw error;
        }
    }

    // Subir foto de mascota
    static async uploadPhoto(petId, file) {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("photo", file);

            const res = await fetch(`http://localhost:3000/pet/${petId}/photo`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error subiendo la foto");
            }

            return await res.json(); // Devuelve { message, photoUrl }
        } catch (error) {
            console.error("❌ Error al subir foto de mascota:", error);
            throw error;
        }
    }
}