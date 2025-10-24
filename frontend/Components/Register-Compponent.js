// RegisterComponent.js (CORREGIDO)

// 1. IMPORTACIÓN CORREGIDA: Usamos el servicio de frontend para las llamadas API
// AJUSTA ESTA RUTA si mueves el AuthService.js a una carpeta 'services'
import { AuthService } from "../services/AuthService.js"; 

// 2. ELIMINADAS: Ya no necesitamos importar ni instanciar el controlador de backend
// const authController = new AuthController();

class RegisterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // ELIMINADA: this.auth = authController;
    }

    connectedCallback(){
        this.render();
        const form = this.shadowRoot.querySelector("form")
        // Enlazamos el evento
        form.addEventListener("submit", (e) => this.handlerRegister(e));
    }

    // 3. FUNCIÓN ASÍNCRONA: Debe ser 'async' para usar 'await'
    async handlerRegister(event){ 
        event.preventDefault();

        // Toma de valores (correcto)
        const name = this.shadowRoot.querySelector("#reg-name").value;
        const username = this.shadowRoot.querySelector("#reg-username").value;
        const email = this.shadowRoot.querySelector("#reg-email").value;
        const password = this.shadowRoot.querySelector("#reg-password").value;

        // 4. USAR AWAIT: Llamamos al método estático del servicio y esperamos la respuesta
        const result = await AuthService.register({ name, username, email, password });

        alert(result.message);

        // La lógica de manejo de respuesta es correcta
        if(result.success){
          this.shadowRoot.querySelector("form").reset();
        }
    }

    render() {
        // El HTML y los estilos están correctos para el registro
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