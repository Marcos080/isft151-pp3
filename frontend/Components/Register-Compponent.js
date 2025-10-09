import { AuthController } from "../controllers/AuthController.js"
const authController = new AuthController();

class RegisterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.auth = authController;
    }

    connectedCallback(){
        this.render();

        const form = this.shadowRoot.querySelector("form")
        form.addEventListener("submit", (e) => this.handlerRegister(e));
    }

    handlerRegister(event){
        event.preventDefault();

        const name = this.shadowRoot.querySelector("#reg-name").value;
        const username = this.shadowRoot.querySelector("#reg-username").value;
        const email = this.shadowRoot.querySelector("#reg-email").value;
        const password = this.shadowRoot.querySelector("#reg-password").value;

        const result = this.auth.register({ name, username, email, password });

        alert(result.message);

        if(result.success){
          this.shadowRoot.querySelector("form").reset();
        }

    }

     render() {
    this.shadowRoot.innerHTML = `
     <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 250px;
        }
        input, button {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          background: #cf3838ff;
          color: white;
          cursor: pointer;
        }
      </style>
      <form>
        <input type="text" id="reg-name" placeholder="Nombre y Apellido" required>
        <input type="text" id="reg-username" placeholder="Usuario" required>
        <input type="text" id="reg-email" placeholder="Email" required>
        <input type="password" id="reg-password" placeholder="Contraseña" required>
        <button type="submit">Registrarse</button>
      </form>
    `;
  }
    
}

customElements.define("register-component", RegisterComponent);