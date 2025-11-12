class ChatController {
    constructor(model) {
        this.model = model;
    }

    async listarChats(req, res) {
        try {
            const { id_user } = req.params;
            const rows = await this.model.getFollowedPetsWithOwners(id_user);
            res.json(rows);
        } catch (err) {
            console.error("❌ Error en /chat/list:", err);
            res.status(500).json({ error: err.message });
        }
    }

    async iniciarChat(req, res) {
        try {
            const { id_user, id_pet } = req.params;

            const followed = await this.model.getFollowedPetsWithOwners(id_user);
            let pet = followed.find(p => p.id_pet == id_pet);

            if (!pet) {
                const rows = await this.model.buscarDueño(id_pet);
                if (rows && rows.length > 0) {
                    const data = rows[0];
                    if (data.id_owner == id_user) pet = data;
                }
            }

            if (!pet) {
                return res.status(404).json({ message: "Mascota no encontrada o no seguida" });
            }

            const conversation = await this.model.createOrFindConversation(
                id_user,
                pet.id_owner,
                id_pet
            );

            res.json({
                message: "Conversación lista",
                conversationId: conversation.id,
                owner: pet.owner_name,
                petName: pet.pet_name
            });
        } catch (err) {
            console.error("❌ Error en /chat/start:", err);
            res.status(500).json({ error: err.message });
        }
    }

    async enviarMensaje(req, res) {
        try {
            const { id_conversation } = req.params;
            const { id_sender, content } = req.body;

            if (!content) return res.status(400).json({ error: "Mensaje vacío" });

            const exists = await this.model.conversationExists(id_conversation);
            if (!exists) return res.status(404).json({ error: "Conversación no encontrada" });

            const created = await this.model.addMessage(id_conversation, id_sender, content);
            res.json({ message: "Mensaje enviado", id: created.insertId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async obtenerMensajes(req, res) {
        try {
            const { id_conversation } = req.params;
            const messages = await this.model.getMessages(id_conversation);
            res.json(messages);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async listarConversaciones(req, res) {
        try {
            const { id_user } = req.params;
            const rows = await this.model.getUserConversations(id_user);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ChatController;
