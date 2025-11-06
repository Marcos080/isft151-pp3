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
}
