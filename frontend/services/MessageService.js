// services/MessageService.js
export class MessageService {
    static async getMessages(conversationId) {
        const res = await fetch(`http://localhost:3000/messages/${conversationId}`);
        if (!res.ok) throw new Error("Error al cargar los mensajes");
        return await res.json();
    }

    static async sendMessage(conversationId, userId, text) {
        const res = await fetch(`http://localhost:3000/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId, userId, text })
        });
        if (!res.ok) throw new Error("Error al enviar el mensaje");
        return await res.json();
    }
}
