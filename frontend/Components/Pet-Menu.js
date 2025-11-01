
class PetMenuComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.pets = [];
        this.username = "Usuario"; // Luego podés reemplazar esto con el nombre del usuario logueado
    }

    connectedCallback() {
        this.render();
        this.fetchPets();
        this.addEventListeners();
    }

    addEventListeners() {
        const form = this.shadowRoot.querySelector("#add-pet-form");
        if (form) form.addEventListener("submit", this.handleAddPet.bind(this));
    }

    async fetchPets() {
        try {
            // Llama a la API que devuelve todas las mascotas
            const res = await fetch(`/pets?username=${this.username}`);
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
            card.innerHTML = `
                <h3>${pet.name}</h3>
                <p><strong>Edad:</strong> ${pet.age}</p>
                <p>${pet.description}</p>
                <button data-id="${pet.id}" class="delete-btn">Borrar</button>
            `;
            listContainer.appendChild(card);
        });

        // Eventos de borrado
        this.shadowRoot.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", this.handleDeletePet.bind(this));
        });
    }

    async handleAddPet(event) {
        event.preventDefault();

        const form = event.target;
        const name = form.querySelector("#pet-name").value.trim();
        const age = form.querySelector("#pet-age").value.trim();
        const description = form.querySelector("#pet-desc").value.trim();

        if (!name || !age || !description) return alert("Completa todos los campos.");

        try {
            const res = await fetch("/pet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_owner: 1, // ⚠️ Cambiar cuando tengas el usuario logueado
                    name,
                    age,
                    description,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error agregando mascota");

            // Agregar mascota al arreglo y renderizar
            this.pets.push({ id: data.result.insertId, name, age, description });
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error borrando mascota");

            // Eliminar del array local
            this.pets = this.pets.filter((p) => p.id != id);
            this.renderPets();
        } catch (error) {
            console.error("Error al borrar mascota:", error);
            alert("No se pudo borrar la mascota.");
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/public/css/pet-matcher-styles.css">

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

            <style>
                .pet-matcher-container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                form {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                input {
                    flex: 1;
                    padding: 8px;
                }
                button {
                    padding: 8px 12px;
                    background: #007bff;
                    border: none;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                }
                .pets-list {
                    display: grid;
                    gap: 15px;
                }
                .pet-card {
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                }
                .delete-btn {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .error {
                    color: red;
                }
            </style>
        `;
    }
}

customElements.define("pet-menu", PetMenuComponent);
