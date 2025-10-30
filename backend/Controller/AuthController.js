module.exports = function(UserModel) {
    
    // [POST] /auth/register
    const register = async (req, res) => {
        try {
            const { name, username, email, password } = req.body;
            
            // 1. VERIFICAR DUPLICADOS (Usamos el nuevo método)
            const existingUser = await UserModel.findByUsername(username);

            if (existingUser) {
                // Código 409 Conflict: Indica que el recurso ya existe
                return res.status(409).json({ 
                    success: false, 
                    message: `El nombre de usuario '${username}' ya está en uso.` 
                });
            }

            // 2. REGISTRAR USUARIO
            // NOTA: Se asume que la validación de 'email' no duplicado se maneja en la BD
            const result = await UserModel.agregar(name, username, email, password);
            
            res.status(201).json({ 
                success: true, 
                message: "Usuario registrado exitosamente.",
                userId: result.insertId
            });
        } catch (error) {
            console.error("Error en el registro:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor al registrar." });
        }
    };

    // [POST] /auth/login
    const login = async (req, res) => {
        try {
            // Recibimos solo el username y password del frontend
            const { username, password } = req.body; 

            // 1. BUSCAR AL USUARIO (Usamos el nuevo método)
            const user = await UserModel.findByUsername(username); 

            if (!user) {
                // Usuario no encontrado
                return res.status(401).json({ success: false, message: "Credenciales inválidas." });
            }

            // 2. VERIFICAR CONTRASEÑA (Sin hash por ahora)
            // IDEAL: Usar bcrypt.compare(password, user.password)
            if (user.password !== password) {
                // Contraseña incorrecta
                return res.status(401).json({ success: false, message: "Credenciales inválidas." });
            }

            // 3. LOGIN EXITOSO
            // Aquí iría la generación del Token JWT para la sesión
            res.status(200).json({ 
                success: true,
                message: "Inicio de sesión exitoso.",
                user: { id: user.id, username: user.username, email: user.email }
            });

        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor al iniciar sesión." });
        }
    };

    vista = (req, res) =>
    {
        return "hola";
    }
    
    return {
        register,
        login,
        vista
    };
};