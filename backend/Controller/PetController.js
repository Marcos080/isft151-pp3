// controllers/PetController.js
class PetController {
    constructor(model) {
        this.model = model;
    }

    async agregarMascota(req, res) {
        try {
            const { id_owner, name, age, description } = req.body;
            const image = null;
            const result = await this.model.agregar(id_owner, name, age, description, image);

            res.json({ message: "mascota agregada correctamente", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "error en la base de datos" });
        }
    }

    async borrarMascota(req, res) {
        try {
            const { id } = req.body;
            const result = await this.model.borrar(id);
            res.json({ message: "mascota borrada", id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "error en la base de datos" });
        }
    }

    async listarMascotas(req, res) {
        try {
            let pets = await this.model.listar();
            res.json(pets);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "error en la base de datos" });
        }
    }

    async buscarPorUsername(req, res) {
        try {
            const { username } = req.params;
            let pet = await this.model.buscar(username);
            res.json(pet);
        } catch (error) {
            console.error("error:", error);
            res.status(500).json({ error: "error en la base de datos" });
        }
    }

    async listarMascotasDelUsuario(req, res) {
        try {
            const { id } = req.params;
            const pets = await this.model.listarMascotasDelUsuario(id);
            res.json(pets);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error en la base de datos" });
        }
    }

    async subirFoto(req, res) {
        try {
            const { id } = req.params;

            if (!req.file)
                return res.status(400).json({ error: "No se subió ningún archivo" });

            const photoUrl = `/uploads/${req.file.filename}`;
            await this.model.setPhotoUrl(id, photoUrl);

            res.json({ message: "Foto guardada correctamente", photoUrl });
        } catch (error) {
            console.error("Error al subir la foto:", error);
            res.status(500).json({ error: "Error al guardar la foto" });
        }
    }
}

module.exports = PetController;
