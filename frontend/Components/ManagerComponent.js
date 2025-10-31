// ManagerComponent.js (Versión Final Limpia)

class ManagerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.activeView = 'login'; 
    }

    connectedCallback() {
        this.render();

        // 1. ESCUCHAR EVENTOS DE NAVEGACIÓN
        this.shadowRoot.addEventListener('navigate', this.handleNavigation.bind(this));
    }

    handleNavigation(event) {
        const { view } = event.detail;

        if (this.activeView !== view) {
            console.log(`Navegando de '${this.activeView}' a '${view}'`);
            this.activeView = view;
            this.renderActiveComponent(); 
        }
    }

    renderActiveComponent() {
        const container = this.shadowRoot.querySelector('#app-container');
        if (!container) return;

        container.innerHTML = ''; 

        // LÓGICA DE RUTEO
        switch (this.activeView) {
            case 'login':
                container.innerHTML = '<login-component></login-component>';
                break;
            case 'register':
                container.innerHTML = '<register-component></register-component>';
                break;
            case 'dashboard':
                container.innerHTML = '<dashboard-component></dashboard-component>';
                break;
            default:
                container.innerHTML = '<h1>Error: Vista no encontrada</h1>';
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                #app-container { min-height: 100vh; width: 100%; }
            </style>
            <div id="app-container">
                </div>
        `;
        this.renderActiveComponent();
    }
}

customElements.define("manager-component", ManagerComponent);