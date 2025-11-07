import { ChatService } from "../services/ChatService.js";
import { AuthService } from "../services/AuthService.js";
import "./Message-Component.js"

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

  // 🔹 Carga todas las conversaciones donde el usuario participa
  async loadChats() {
    const container = this.shadowRoot.querySelector(".chat-list");
    container.innerHTML = "<p>Cargando chats...</p>";

    try {
      // 👉 Trae todas las conversaciones (ya sea como dueño o seguidor)
      const chats = await ChatService.getUserConversations(this.user.id);

      if (!chats.length) {
        container.innerHTML = "<p>No tenés conversaciones aún 🐾</p>";
        return;
      }

      // Renderiza la lista de conversaciones
      container.innerHTML = chats
        .map(
          (chat) => `
            <div class="chat-item" data-conversation-id="${chat.conversation_id}" data-pet-name="${chat.pet_name}" >
               🦴  ${chat.pet_name} 
            </div>
          `
        )
        .join("");

      // Agregamos los listeners
      container.querySelectorAll(".chat-item").forEach((item) => {
        item.addEventListener("click", async (e) => {
          const convId = e.currentTarget.dataset.conversationId;
          const petName = e.currentTarget.dataset.petName;
          const ownerName = e.currentTarget.dataset.ownerName;
          await this.openConversation(convId, petName, ownerName);
        });
      });
    } catch (err) {
      console.error(" Error al cargar chats:", err);
      container.innerHTML = `<p>Error al cargar chats: ${err.message}</p>`;
    }
  }

  // 🔹 Abre una conversación existente
  async openConversation(conversationId, petName, ownerName) {
    try {
      const chatContainer = this.shadowRoot.querySelector(".chat-area");
      chatContainer.innerHTML = "<p>Abriendo conversación...</p>";

      // Renderizamos el componente de mensajes
      chatContainer.innerHTML = `
        <h3>🐾 Chat sobre ${petName} </h3>
        <message-component conversation-id="${conversationId}"></message-component>
      `;
    } catch (err) {
      console.error(" Error al abrir conversación:", err);
      const chatContainer = this.shadowRoot.querySelector(".chat-area");
      chatContainer.innerHTML = `<p>Error al abrir conversación: ${err.message}</p>`;
    }
  }


  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .chat-container {
          display: flex;
          grid-template-columns: 30% 70%;
          height: 600px;
          width: 1000px;
          border: 1px solid #ff9500ff;
          border-radius: 10px;
          overflow: hidden;
          font-family: sans-serif;

          box-shadow: 0 0 20px 5px rgba(255, 98, 0, 0.9); ;
        }

        .chat-list {
          border-right: 1px solid #ff9500ff;
          overflow-y: auto;
          padding: 10px;
          background: #2e2e2e;

           flex: 0 0 30%;  /* ancho fijo 30%, no crece ni se encoge */

   
        }

        .chat-item {
          cursor: pointer;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 5px;
          transition: background 0.2s;
        }

        .chat-item:hover {
          background: #ff6200e6;
        }

        .chat-area {
          padding: 15px;
          background: #232323ff;
          display: flex;
          flex-direction: column;

          flex: 1;
          overflow: hidden; 
        }

        h2 {
          margin: 0 0 10px 0;
        }
      </style>

      <div class="chat-container">
        <div class="chat-list">
          <h2>Mis Chats</h2>
        </div>
        <div class="chat-area">
          <p>Seleccioná una conversación 🐕</p>
        </div>
      </div>
    `;
  }
}

customElements.define("chat-component", ChatComponent);
