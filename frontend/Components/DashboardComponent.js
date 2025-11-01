// DashboardComponent.js (FINALIZADO ESTRUCTURALMENTE)

// import { AuthService } from "../services/AuthService.js"; 
import './SidebarComponent.js'; 
import './PetMatcherComponent.js'; 
import "./Pet-Menu.js"
// Importaremos los otros componentes cuando los creemos
// import './ChatsComponent.js'; 
// import './PetMenuComponent.js'; 


class DashboardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        
        // Estado inicial de la vista interna
        this.internalView = 'matcher'; // 'matcher', 'chats', o 'pet-menu'
        this.userName = 'Usuario'; // Placeholder, esto debe venir del login
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        const logoutButton = this.shadowRoot.querySelector('#btn-logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', this.handleLogout.bind(this));
        }

        // 🚨 NUEVO: Escucha eventos de navegación interna desde el Sidebar
        this.shadowRoot.addEventListener('sidebar-navigate', this.handleInternalNavigation.bind(this));
    }
    
    // Método para manejar el cambio de vista interna (Chats o Pet's Menu)
    handleInternalNavigation(event) {
        const newView = event.detail.view;
        
        if (this.internalView !== newView) {
            console.log(`Cambiando vista interna a: ${newView}`);
            this.internalView = newView;
            this.renderActiveComponent(); // Llama al método que actualiza el contenido
        }
    }

    handleLogout() {
        // Lógica de logout (llamar a AuthService, limpiar tokens, etc.)
        // AuthService.logout(); 

        const navigateEvent = new CustomEvent('navigate', {
            bubbles: true, 
            composed: true, 
            detail: { view: 'login' }
        });
        this.dispatchEvent(navigateEvent);
    }
    
    // 🚨 NUEVO: Función para determinar qué componente mostrar en el área principal
    renderActiveComponent() {
        const container = this.shadowRoot.querySelector('.main-content');
        if (!container) return;

        // Limpia el contenido anterior
        container.innerHTML = ''; 

        // Lógica del Sub-Router
        switch (this.internalView) {
            case 'matcher':
                container.innerHTML = '<pet-matcher-component></pet-matcher-component>';
                break;
            case 'chats':
                // Se creará en el futuro
                container.innerHTML = '<h2>Sección de Chats</h2><p>Aquí irá el componente de Chats.</p>'; 
                // container.innerHTML = '<chats-component></chats-component>';
                break;
            case 'pets-menu':
                // Se creará en el futuro
                container.innerHTML = '<h2>Menú de Mascotas</h2><p>Aquí irá el componente de CRUD de mascotas propias.</p>';
                // container.innerHTML = '<pet-menu-component></pet-menu-component>';
                container.innerHTML = '<pet-menu></petmenu>';
                break;
            default:
                container.innerHTML = '<pet-matcher-component></pet-matcher-component>';
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/dashboard-styles.css">
            
            <div class="dashboard-container">
                <div class="sidebar">
                    <header>
                        <h2>Dashboard</h2> 
                        <button id="btn-logout">Cerrar Sesión</button>
                    </header>
                    
                    <sidebar-component username="${this.userName}"></sidebar-component>
                    
                </div>
                
                <div class="main-content">
                    </div>
            </div>
        `;
        // Llama al sub-router para cargar la vista inicial (matcher)
        this.renderActiveComponent();
    }
}

customElements.define("dashboard-component", DashboardComponent);