// PetInfoComponent.js

class PetInfoComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ['name', 'age', 'description'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Simple re-renderizado cuando cambian los datos de la mascota
        this.render(); 
    }

    render() {
        const name = this.getAttribute('name') || 'N/A';
        const age = this.getAttribute('age') || 'N/A';
        const description = this.getAttribute('description') || 'Sin descripción.';

        this.shadowRoot.innerHTML = `

         <link rel="stylesheet" href="/public/css/petInfo-styles.css">

            
            <div class="info-card">
                <h3>${name}, ${age} años</h3>
                <p>Descripción: ${description}</p>
            </div>
        `;
    }
}

customElements.define("pet-info-component", PetInfoComponent);