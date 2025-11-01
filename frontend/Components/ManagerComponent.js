import { AuthService } from "../services/AuthService.js";

class ManagerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.activeView = 'login';
    }

    connectedCallback() {
        this.checkAuth();
        this.shadowRoot.addEventListener('navigate', this.handleNavigation.bind(this));
    }

    async checkAuth() {
        const valid = await AuthService.verifyToken();
        this.activeView = valid ? 'dashboard' : 'login';
        this.render();
    }

    handleNavigation(event) {
        const { view } = event.detail;
        if (this.activeView !== view) {
            this.activeView = view;
            this.renderActiveComponent();
        }
    }

    renderActiveComponent() {
        const container = this.shadowRoot.querySelector('#app-container');
        if (!container) return;
        container.innerHTML = '';

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
            <style>:host{display:block}#app-container{min-height:100vh;width:100%;}</style>
            <div id="app-container"></div>
        `;
        this.renderActiveComponent();
    }
}

customElements.define("manager-component", ManagerComponent);
