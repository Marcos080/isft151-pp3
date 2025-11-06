class ChatModel {
  constructor(conexion) {
    this.conexion = conexion;
  }

  // 🔍 Buscar conversación entre dos usuarios (sin importar el orden)
  findConversationBetween(id_user1, id_user2) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id 
        FROM conversation 
        WHERE (id_user1 = ? AND id_user2 = ?) 
           OR (id_user1 = ? AND id_user2 = ?)
      `;
      this.conexion.query(sql, [id_user1, id_user2, id_user2, id_user1], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  // 🆕 Crear conversación
  createConversation(id_user1, id_user2, id_pet) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO conversation (id_user1, id_user2, id_pet)
        VALUES (?, ?, ?)
      `;
      this.conexion.query(sql, [id_user1, id_user2, id_pet], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  // 🧠 Buscar o crear conversación
  async createOrFindConversation(id_user1, id_user2, id_pet) {
    const existing = await this.findConversationBetween(id_user1, id_user2);
    if (existing.length > 0) {
      console.log("✅ Conversación existente encontrada");
      return existing[0]; // ya existe
    }

    console.log("🆕 Creando nueva conversación...");
    const created = await this.createConversation(id_user1, id_user2, id_pet);
    return { id: created.insertId };
  }

  // 💬 Agregar mensaje
  addMessage(conversationId, senderId, content) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO message (id_conversation, id_sender, content) VALUES (?, ?, ?)`;
      this.conexion.query(sql, [conversationId, senderId, content], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  // 📜 Obtener mensajes
  getMessages(conversationId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, id_sender, content, created_at FROM message WHERE id_conversation = ? ORDER BY created_at ASC`;
      this.conexion.query(sql, [conversationId], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  // 🔹 Obtener dueño de mascota
  // getPetOwner(id_pet) {
  //   return new Promise((resolve, reject) => {
  //     const sql = `SELECT id_owner FROM pet WHERE id = ?`;
  //     this.conexion.query(sql, [id_pet], (error, result) => {
  //       if (error) return reject(error);
  //       if (!result.length) return resolve(null);
  //       resolve(result[0].id_owner);
  //     });
  //   });
  // }

  // 🐾 Obtener mascotas seguidas y sus dueños
  getFollowedPetsWithOwners(id_user) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT f.id_pet, p.name AS pet_name, p.id_owner, u.username AS owner_name
        FROM user_pet_follow f
        JOIN pet p ON f.id_pet = p.id
        JOIN user u ON p.id_owner = u.id
        WHERE f.id_user = ?;
      `;
      this.conexion.query(sql, [id_user], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}

module.exports = { ChatModel };
