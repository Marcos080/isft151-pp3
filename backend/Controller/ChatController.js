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

      // 🔍 Buscar la mascota seguida o propiedad
      const followed = await this.model.getFollowedPetsWithOwners(id_user);
      let pet = followed.find(p => p.id_pet == id_pet);

      if (!pet) {
        // Si no la sigue, buscamos si el usuario es el dueño
        const rows = await this.model.buscarDueño(id_pet);
        
        if (rows && rows.length > 0) {
          const data = rows[0];
          // el dueño chatea con el seguidor
          if (data.id_owner == id_user) {
            pet = data; // el dueño puede iniciar/ver chat
          }
        }
      }

      if (!pet) {
        return res.status(404).json({ message: "Mascota no encontrada o no seguida" });
      }

      // 🧠 Buscar o crear conversación (puede ser dueño o seguidor)
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


     // ✉️ Enviar mensaje
      this.app.post("/chat/:id_conversation/message", async (req, res) => {
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
      });

        // 📥 Obtener mensajes
        this.app.get("/chat/:id_conversation/messages", async (req, res) => {
            try {
                const { id_conversation } = req.params;
                const messages = await this.model.getMessages(id_conversation);
                res.json(messages);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

      // 🔹 Listar conversaciones activas donde participa el usuario
      this.app.get("/chat/conversations/:id_user", async (req, res) => {
        try {
          const { id_user } = req.params;
          const rows = await this.model.getUserConversations(id_user);
          res.json(rows);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      });

  }
}

module.exports = { ChatController };
