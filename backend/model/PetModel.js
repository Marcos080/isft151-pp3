//me falta cambiar los setter en promesas
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

            FOREIGN KEY (id_owner) REFERENCES user(id) ON DELETE CASCADE

            );`

        this.conexion.query(tabla, (error, result) =>
            {
            if(error){console.error("error al conectarse a la tabla pet:", error);}

            if(result){console.log("conectado a la tabla pet");}

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
        return new Promise((resolve, reject) =>
        {
            const agregar_sql = `INSERT INTO pet(id_owner, name, age, description) VALUES (?, ?, ?, ?)`;
            const valores = [id_owner, name, age, description];

            this.conexion.query(agregar_sql, valores, (error, result) =>
            {
                if(error) { console.error("error:", error); return reject(error);}

                if(result){ console.log("mascota registrada"); resolve(result);}
            
    
            });
            
    })
    }

    listar()
    {
        return new Promise((resolve, reject) =>
        {
        const listar_sql = `SELECT * FROM pet`;

        this.conexion.query(listar_sql, (error, result) => 
        {
            if(error) {console.error("error: ", error); reject(error);}

            if(result){console.log("mascotas encontrados"); resolve(result);}

        })
    })
    }

    buscar(id)
    {
        return new Promise((resolve, reject) =>
        {
            const buscar_sql = `SELECT * FROM pet WHERE id = ?`;

            this.conexion.query(buscar_sql, [id], (error, result) =>
            {
                if(error) { console.error("error: ", error); reject(error);}

                if(result){console.log("mascota encontrado"); resolve(result);}

        })
        })
        
    }

    borrar(id)
    {
        return new Promise((resolve, reject) =>
        {
            const borrar_sql = `DELETE FROM pet WHERE id = ?`;

        this.conexion.query(borrar_sql, [id], (error, result) =>
        {
            if(error) { console.error("error: ", error); reject(error);}

            if(result) {console.log("mascota eliminado: ", id); resolve(result);};
        })
    })
    
}

        
}

module.exports = { PetModel };