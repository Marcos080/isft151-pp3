//ejemplo de WC para la imagen
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
        const currentPhotoUrl = this.photos[this.currentImageIndex] || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16e6d0130f1%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16e6d0130f1%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2257.4%22%20y%3D%22104.9%22%3EFoto%20de%20Mascota%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
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
                    border: 3px solid #2213ff85; /* Borde morado para destacar */
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
                }
                
                .photo-indicators {
                    display: flex;
                    justify-content: center;
                    gap: 5px;
                    padding: 10px 10px 0;
                    background: rgba(0, 0, 0, 0.7); /* Fondo oscuro para que se vean las barras */
                    width: 100%;
                    box-sizing: border-box;
                }
                
                .photo-indicator {
                    flex-grow: 5; /* Distribuye el espacio entre los indicadores (barras) */
                    height: 12px;
                    background-color: rgba(255, 255, 255, 0.5);
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    border-radius: 10px;
                }
                
                .photo-indicator.active {
                    background-color: #FFFFFF; /* Indicador activo (blanco sólido) */
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
                <div class="photo-indicators">
                    ${indicatorsHtml}
                </div>
                
                <div class="main-photo">
                    <img id="pet-photo" src="${currentPhotoUrl}" alt="Foto de Mascota">
                </div>
            </div>
        `;
        this.addEventListeners(); 
    }
}

customElements.define("pet-image-gallery-component", PetImageGalleryComponent);