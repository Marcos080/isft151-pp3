const { conectar, conexion } = require("./db/db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const { UserModel } = require("./model/UserModel");
const { PetModel } = require("./model/PetModel");

const userControllerFactory = require("./Controller/UserController");
const userRoutesFactory = require("./router/UserRoutes");
const authControllerFactory = require("./Controller/AuthController");
const authRoutesFactory = require("./router/authRoutes");
const { PetController } = require("./Controller/PetController");

conectar();

// MODELOS
const userModelInstance = new UserModel(conexion);
const petModel = new PetModel(conexion);

// CONTROLADORES
const userController = userControllerFactory(userModelInstance);
const userRouter = userRoutesFactory(userController);

const authController = authControllerFactory(userModelInstance);
const authRouter = authRoutesFactory(authController);



const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// RUTA PRINCIPAL SPA
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "static", "index.html"));
});

// API
app.use("/users", userRouter);
app.use("/auth", authRouter);


const petController = new PetController(app, petModel);

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));

app.use((req, res, next) => {
    if (!req.path.startsWith("/api") && !req.path.startsWith("/users") && !req.path.startsWith("/auth")) {
        res.sendFile(path.join(__dirname, "..", "frontend", "static", "index.html"));
    } else {
        next();
    }
});