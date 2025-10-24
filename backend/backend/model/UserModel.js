
class UserModel
{
    constructor(conexion)
    {
        this.conexion = conexion

        const table_user = `
            CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );`;

    this.conexion.query(table_user, (err, result) => {
        if (err) { console.error("Error creando tabla:", err);}
    });

        console.log("tabla user conectada");
    }

    setName(id, newName)
    {
        let setName_sql = `UPDATE user SET name = ? WHERE id = ?`;

        this.conexion.query(setName_sql, [newName, id]);
        console.log("nombre cambiado a: ", newName);
    }

    setUsername(id, newUsername)
    {
        let setUsername_sql = `UPDATE user SET username = ? WHERE id = ?`;

        this.conexion.query(setUsername_sql, [newUsername, id]);
        console.log("nombre de usuario cambiado a: ", newUsername);
    }

    setPassword(id, newPassword)
    {
        let newPassword_sql = `UPDATE user SET password = ? WHERE id = ?`;

        this.conexion.query(newPassword_sql, [newPassword, id]);
        console.log("contraseña cambiada a: ", newPassword);
    }

    agregar(name, username, email, password)
    {
        let agregar_sql = `INSERT INTO user(name, username, email, password) VALUES (?, ?, ?, ?)`
        let valores = [name, username, email, password];

        this.conexion.query(agregar_sql, valores);
        console.log("Usuario agregado correctamente");
    }

    listar()
    {
        let listar_sql = `SELECT * FROM user`;
        this.conexion.query(listar_sql, (error, result) =>{
            if(error)
            {
                console.error("hubo un error", error);
            }

            for( const user of result)
            {
                console.log(user);
                console.log("-----------------------------------");
            }
        });
    }

    buscar(id)
    {
        let buscar_sql = `SELECT * FROM user WHERE id = ?`;

        this.conexion.query(buscar_sql, [id], (error, result) => {
            if(error)
            {
                console.error("error:", error);
            }

            console.log(result);
        });
    }

    borrar(id)
    {
        let borrar_sql = `DELETE FROM user WHERE id = ?`

        this.conexion.query(borrar_sql, [id]);
        console.log("Usuario eliminado exitosamente");
    }
}


module.exports = {UserModel};