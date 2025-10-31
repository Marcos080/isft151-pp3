// SidebarComponent.js

class SidebarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // Asumimos que el nombre del usuario se podría pasar como atributo
        this.userName = this.getAttribute('username') || 'Usuario'; 
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        const chatButton = this.shadowRoot.querySelector('#btn-chats');
        const petsMenuButton = this.shadowRoot.querySelector('#btn-pets-menu');

        chatButton.addEventListener('click', () => this.handleNavigation('chats'));
        petsMenuButton.addEventListener('click', () => this.handleNavigation('pets-menu'));
    }

    handleNavigation(view) {
        // Por ahora, solo logueamos la acción. 
        // Más adelante, podríamos despachar un evento 'sidebar-navigate' 
        // para cambiar la vista interna del Dashboard.
        console.log(`Navegación interna solicitada: ${view}`);

        // Opcional: Despachar evento personalizado para navegación interna
        this.dispatchEvent(new CustomEvent('sidebar-navigate', {
            detail: { view: view },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/sidebar-styles.css">
            
            <div class="sidebar-content">
                
                <div class="user-greeting">
                    <h3>¡Bienvenido, ${this.userName}!</h3>
                </div>

                <div class="menu-buttons">
                    <button id="btn-chats" class="nav-button">
                        Chats
                    </button>
                    <button id="btn-pets-menu" class="nav-button">
                        Pet's Menu
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define("sidebar-component", SidebarComponent);
