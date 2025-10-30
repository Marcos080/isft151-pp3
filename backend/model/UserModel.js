const { response } = require("express");

class UserModel
{
    constructor(conexion)
    {
        this.conexion = conexion
    }

    // --- FUNCIÓN AUXILIAR: Envuelve la consulta en una Promesa ---
    // Esto nos permite usar 'await' en los métodos de la clase.
    _query(sql, values)
    {
        return new Promise((resolve, reject) => {
            // Utilizamos la función de consulta de la conexión a la BD
            this.conexion.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error); // Rechaza la Promesa si hay un error en la BD
                }
                resolve(result); // Resuelve la Promesa con los resultados
            });
        });
    }

    // === MÉTODOS CRUD MODIFICADOS (Usando async/await) ===
    
    // UPDATE: Cambia el nombre
    async setName(id, newName)
    {
        const setName_sql = `UPDATE user SET name = ? WHERE id = ?`;
        return this._query(setName_sql, [newName, id]);
        // Ya no es necesario console.log aquí; el controlador lo hará.
    }

    // UPDATE: Cambia el nombre de usuario
    async setUsername(id, newUsername)
    {
        const setUsername_sql = `UPDATE user SET username = ? WHERE id = ?`;
        return this._query(setUsername_sql, [newUsername, id]);
    }

    // UPDATE: Cambia la contraseña
    async setPassword(id, newPassword)
    {
        // NOTA: En producción, la contraseña DEBE ser hasheada antes de guardar.
        const newPassword_sql = `UPDATE user SET password = ? WHERE id = ?`;
        return this._query(newPassword_sql, [newPassword, id]);
    }

    // CREATE: Agregar un nuevo usuario
    async agregar(name, username, email, password)
    {
        const agregar_sql = `INSERT INTO user(name, username, email, password) VALUES (?, ?, ?, ?)`;
        const valores = [name, username, email, password];
        return this._query(agregar_sql, valores); // Devuelve el objeto de resultado (incluyendo insertId)
    }

    // READ: Listar todos los usuarios
    async listar()
    {
        const listar_sql = `SELECT * FROM user`;
        return this._query(listar_sql); // Devuelve el array con todos los usuarios
    }

    // READ: Buscar un usuario por ID
    async buscar(id)
    {
        const buscar_sql = `SELECT * FROM user WHERE id = ?`;
        const result = await this._query(buscar_sql, [id]);
        return result[0]; // Devuelve el primer usuario encontrado (si existe)
    }

    // DELETE: Borrar un usuario por ID
    async borrar(id)
    {
        const borrar_sql = `DELETE FROM user WHERE id = ?`
        return this._query(borrar_sql, [id]); // Devuelve el objeto de resultado (incluyendo affectedRows)
    }

    // READ: Busca un usuario por nombre de usuario (Necesario para Login/Register)
    async findByUsername(username)
    {
    
        const buscar_sql = `SELECT * FROM user WHERE username = ?`;
        const result = await this._query(buscar_sql, [username]);
        return result[0]; 
    }
}


module.exports = {UserModel};