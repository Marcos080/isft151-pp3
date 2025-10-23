import { AuthController } from "../controllers/AuthController.js"
const authController = new AuthController();

class LoginComponent extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
        this.auth = authController;
    }

    connectedCallback(){
        this.render();

        const form = this.shadowRoot.querySelector("form");
        form.addEventListener("submit", (e) => this.handleLogin(e));   
     }

     async handleLogin(event) {
        event.preventDefault();

        //se toman los valores del form
        const name = this.shadowRoot.querySelector("#log-name").value;
        const username = this.shadowRoot.querySelector("#log-username").value;
        const email = this.shadowRoot.querySelector("#log-email").value;
        const password = this.shadowRoot.querySelector("#log-password").value;

        const result = this.auth.login({ name, username, email, password });

       alert(result.message);
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
          background: #4CAF50;
          color: white;
          cursor: pointer;
        }
      </style>
      <form>
        <input type="text" id="log-name" placeholder="Ingrese Nombre y Apellido" required>
        <input type="text" id="log-username" placeholder="Ingrese usuario" required>
        <input type="text" id="log-email" placeholder="Ingrese Email" required>
        <input type="password" id="log-password" placeholder="Ingrese contraseña" required>
        <button type="submit">Ingresar</button>
      </form>
      <a href = "../static/register.html">Registrarse</a>
      
    `;
  }



}

customElements.define("login-component", LoginComponent);