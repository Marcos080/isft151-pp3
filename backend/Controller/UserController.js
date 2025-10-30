//@param {object} UserModel - Instancia del modelo de usuario.
//@returns {object} Un objeto con los métodos del controlador.

module.exports = function(UserModel) {
    
    return {
        // [GET] /users (Listar todos)
        getAllUsers: async (req, res) => {
            try {
                const users = await UserModel.listar();
                res.status(200).json(users);
            } catch (error) {
                console.error("Error al listar usuarios:", error);
                res.status(500).json({ message: "Error interno al listar usuarios." });
            }
        },

        // [GET] /users/:id (Buscar por ID)
        getUserById: async (req, res) => {
            try {
                const { id } = req.params;
                const user = await UserModel.buscar(id);

                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ message: `Usuario con ID ${id} no encontrado.` });
                }
            } catch (error) {
                console.error("Error al buscar usuario:", error);
                res.status(500).json({ message: "Error interno al buscar usuario." });
            }
        },

        // [POST] /users (Agregar nuevo usuario/Registro)
        createUser: async (req, res) => {
            try {
                // Se asume que los datos vienen en el cuerpo (body) de la petición
                const { name, username, email, password } = req.body;
                
                const result = await UserModel.agregar(name, username, email, password);
                
                res.status(201).json({ 
                    message: "Usuario registrado exitosamente",
                    id: result.insertId
                });
            } catch (error) {
                console.error("Error al registrar usuario:", error);
                res.status(500).json({ message: "Error interno al registrar usuario." });
            }
        },
        
        // [PUT] /users/:id/name (Actualizar nombre)
        updateUserName: async (req, res) => {
            try {
                const { id } = req.params;
                const { newName } = req.body; // Se espera newName en el body

                await UserModel.setName(id, newName);

                res.status(200).json({ message: `Nombre del usuario ${id} actualizado a ${newName}.` });
            } catch (error) {
                console.error("Error al actualizar nombre:", error);
                res.status(500).json({ message: "Error interno al actualizar nombre." });
            }
        },
        
        // [DELETE] /users/:id (Eliminar usuario)
        deleteUser: async (req, res) => {
            try {
                const { id } = req.params;
                await UserModel.borrar(id);

                res.status(200).json({ message: `Usuario con ID ${id} eliminado exitosamente.` });
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
                res.status(500).json({ message: "Error interno al eliminar usuario." });
            }
        }
    };
};