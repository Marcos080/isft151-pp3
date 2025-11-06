const { conectar, conexion } = require("./db/db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// MODELOS
const { UserModel } = require("./model/UserModel");
const { PetModel } = require("./model/PetModel");
const { ChatModel } = require("./model/ChatModel");

// CONTROLADORES Y ROUTERS
const userControllerFactory = require("./Controller/UserController");
const userRoutesFactory = require("./router/UserRoutes");
const authControllerFactory = require("./Controller/AuthController");
const authRoutesFactory = require("./router/authRoutes");
const { PetController } = require("./Controller/PetController");
const {ChatController} = require("./Controller/ChatController");
const { rejects } = require("assert");
// const chatRouter = require("./router/ChatRoutes");

// Conexión a la BD
conectar();

// INSTANCIAS DE MODELOS
const userModelInstance = new UserModel(conexion);
const petModel = new PetModel(conexion);
const chatModel = new ChatModel(conexion);

//const query = ``;

// conexion.query(query, (error, result) =>
// {
//     if(error){ console.log(error)}
//     if(result){ console.log("salio bien");}
// });



// CONTROLADORES
const userController = userControllerFactory(userModelInstance);
const userRouter = userRoutesFactory(userController);

// 🔐 Controlador de autenticación
const authController = authControllerFactory(userModelInstance);
const authRouter = authRoutesFactory(authController);

// Servidor Express
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "frontend")));



// 🚀 RUTA PRINCIPAL (SPA)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "static", "index.html"));
});

// 📡 API: rutas públicas
app.use("/users", userRouter);
app.use("/auth", authRouter);


// 🧩 Extraemos la función de verificación desde el authController
const { verificarToken } = authController;

// 🔒 RUTAS PROTEGIDAS: aplicar middleware a las rutas de mascotas
app.use("/pet", verificarToken);
app.use("/pets", verificarToken);
// app.use("/chat", verificarToken);

// 🐾 Controlador de mascotas
new PetController(app, petModel);
new ChatController(app, chatModel);


// SPA fallback: permite refrescar o navegar dentro del SPA sin errores 404
app.use((req, res, next) => {
    const publicPaths = ["/users", "/auth", "/pet", "/pets", "/chat"];
    const isApiRequest = publicPaths.some(p => req.path.startsWith(p));
    if (!isApiRequest) {
        res.sendFile(path.join(__dirname, "..", "frontend", "static", "index.html"));
    } else {
        next();
    }
});

// Iniciar servidor
app.listen(3000, () => console.log("✅ Servidor corriendo en http://localhost:3000"));
