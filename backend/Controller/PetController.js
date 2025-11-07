const upload = require("../upload.js");

class PetController
{
    constructor(app, model)
    {
        this.app = app
        this.model = model

        this.cargarRutas();
    }

    cargarRutas()
    {
        this.app.post("/pet", async (req, res) =>
        {
            try
            {
                const {id_owner, name, age, description} = req.body;
                const image = null;
                const result = await this.model.agregar(id_owner, name, age, description, image);
                res.json({ message: "mascota agregada correctamente", result})
            }
            catch(error)
            {
                console.error(error);
                res.status(500).json({error: "error en la base de datos"});
            }
            
        })

        this.app.put("/pet", async (req, res) =>
        {
            try
            {
                const { id } = req.body;
                const result = await this.model.borrar(id);
                res.json({message:"mascota borrada", id});
            }
            catch(error)
            {
                console.error(error);
                res.status(500).json({error: "error en la base de datos"});
            }
        })

        this.app.get("/pets", async (req, res) =>
        {
            try{
                let pets = await this.model.listar();
                res.json(pets);
                console.log("mascotas listadas exitosamente");

            }catch(error)
            {
                console.error(error);
                res.status(500).json({error: "error en la base de datos"});
            }
        })

        this.app.get("/pet/:username", async (req,res) =>
        {
            try
            {
                const {username} = req.params;
                let pet = await this.model.buscar(username);
                res.json(pet);
                console.log("mascota encontrada");
            }
            catch
            {
                console.error("error:",error);
                res.status(500).json({error: "error en la base de datos"});
            }
        })

        this.app.get("/pet/own_pets/:id", async (req, res) =>
        {
            try {
            const { id } = req.params;
            const pets = await this.model.listarMascotasDelUsuario(id);
            res.json(pets);
            console.log("Mascotas encontradas");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error en la base de datos" });
        }
        })
    
        this.app.post("/pet/:id/photo", upload.single("photo"),
    async (req, res) => {
        try {
            const { id } = req.params;
            if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

            const photoUrl = `/uploads/${req.file.filename}`;
            await this.model.setPhotoUrl(id, photoUrl);

            res.json({ message: "Foto guardada correctamente", photoUrl });
        } catch (error) {
            console.error("Error al subir la foto:", error);
            res.status(500).json({ error: "Error al guardar la foto" });
        }
    }
);
    }
}

module.exports = { PetController };