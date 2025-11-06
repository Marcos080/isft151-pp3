export class ChatService {
    static async getFollowedChats(userId) {
        const res = await fetch(`http://localhost:3000/chat/list/${userId}`);
        if (!res.ok) throw new Error("Error al obtener lista de chats");
        return res.json();
    }

    static async startConversation(userId, petId) {
        const res = await fetch(`http://localhost:3000/chat/start/${userId}/${petId}`, {
            method: "POST"
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al iniciar chat");
        return data;
    }

    static async sendMessage(id_conversation, id_sender, content) {
        const res = await fetch(`http://localhost:3000/chat/${id_conversation}/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_sender, content }),
        });
        return res.json();
    }

    static async getMessages(id_conversation) {
        const res = await fetch(`http://localhost:3000/chat/${id_conversation}/messages`);
        return res.json();
    }

    static async getUserConversations(userId) {
    const res = await fetch(`http://localhost:3000/chat/conversations/${userId}`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}
}
