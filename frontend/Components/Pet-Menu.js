import { AuthService } from "../services/AuthService.js";

class PetMenuComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.pets = [];
        this.userId = null;
        this.username = null;
    }

    connectedCallback() {
        this.extractUserFromToken();
        this.render();
        this.fetchPets();
        this.addEventListeners();
    }

    extractUserFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            this.userId = payload.id;
            this.username = payload.username;
        } catch (err) {
            console.error("Error decodificando token:", err);
        }
    }

    addEventListeners() {
        const form = this.shadowRoot.querySelector("#add-pet-form");
        if (form) form.addEventListener("submit", this.handleAddPet.bind(this));
    }

    async fetchPets() {
        if (!this.username) return;
        try {
            const res = await fetch(`/pet/own_pets/${this.userId}`, {
                headers: AuthService.getAuthHeaders()
            });
            if (!res.ok) throw new Error("Error al listar mascotas");

            this.pets = await res.json();
            this.renderPets();
        } catch (error) {
            console.error("Error cargando mascotas:", error);
            const listContainer = this.shadowRoot.querySelector("#pets-list");
            if (listContainer)
                listContainer.innerHTML = `<p class="error">No se pudieron cargar las mascotas.</p>`;
        }
    }

    renderPets() {
        const listContainer = this.shadowRoot.querySelector("#pets-list");
        if (!listContainer) return;

        listContainer.innerHTML = "";
        if (this.pets.length === 0) {
            listContainer.innerHTML = "<p>No hay mascotas registradas.</p>";
            return;
        }

        this.pets.forEach((pet) => {
            const card = document.createElement("div");
            card.className = "pet-card";

            // Usamos image de la base de datos
            const photoHTML = pet.image && pet.image !== ""
                ? `<img src="${window.location.origin}${pet.image}" alt="${pet.name}" class="pet-photo">`
                : "";

            card.innerHTML = `
                <h3>${pet.name}</h3>
                <p><strong>Edad:</strong> ${pet.age}</p>
                <p>${pet.description}</p>
                ${photoHTML}
                <input type="file" name="photo" data-id="${pet.id}" class="photo-input" style="display:none;">
                <button data-id="${pet.id}" class="upload-btn">Subir foto</button>
                <button data-id="${pet.id}" class="delete-btn">Borrar</button>
            `;
            listContainer.appendChild(card);
        });

        // Eventos de borrar
        this.shadowRoot.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", this.handleDeletePet.bind(this));
        });

        // Eventos de subir foto
        this.shadowRoot.querySelectorAll(".upload-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const petId = e.target.dataset.id;
                const fileInput = this.shadowRoot.querySelector(`.photo-input[data-id="${petId}"]`);
                fileInput.click();
            });
        });

        // Cuando se selecciona un archivo
        this.shadowRoot.querySelectorAll(".photo-input").forEach((input) => {
            input.addEventListener("change", this.handleUploadPhoto.bind(this));
        });
    }

    async handleAddPet(event) {
        event.preventDefault();
        if (!this.userId) return alert("Usuario no autenticado");

        const form = event.target;
        const name = form.querySelector("#pet-name").value.trim();
        const age = form.querySelector("#pet-age").value.trim();
        const description = form.querySelector("#pet-desc").value.trim();

        if (!name || !age || !description) return alert("Completa todos los campos.");

        try {
            const res = await fetch("/pet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...AuthService.getAuthHeaders()
                },
                body: JSON.stringify({
                    id_owner: this.userId,
                    name,
                    age,
                    description,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error agregando mascota");

            this.pets.push({ id: data.result.insertId, name, age, description, image: null });
            this.renderPets();
            form.reset();
        } catch (error) {
            console.error("Error al agregar mascota:", error);
            alert("No se pudo agregar la mascota.");
        }
    }

    async handleDeletePet(event) {
        const id = event.target.dataset.id;
        if (!confirm("¿Seguro que querés borrar esta mascota?")) return;

        try {
            const res = await fetch("/pet", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...AuthService.getAuthHeaders()
                },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error borrando mascota");

            this.pets = this.pets.filter((p) => p.id != id);
            this.renderPets();
        } catch (error) {
            console.error("Error al borrar mascota:", error);
            alert("No se pudo borrar la mascota.");
        }
    }

    async handleUploadPhoto(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (!file) return alert("Seleccioná un archivo primero");

        const petId = fileInput.dataset.id;
        const formData = new FormData();
        formData.append("photo", file);

        try {
            const headers = AuthService.getAuthHeaders();
            delete headers["Content-Type"]; // FormData lo maneja solo

            const res = await fetch(`/pet/${petId}/photo`, {
                method: "POST",
                headers,
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error subiendo la foto");

            // Actualizamos la foto en el array y re-renderizamos
            const petIndex = this.pets.findIndex(p => p.id == petId);
            if (petIndex > -1) this.pets[petIndex].image = data.photoUrl;
            this.renderPets();

            alert("Foto subida correctamente");
        } catch (error) {
            console.error("Error al subir la foto:", error);
            alert("No se pudo subir la foto.");
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
          
            <link rel="stylesheet" href="/public/css/menu-styles.css">

            <div class="pet-matcher-container">
                <h2>Mis Mascotas</h2>
                <form id="add-pet-form">
                    <input type="text" id="pet-name" placeholder="Nombre" required>
                    <input type="number" id="pet-age" placeholder="Edad" required>
                    <input type="text" id="pet-desc" placeholder="Descripción" required>
                    <button type="submit">Agregar Mascota</button>
                </form>
                <div id="pets-list" class="pets-list"></div>
            </div>
            
        `;
    }
}

if (!customElements.get("pet-menu")) {
    customElements.define("pet-menu", PetMenuComponent);
}
