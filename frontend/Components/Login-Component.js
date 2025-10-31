import { AuthService } from "../services/AuthService.js"; 

class LoginComponent extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
        // ELIMINADO: this.authService = new AuthService(); // ¡Ya no se necesita instanciar!
    }

    connectedCallback(){
        this.render();
        this.addEventListeners(); 
    }

    addEventListeners() {
        const form = this.shadowRoot.querySelector('#login-form');
        const btnRegister = this.shadowRoot.querySelector('.btn-register'); 

        form.addEventListener('submit', this.handleLogin.bind(this)); 
        btnRegister.addEventListener('click', this.handleRegisterView.bind(this));
    }
    
    handleRegisterView() {
        const navigateEvent = new CustomEvent('navigate', {
            bubbles: true, 
            composed: true, 
            detail: { view: 'register' }
        });
        this.dispatchEvent(navigateEvent);
        console.log("Evento 'navigate' despachado para la vista 'register'.");
    }

    async handleLogin(event) { 
        event.preventDefault();

        const username = this.shadowRoot.querySelector("#log-username").value;
        const password = this.shadowRoot.querySelector("#log-password").value;

        // CORRECCIÓN CLAVE: Llama a la función directamente desde la CLASE AuthService
        const result = await AuthService.login({ username, password }); 
        
        alert(result.message);
        
        if (result.success) {
            console.log("Login exitoso:", result.user);
            
            const navigateEvent = new CustomEvent('navigate', {
                bubbles: true, 
                composed: true, 
                detail: { view: 'dashboard' }
            });
            this.dispatchEvent(navigateEvent);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/login-styles.css">
            
            <div class="login-page-wrapper">
            <div class="login-container">
                <h2>Iniciar Sesión</h2>
                <form id="login-form">
                    <input type="text" id="log-username" placeholder="Usuario" required>
                    <input type="password" id="log-password" placeholder="Contraseña" required>
                    
                    <div class="button-group">
                        <button type="submit" class="btn-login">Ingresar</button>
                        <button type="button" class="btn-register">Registrarse</button> 
                    </div>
                </form>
            </div>
            </div> 
        `;
    }
}

customElements.define("login-component", LoginComponent);