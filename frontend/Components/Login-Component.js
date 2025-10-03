import { UsersMock } from "../../backend/MockModel.js";

class LoginComponent extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
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

         //-------ACCIÓN DEL CONTROLLER---------------------------------------------------------------------------------------------

        const user = UsersMock.find(
          (u) =>
            u.name === name &&
          u.username === username &&
          u.email === email &&
          u.password === password 
    
        );

         //-----------------------------------------------------------------------------------------------------

        if (user){
          alert(`Bienvenido, ${user.name}`);
        } else{
          alert("Usuario o contraseña incorrectos");
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
    `;
  }



}

customElements.define("login-component", LoginComponent);