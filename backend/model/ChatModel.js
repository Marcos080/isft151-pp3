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
      const sql = `SELECT m.*, u.username AS sender_name
             FROM message m
             JOIN user u ON u.id = m.id_sender
             WHERE id_conversation = ?
             ORDER BY m.created_at ASC`;

      this.conexion.query(sql, [conversationId], (error, result) => {
        if (error){ reject(error); };

        if(result){console.log("mensajes encontrados"); resolve(result);};

      });
    });
  }


  conversationExists(id_conversation) {
    return new Promise((resolve, reject) =>
    {
      const sql = `SELECT id FROM conversation WHERE id = ?`

      this.conexion.execute(sql, [id_conversation], (error, result) =>
      {
        if(error){ console.log("error al ckekear conversasion"); reject(error);}

        if(result){ console.log("conversation exists salio bien"); resolve(result.length > 0);}

      });
    })
    }

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

getUserConversations(id_user) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        c.id AS conversation_id,
        c.id_pet,
        p.name AS pet_name,
        u1.username AS user1_name,
        u2.username AS user2_name,
        c.created_at
      FROM conversation c
      JOIN user u1 ON c.id_user1 = u1.id
      JOIN user u2 ON c.id_user2 = u2.id
      JOIN pet p ON c.id_pet = p.id
      WHERE c.id_user1 = ? OR c.id_user2 = ?
      ORDER BY c.created_at DESC;
    `;
    this.conexion.query(sql, [id_user, id_user], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

buscarDueño(id_pet)
{
  return new Promise((resolve, reject) =>
  {
    const buscar = `SELECT p.id AS id_pet, p.name AS pet_name, p.id_owner, u.username AS owner_name
         FROM pet p
         JOIN user u ON p.id_owner = u.id
         WHERE p.id = ?`;

    this.conexion.query(buscar, [id_pet], (error, result) =>
    {
      if(error){ console.log("error al buscar"+ error); reject(error);}

      if(result){ console.log("encontrado"); resolve(result);}
    })
  })
}




}

module.exports = { ChatModel };
