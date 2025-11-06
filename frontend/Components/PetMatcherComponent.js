import './PetImageGalleryComponent.js'; 
import './PetInfoComponent.js'; 
import { UserService } from '../services/UserService.js';
import { PetService } from '../services/PetService.js'; // ⬅️ nuevo
import { AuthService } from '../services/AuthService.js';

class PetMatcherComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.currentUserId = AuthService.getUserFromToken().id; // usuario simulado
        this.pets = []; // todas las mascotas
        this.currentIndex = 0; // índice actual
    }

    async connectedCallback() {
        await this.loadPets(); // carga las mascotas
        this.render();         // muestra la primera
        this.addEventListeners();
    }

    async loadPets() {
        try {
            this.pets = await PetService.fetchAllPets();
            if (this.pets.length === 0) {
                this.currentPet = null;
                console.warn("⚠️ No hay mascotas disponibles");
            } else {
                this.currentPet = this.pets[this.currentIndex];
            }
        } catch (error) {
            console.error("Error al cargar mascotas:", error);
        }
    }

    addEventListeners() {
        this.shadowRoot.addEventListener('click', async (e) => {
            if (e.target.id === 'btn-like') {
                await this.handleMatchAction('like');
            } else if (e.target.id === 'btn-dislike') {
                await this.handleMatchAction('dislike');
            }
        });
    }

    async handleMatchAction(action) {
        if (!this.currentPet) return;

        console.log(`Acción en mascota ${this.currentPet.id}: ${action}`);

        if (action === 'like') {
            try {
                const response = await UserService.likePet(this.currentUserId, this.currentPet.id);
                console.log("Respuesta del servidor:", response);
                alert(`Seguiste a ${this.currentPet.name}`);
            } catch (error) {
                alert("Hubo un error al seguir la mascota.");
            }
        }

        this.showNextPet();
    }

    showNextPet() {
        this.currentIndex++;

        if (this.currentIndex >= this.pets.length) {
            this.currentPet = null;
            this.shadowRoot.innerHTML = `<p>No hay más mascotas disponibles 🐶🐱</p>`;
        } else {
            this.currentPet = this.pets[this.currentIndex];
            this.render();
        }
    }

    render() {
        if (!this.currentPet) {
            this.shadowRoot.innerHTML = `<p>Cargando mascotas...</p>`;
            return;
        }

        const pet = this.currentPet;
        const photos = JSON.stringify(pet.photos || ["/img/default.png"]);

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/pet-matcher-styles.css">
            <div class="pet-matcher-wrapper">
                <pet-image-gallery-component 
                    pet-id="${pet.id}"
                    photos='${photos}'
                ></pet-image-gallery-component>
                
                <div class="pet-details-and-actions">
                    <pet-info-component 
                        name="${pet.name}"
                        age="${pet.age}"
                        breed="${pet.breed || 'Desconocida'}"
                        description="${pet.description || 'Sin descripción.'}"
                    ></pet-info-component>
                    
                    <div class="action-buttons">
                        <button id="btn-dislike" class="btn-action btn-dislike">❌</button>
                        <button id="btn-like" class="btn-action btn-like">💚</button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define("pet-matcher-component", PetMatcherComponent);
