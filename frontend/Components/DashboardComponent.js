// DashboardComponent.js
import { AuthService } from "../services/AuthService.js"; 

class DashboardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        // Listener para el botón de cerrar sesión
        const logoutButton = this.shadowRoot.querySelector('#btn-logout');
        logoutButton.addEventListener('click', this.handleLogout.bind(this));
    }

    // FUNCIÓN CLAVE: Maneja el cierre de sesión
    handleLogout() {
        // 1. Limpia el estado de autenticación (tokens, etc.)
        // Si tienes un método logout en tu AuthService, lo llamarías aquí:
        // AuthService.logout(); 

        // 2. Despacha el evento para volver a la vista de login
        const navigateEvent = new CustomEvent('navigate', {
            bubbles: true, 
            composed: true, 
            detail: { 
                view: 'login' // Indica al Manager que cargue el login
            }
        });
        this.dispatchEvent(navigateEvent);
        console.log("Sesión cerrada. Evento 'navigate' despachado para 'login'.");
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/dashboard-styles.css">
            
            <div class="dashboard-shell">
                <header>
                    <h1>Dashboard de Mascotas</h1>
                    <button id="btn-logout">Cerrar Sesión</button>
                </header>
                
                <main id="main-content">
                    <h2>¡Bienvenido!</h2>
                    <p>Aquí verás y gestionarás tus mascotas.</p>
                    
                    <div id="pet-management-area">
                        </div>
                </main>
            </div>
        `;
    }
}

customElements.define("dashboard-component", DashboardComponent);