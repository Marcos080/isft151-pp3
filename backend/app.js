const { conectar, conexion } = require("./db/db");
const express = require("express");
const path = require("path");

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


// Conexión a la BD
conectar();

// INSTANCIAS DE MODELOS
const userModelInstance = new UserModel(conexion);
const petModel = new PetModel(conexion);
const chatModel = new ChatModel(conexion);

// CONTROLADORES
const userController = userControllerFactory(userModelInstance);
const userRouter = userRoutesFactory(userController);

// 🔐 Controlador de autenticación
const authController = authControllerFactory(userModelInstance);
const authRouter = authRoutesFactory(authController);

// Servidor Express
const app = express();
app.use(express.json());

new PetController(app, petModel);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "..", "frontend")));

// 🚀 RUTA PRINCIPAL (SPA)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "static", "index.html"));
});

app.use("/users", userRouter);
app.use("/auth", authRouter);

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

app.listen(3000, () => console.log("✅ Servidor corriendo en http://localhost:3000"));
