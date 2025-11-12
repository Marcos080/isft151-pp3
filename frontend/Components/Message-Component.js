import { AuthService } from "../services/AuthService.js";
import { ChatService } from "../services/ChatService.js";

export class MessageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.messages = [];
    this.user = null;
    this.conversationId = null;
  }

  async connectedCallback() {
    this.render();

    // ✅ Cargar usuario desde el token
    this.user = AuthService.getUserFromToken();

    if (!this.user) {
      this.shadowRoot.querySelector("#messages").innerHTML =
        "<p>⚠️ No estás autenticado. Iniciá sesión para enviar mensajes.</p>";
      return;
    }

    this.conversationId = this.getAttribute("conversation-id");
    if (!this.conversationId) {
      this.shadowRoot.querySelector("#messages").innerHTML =
        "<p>❌ No hay conversación seleccionada.</p>";
      return;
    }

    await this.loadMessages();
    this.setupEvents();
  }

  // 🔹 Cargar mensajes del backend usando ChatService
  async loadMessages() {
    try {
      this.messages = await ChatService.getMessages(this.conversationId);
      this.renderMessages();
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
      this.shadowRoot.querySelector("#messages").innerHTML =
        "<p>Error al cargar los mensajes 😞</p>";
    }
  }

  // 🔹 Enviar mensaje nuevo usando ChatService
  async sendMessage(content) {
    if (!this.user) {
      console.error("⚠️ No hay usuario autenticado.");
      return;
    }

    try {
      const data = await ChatService.sendMessage(
        this.conversationId,
        this.user.id,
        content
      );
      console.log("✅ Mensaje enviado:", data);
      await this.loadMessages(); // refresca los mensajes
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  }

  // 🔹 Renderizar mensajes
  renderMessages() {
    const container = this.shadowRoot.querySelector("#messages");
    if (!container) return;

    container.innerHTML = this.messages
      .map((msg) => {
        const isMine = msg.id_sender === this.user?.id;
        return `
          <div class="message ${isMine ? "mine" : "theirs"}">
            <p>${msg.content}</p>
            <span class="time">${new Date(msg.created_at).toLocaleTimeString()}</span>
          </div>
        `;
      })
      .join("");

    container.scrollTop = container.scrollHeight;
  }

  // 🔹 Configurar eventos
  setupEvents() {
    const form = this.shadowRoot.querySelector("#message-form");
    const input = this.shadowRoot.querySelector("#message-input");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = input.value.trim();
      if (!content) return;
      await this.sendMessage(content);
      input.value = "";
    });
  }

  // 🔹 Render base del componente
  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/public/css/message-styles.css">
      <div class="message-container">
        <div id="messages"></div>
        <form id="message-form">
          <input type="text" id="message-input" placeholder="Escribí un mensaje..." />
          <button type="submit">Enviar</button>
        </form>
      </div>
    `;
  }
}

customElements.define("message-component", MessageComponent);
