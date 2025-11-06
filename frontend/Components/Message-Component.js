import { AuthService } from "../services/AuthService.js";

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

    // Si no hay usuario autenticado, mostrar aviso
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

  // 🔹 Cargar mensajes del backend
  async loadMessages() {
    try {
      const res = await fetch(`http://localhost:3000/chat/${this.conversationId}/messages`);
      if (!res.ok) throw new Error(await res.text());

      this.messages = await res.json();
      this.renderMessages();
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
      this.shadowRoot.querySelector("#messages").innerHTML =
        "<p>Error al cargar los mensajes 😞</p>";
    }
  }

  // 🔹 Enviar mensaje nuevo
  async sendMessage(content) {
    if (!this.user) {
      console.error("⚠️ No hay usuario autenticado.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/chat/${this.conversationId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_sender: this.user.id, // ✅ asegurado que no sea null
          content,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
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
      e.preventDefault(); // ✅ evita el reload del SPA
      const content = input.value.trim();
      if (!content) return;
      await this.sendMessage(content);
      input.value = "";
    });
  }

  // 🔹 Render base del componente
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .message-container {
            display: flex;
            flex-direction: column;
            height: 400px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 10px;
            overflow: hidden;
            font-family: "Segoe UI", sans-serif;
            background: #f4f6f9;
        }

        #messages {
            flex: 1;
            padding: 10px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .message {
            margin: 8px 0;
            padding: 10px 14px;
            border-radius: 18px;
            max-width: 70%;
            word-wrap: break-word;
            font-size: 0.95em;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .mine {
            background: #007bff;       /* 💬 azul para mensajes propios */
            color: white;               /* texto blanco */
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }

        .theirs {
            background: #e9ecef;        /* 💬 gris claro para los mensajes del otro */
            color: #212529;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }

        .time {
            display: block;
            font-size: 0.75em;
            margin-top: 4px;
            color: rgba(255,255,255,0.8);
            text-align: right;
        }

        .theirs .time {
            color: #666;
            text-align: left;
        }

        form {
            display: flex;
            border-top: 1px solid #ccc;
            background: white;
        }

        input {
            flex: 1;
            border: none;
            padding: 12px;
            font-size: 1em;
            outline: none;
            background: #fff;
        }

        button {
            border: none;
            background: #007bff;
            color: white;
            padding: 0 20px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
        }

        button:hover {
            background: #0056b3;
        }
        </style>

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
