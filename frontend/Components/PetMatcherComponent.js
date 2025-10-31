// PetMatcherComponent.js
import './PetImageGalleryComponent.js'; 
import './PetInfoComponent.js'; 

class PetMatcherComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // Datos de ejemplo para inicialización (serán reemplazados por el servicio)
        this.currentPet = {
            id: 1,
            name: "Firulais",
            age: 3,
            breed: "Labrador",
            description: "Amigable y juguetón.",
            photos: ["../img/asel.png", "/img/asel.png"]
        };
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        // Aquí se llamaría a PetService.fetchNextPet();
    }

    addEventListeners() {
        const likeButton = this.shadowRoot.querySelector('#btn-like');
        const dislikeButton = this.shadowRoot.querySelector('#btn-dislike');

        likeButton.addEventListener('click', () => this.handleMatchAction('like'));
        dislikeButton.addEventListener('click', () => this.handleMatchAction('dislike'));
    }

    handleMatchAction(action) {
        console.log(`Acción en mascota ${this.currentPet.id}: ${action}`);
        
        // 1. Llamar al servicio (PetService.likePet(id) o PetService.dislikePet(id))
        
        // 2. Cargar la siguiente mascota (PetService.fetchNextPet())
        // Por ahora, solo simulación:
        alert(`${action.toUpperCase()} a ${this.currentPet.name}. Cargando siguiente...`);
        // this.loadNextPet(); 
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/pet-matcher-styles.css">
            
            <div class="pet-matcher-wrapper">
                
                <pet-image-gallery-component 
                    pet-id="${this.currentPet.id}"
                    photos='${JSON.stringify(this.currentPet.photos)}'
                ></pet-image-gallery-component>
                
                <div class="pet-details-and-actions">
                    
                    <pet-info-component 
                        name="${this.currentPet.name}"
                        age="${this.currentPet.age}"
                        breed="${this.currentPet.breed}"
                        description="${this.currentPet.description}"
                    ></pet-info-component>
                    
                    <div class="action-buttons">
                        <button id="btn-dislike" class="btn-action btn-dislike">
                            ❌
                        </button>
                        <button id="btn-like" class="btn-action btn-like">
                            ➕
                        </button>
                    </div>

                </div>
            </div>
        `;
    }
}

customElements.define("pet-matcher-component", PetMatcherComponent);