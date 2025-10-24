
class PetModel
{
    constructor(conexion)
    {
        this.conexion = conexion

        const tabla = `
            CREATE TABLE IF NOT EXISTS pet (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_owner INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            age INT NOT NULL,
            description VARCHAR(255) NOT NULL,

            FOREIGN KEY (id_owner) REFERENCES user(id)

            );`

        this.conexion.query(tabla, (error, result) =>
            {
            if(error){console.error("error al conectarse a la tabla pet:", error);}

            console.log("conectado a la tabla pet");

            }
        )
    }

    setName(id, newName)
    {
        const setName_sql = `UPDATE pet SET name = ? WHERE id = ?`;

        this.conexion.query(setName_sql, [newName, id]);
    }

    setAge(id, newAge)
    {
        const setAge_sql = `UPDATE pet SET age = ? WHERE id = ?`;

        this.conexion.query(setAge_sql, [newAge, id]);
    }

    setDescription(id, newDescription)
    {
        const setDescription_sql = `UPDATE pet SET description = ? WHERE id = ?`;

        this.conexion.query(setDescription_sql, [newDescription, id]);
    }

    agregar(id_owner, name, age, description)
    {
        const agregar_sql = `INSERT INTO pet(id_owner, name, age, description) VALUES (?, ?, ?, ?)`;
        const valores = [id_owner, name, age, description];

        this.conexion.query(agregar_sql, valores);
        console.log("mascota agregada correctamente");
    }

    listar()
    {
        const listar_sql = `SELECT * FROM pet`;

        this.conexion.query(listar_sql, (error, result) => 
        {
            if(error) {console.error("error: ", error); }

            for(let user of result)
            {
                console.log(user);
                console.log("-------------------------------");
            }
        })
    }

    buscar(id)
    {
        const buscar_sql = `SELECT * FROM pet WHERE id = ?`;

        this.conexion.query(buscar_sql, [id], (error, result) =>
        {
            if(error) { console.error("error: ", error);}

            console.log(result);

        })
    }

    borrar(id)
    {
        const borrar_sql = `DELETE FROM pet WHERE id = ?`;

        this.conexion.query(borrar_sql, [id], (error, result) =>
        {
            if(error) { console.error("error: ", error);}

            console.log("usuario eliminado: ", id);
        })
    }
}

module.exports = { PetModel };