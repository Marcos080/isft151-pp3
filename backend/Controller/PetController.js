
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
                const result = await this.model.agregar(id_owner, name, age, description);
                res.json({ message: "mascota agregada correctamente", result})
            }
            catch(error)
            {
                console.error(error);
                res.status(500).json({error: "error en la base de datos"});
            }
            
        })

        this.app.put("/user", async (req, res) =>
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

        this.app.get("/users", async (req, res) =>
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

        this.app.get("/user/:id", async (req,res) =>
        {
            try
            {
                const {id} = req.params;
                let pet = await this.model.buscar(id);
                res.json(pet);
                console.log("mascota encontrada");
            }
            catch
            {
                console.error("error:",error);
                res.status(500).json({error: "error en la base de datos"});
            }
        })
    }
}

module.exports = { PetController };