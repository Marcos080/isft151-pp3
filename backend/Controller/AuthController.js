const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = function(UserModel) {

    // 🔐 Login de usuario
    const login = async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await UserModel.findByUsername(username);

            if (!user || user.password !== password) {
                return res.status(401).json({ success: false, message: "Credenciales inválidas." });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRETO,
                { expiresIn: process.env.JWT_TIEMPO_EXPIRA || "1h" }
            );

            res.cookie("jwt", token, { httpOnly: true });
            res.json({ success: true, message: "Login exitoso", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error interno al iniciar sesión." });
        }
    };

    // 🧍 Registrar nuevo usuario
    const register = async (req, res) => {
        try {
            const { name, username, email, password } = req.body;
            const existingUser = await UserModel.findByUsername(username);
            if (existingUser) return res.status(409).json({ success: false, message: "Usuario ya existe" });

            const result = await UserModel.agregar(name, username, email, password);
            res.status(201).json({ success: true, message: "Usuario registrado", userId: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error al registrar usuario." });
        }
    };

    // 🧠 Verifica si el usuario sigue autenticado
    const isAuthenticated = async (req, res) => {
        const token = req.cookies.jwt || req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.status(200).json({ valid: false });

        try {
            const decodificado = await promisify(jwt.verify)(token, process.env.JWT_SECRETO);
            const user = await UserModel.findByUsername(decodificado.username);
            if (!user) return res.status(200).json({ valid: false });

            res.json({ valid: true, user: { id: decodificado.id, username: decodificado.username } });
        } catch (error) {
            res.status(200).json({ valid: false });
        }
    };

    // 🚨 Middleware para verificar token en rutas protegidas
    const verificarToken = async (req, res, next) => {
        try {
            const token = req.cookies.jwt || req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ error: "Token no proporcionado." });
            }

            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRETO);
            req.user = decoded; // guarda los datos (id, username)
            next();
        } catch (error) {
            return res.status(403).json({ error: "Token inválido o expirado." });
        }
    };

    // 👇 Exportás las funciones y el middleware
    return { login, register, isAuthenticated, verificarToken };
};
