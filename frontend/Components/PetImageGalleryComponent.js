// PetImageGalleryComponent.js

class PetImageGalleryComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // Ahora manejamos solo una foto por mascota
        this.photo = null;
        this.petId = null;
    }

    static get observedAttributes() {
        return ['photos', 'pet-id', 'photo'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'photos') {
            // Si se pasa un array JSON, usamos la primera foto
            try {
                const arr = JSON.parse(newValue);
                this.photo = Array.isArray(arr) && arr.length ? arr[0] : null;
            } catch (e) {
                this.photo = null;
            }
            this.render();
        } else if (name === 'photo') {
            // Aceptamos también una URL directa
            this.photo = newValue || null;
            this.render();
        } else if (name === 'pet-id' && oldValue !== newValue) {
            this.petId = newValue;
            this.render();
        }
    }
    
    connectedCallback() {
        this.render();
        // No hay listeners necesarios: sólo muestra una foto
    }
    // Para compatibilidad con versiones previas, si se necesita actualizar
    // la imagen en tiempo de ejecución se puede llamar a this.render() nuevamente.

    render() {
        const currentPhotoUrl = this.photo || '/img/default.png';

        this.shadowRoot.innerHTML = `

         <link rel="stylesheet" href="/public/css/petImage-styles.css">
            
            <div class="gallery-container single-photo">
                <div class="main-photo">
                    <img id="pet-photo" src="${currentPhotoUrl}" alt="Foto de Mascota">
                </div>
            </div>
        `;
    }
}

customElements.define("pet-image-gallery-component", PetImageGalleryComponent);