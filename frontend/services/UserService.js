
export class UserService {
    static async likePet(id_user, id_pet) {
        try {
            const response = await fetch(`/users/${id_user}/follow/${id_pet}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log("Mascota seguida con éxito:", data);
            return data;
        } catch (error) {
            console.error("Error al seguir mascota:", error);
            throw error;
        }
    }
}
