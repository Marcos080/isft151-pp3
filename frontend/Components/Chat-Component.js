import { ChatService } from "../services/ChatService.js";
import { AuthService } from "../services/AuthService.js";

export class ChatComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.user = AuthService.getUserFromToken();
    }

    async connectedCallback() {
        this.render();
        await this.loadChats();
    }

    async loadChats() {
        const container = this.shadowRoot.querySelector(".chat-list");
        container.innerHTML = "<p>Cargando chats...</p>";

        try {
            const chats = await ChatService.getFollowedChats(this.user.id);
            if (!chats.length) {
                container.innerHTML = "<p>No seguís ninguna mascota aún 🐾</p>";
                return;
            }

            container.innerHTML = chats.map(chat => `
                <div class="chat-item" data-pet-id="${chat.id_pet}">
                    🐶 ${chat.pet_name} (Dueño: ${chat.owner_name})
                </div>
            `).join("");

            container.querySelectorAll(".chat-item").forEach(item => {
                item.addEventListener("click", async (e) => {
                    const petId = e.currentTarget.dataset.petId;
                    const data = await ChatService.startConversation(this.user.id, petId);
                    console.log("✅ Conversación iniciada:", data);
                });
            });
        } catch (err) {
            container.innerHTML = `<p>Error: ${err.message}</p>`;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .chat-list { padding: 1rem; }
                .chat-item { cursor: pointer; padding: 0.5rem; border-bottom: 1px solid #ccc; }
                .chat-item:hover { background: #f0f0f0; }
            </style>
            <div class="chat-container">
                <h2>Mis Chats</h2>
                <div class="chat-list"></div>
            </div>
        `;
    }
}
customElements.define("chat-component", ChatComponent);
