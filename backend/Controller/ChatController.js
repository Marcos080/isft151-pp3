class ChatController {
  constructor(app, model) {
    this.app = app;
    this.model = model;
    this.cargarRutas();
  }

  cargarRutas() {
    // 📋 Listar chats posibles (dueños de mascotas seguidas)
    this.app.get("/chat/list/:id_user", async (req, res) => {
      try {
        const { id_user } = req.params;
        const rows = await this.model.getFollowedPetsWithOwners(id_user);
        res.json(rows);
      } catch (err) {
        console.error("❌ Error en /chat/list:", err);
        res.status(500).json({ error: err.message });
      }
    });

    // 🟢 Iniciar conversación (buscar o crear)
    this.app.post("/chat/start/:id_user/:id_pet", async (req, res) => {
      try {
        const { id_user, id_pet } = req.params;

        // 🔍 Buscar la mascota seguida y su dueño
        const followed = await this.model.getFollowedPetsWithOwners(id_user);
        const pet = followed.find(p => p.id_pet == id_pet);
        if (!pet) {
          return res.status(404).json({ message: "Mascota no encontrada o no seguida" });
        }

        // 🧠 Buscar o crear conversación
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
    });
  }
}

module.exports = { ChatController };
