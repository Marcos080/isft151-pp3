const jwt = require("jsonwebtoken")
const {  promisify } = require("util")

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
            const token = jwt.sign({User : username}, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_TIEMPO_EXPIRA })

            console.log("Token:"+ token);

            const cookiesOptions = 
            {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *1000),
                httpOnly: true
            }

            res.cookie("jwt", token, cookiesOptions);

            return res.status(200).json({ 
                                        success: true, 
                                        message: "Login exitoso",
                                        redirect: "/" // Indica al frontend que redireccione a la ruta principal
                                    });

        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor al iniciar sesión." });
        }
    };


    const isAuthenticated = async (req, res, next) =>
    {
        if(req.cookies.jwt)
        {
            try
            {
                console.log("se llamo isauthenticated");
                const decodificado = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
                const user = await UserModel.findByUsername(decodificado.User)
                if(!user){ return next()}
                 console.log("se llamo isauthenticated en bd");
                req.username = user;
                return next()
            }

            catch(error)
            {
                console.log(error);
                res.redirect("/login");
            }

        }

        else
        {
             console.log("no vio el token");
            res.redirect("/login");
        }
    }
    
    return {
        register,
        login,
        isAuthenticated
    };
};