import './PetImageGalleryComponent.js'; 
import './PetInfoComponent.js'; 
import { UserService } from '../services/UserService.js';
import { PetService } from '../services/PetService.js'; 
import { AuthService } from '../services/AuthService.js';

class PetMatcherComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.currentUserId = AuthService.getUserFromToken()?.id; 
        this.pets = [];
        this.currentIndex = 0;
    }

    async connectedCallback() {
        await this.loadPets(); 
        this.render();         
        this.addEventListeners();
    }

    async loadPets() {
        try {
            const allPets = await PetService.fetchAllPets();
            // Filtramos solo mascotas que tengan photoUrl o image
            this.pets = allPets.map(pet => ({
                ...pet,
                photos: pet.image ? [pet.image] : ["/img/default.png"]
            }));

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
        // Convertimos el array de fotos a JSON para pasarlo al componente
        const photos = JSON.stringify(pet.photos);

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/pet-matcher-styles.css">
            <div class="pet-matcher-wrapper">

                <pet-image-gallery-component 
                    pet-id="${pet.id}"
                    photos='${photos}'
                ></pet-image-gallery-component>

                <div class="pet-details-and-actions">

                    <button id="btn-dislike" class="btn-action btn-dislike">❌</button>

                    <pet-info-component 
                        class="info-card"
                        name="${pet.name}"
                        age="${pet.age}"
                        description="${pet.description || 'Sin descripción.'}"
                    ></pet-info-component>

                    <button id="btn-like" class="btn-action btn-like">💚</button>

                </div>
            </div>
        `;
    }
}

customElements.define("pet-matcher-component", PetMatcherComponent);
