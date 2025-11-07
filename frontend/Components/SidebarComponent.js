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
        const matcherButton = this.shadowRoot.querySelector('#btn-matcher');

        chatButton.addEventListener('click', () => this.handleNavigation('chats'));
        petsMenuButton.addEventListener('click', () => this.handleNavigation('pets-menu'));
        matcherButton.addEventListener('click', () => this.handleNavigation('matcher'));
    }

    handleNavigation(view) {
        console.log(`Navegación interna solicitada: ${view}`);

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
                
                 <button id="btn-matcher" class="user-greeting-button">
                    <h3>Mascotas publicadas</h3> 
                </button>

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
