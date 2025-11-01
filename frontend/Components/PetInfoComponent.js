// ejemplo de WC para la Descripcion

class PetInfoComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ['name', 'age', 'breed', 'description'];
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
        const breed = this.getAttribute('breed') || 'N/A';
        const description = this.getAttribute('description') || 'Sin descripción.';
        

        this.shadowRoot.innerHTML = `
            <style>
                /* Estilo del Rectángulo Celeste */
                .info-card {
                    flex-grow: 5; /* Ocupa el espacio restante junto a los botones */
                    background-color: #ffffffcc; /* Color azul/celeste */
                    color: black;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                    text-align: left;
                    max-height: 200px;
                    overflow: auto;
                }
                
                .info-card h3 {
                    margin: 0 0 5px 0;s
                    font-size: 2em;
                }
                
                .info-card p {
                    margin: 2px 0;
                    font-size: 0.95em;
                }
            </style>
            
            <div class="info-card">
                <h3>${name}, ${age} años</h3>
                <p>Raza: ${breed}</p>
                <p>Descripción: ${description}</p>
            </div>
        `;
    }
}

customElements.define("pet-info-component", PetInfoComponent);