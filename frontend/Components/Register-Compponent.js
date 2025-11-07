// RegisterComponent.js (FINALIZADO)
import { AuthService } from "../services/AuthService.js"; 

class RegisterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // Si tu AuthService fuera de instancia, lo harías aquí:
        // this.authService = new AuthService(); 
    }

    connectedCallback(){
        this.render();
        this.addEventListeners(); // Función para centralizar listeners
    }

    addEventListeners() {
        const form = this.shadowRoot.querySelector("form");
        const btnLogin = this.shadowRoot.querySelector(".btn-login-redirect"); 
        
        // 1. Listener para el registro (submit)
        form.addEventListener("submit", (e) => this.handlerRegister(e));

        // 2. Listener para volver al Login (Redirección SPA)
        btnLogin.addEventListener("click", this.handlerNavigateToLogin.bind(this));
    }

    // NUEVO: Maneja el retorno al login mediante evento
    handlerNavigateToLogin() {
        const navigateEvent = new CustomEvent('navigate', {
            bubbles: true, 
            composed: true, 
            detail: { 
                view: 'login' // Indica al Router que cargue el login
            }
        });
        this.dispatchEvent(navigateEvent);
    }

    async handlerRegister(event){ 
        event.preventDefault();

        const name = this.shadowRoot.querySelector("#reg-name").value;
        const username = this.shadowRoot.querySelector("#reg-username").value;
        const email = this.shadowRoot.querySelector("#reg-email").value;
        const password = this.shadowRoot.querySelector("#reg-password").value;

        // Llamada al método estático del servicio
        const result = await AuthService.register({ name, username, email, password });

        alert(result.message);

        if(result.success){
            this.shadowRoot.querySelector("form").reset();
            // OPCIONAL: Si el registro es exitoso, navegar a Login.
            this.handlerNavigateToLogin(); 
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/register-style.css"> 
            
            <div class="login-page-wrapper">
                <div class="login-container">
                    <h2>Registro de Usuario</h2>
                    <form id="register-form">
                        <input type="text" id="reg-name" placeholder="Nombre y Apellido" required>
                        <input type="text" id="reg-username" placeholder="Usuario" required>
                        <input type="text" id="reg-email" placeholder="Email" required>
                        <input type="password" id="reg-password" placeholder="Contraseña" required>
                        
                        <div class="button-group">
                            <button type="submit" class="btn-register-confirm">Registrarse</button>
                        </div>
                    </form>
                    
                    <button type="button" class="btn-login-redirect">
                        Ya tengo cuenta, Iniciar Sesión
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define("register-component", RegisterComponent);