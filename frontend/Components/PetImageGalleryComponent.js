// PetImageGalleryComponent.js

class PetImageGalleryComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.currentImageIndex = 0;
        this.photos = [];
        this.petId = null;
    }

    static get observedAttributes() {
        return ['photos', 'pet-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'photos') {
            try {
                this.photos = JSON.parse(newValue);
                this.currentImageIndex = 0;
                this.render();
            } catch (e) {
                this.photos = [];
            }
        } else if (name === 'pet-id' && oldValue !== newValue) {
            // Reiniciar el índice de imagen al cambiar de mascota
            this.currentImageIndex = 0;
            this.petId = newValue;
            this.render();
        }
    }
    
    connectedCallback() {
        this.render();
        // Los event listeners se añaden después del primer renderizado
        this.addEventListeners();
    }

    addEventListeners() {
        // Asumiendo que los rectángulos blancos son botones o indicadores
        const indicators = this.shadowRoot.querySelectorAll('.photo-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showImage(index));
        });
    }

    showImage(index) {
        if (index >= 0 && index < this.photos.length) {
            this.currentImageIndex = index;
            this.updateView();
        }
    }

    updateView() {
        const imgElement = this.shadowRoot.querySelector('#pet-photo');
        if (imgElement && this.photos.length > 0) {
            imgElement.src = this.photos[this.currentImageIndex];
            
            // Actualizar el estado visual de los indicadores (puntos/barras)
            this.shadowRoot.querySelectorAll('.photo-indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentImageIndex);
            });
        }
    }

    render() {
        const currentPhotoUrl = this.photos[this.currentImageIndex] || 'placeholder.jpg';
        const indicatorsHtml = this.photos.map((_, index) => 
            `<button class="photo-indicator ${index === this.currentImageIndex ? 'active' : ''}" data-index="${index}"></button>`
        ).join('');
        
        this.shadowRoot.innerHTML = `
           <style>
                /* Estilos internos para la galería */
                .gallery-container {
                    display: flex;
                    flex-direction: column;
                    width: 400px;
                    aspect-ratio: 1 / 1;
                    background-color: white;
                    border: 3px solid #ffffffff; /* Borde morado para destacar */
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.28);
                }
                
                

                .main-photo {
                    width: 100%;
                    aspect-ratio: 1 / 1; /* La foto es un cuadrado perfecto */
                    background-color: grey; /* Color base del cuadrado blanco */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                }
                
                #pet-photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* Asegura que la imagen cubra todo el cuadrado */
                }
            </style>
            
            <div class="gallery-container">
                
                
                <div class="main-photo">
                    <img id="pet-photo" src="${currentPhotoUrl}" alt="Foto de Mascota">
                </div>
            </div>
        `;
        // Los event listeners deben re-adjuntarse si el renderizado cambia el DOM.
        this.addEventListeners(); 
    }
}

customElements.define("pet-image-gallery-component", PetImageGalleryComponent);