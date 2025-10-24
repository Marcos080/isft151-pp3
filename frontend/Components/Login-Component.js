// LoginComponent.js (CORREGIDO)

// 1. IMPORTACIÓN CORREGIDA: Usamos el servicio de frontend para las llamadas API
// AJUSTA ESTA RUTA si moviste el AuthService.js a una carpeta 'services'
import { AuthService } from "../services/AuthService.js"; 

// ELIMINADAS: Ya no necesitamos importar ni instanciar el controlador de backend
// const authController = new AuthController(); 

class LoginComponent extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
        // ELIMINADA: this.auth = authController;
    }

    connectedCallback(){
        this.render();

        const form = this.shadowRoot.querySelector("form");
        form.addEventListener("submit", (e) => this.handleLogin(e)); 
    }

    // HACEMOS ASÍNCRONA la función
    async handleLogin(event) { 
        event.preventDefault();

        // 3. SOLO TOMAMOS username y password (Lo necesario para login)
        // ELIMINADAS: las líneas que capturaban name y email
        const username = this.shadowRoot.querySelector("#log-username").value;
        const password = this.shadowRoot.querySelector("#log-password").value;

        // 4. USAMOS AWAIT para esperar la respuesta de la API
        const result = await AuthService.login({ username, password });

        alert(result.message);
        
        if (result.success) {
            console.log("Login exitoso:", result.user);
            // Aquí iría la lógica de redirección o guardar el token
        }
    }

    // 5. HTML SIMPLIFICADO: Eliminados los inputs innecesarios (name y email)
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
            <input type="text" id="log-username" placeholder="Ingrese usuario" required>
            <input type="password" id="log-password" placeholder="Ingrese contraseña" required>
            <button type="submit">Ingresar</button>
          </form>
          <a href = "../static/register.html">Registrarse</a>
        `;
    }
}

customElements.define("login-component", LoginComponent);