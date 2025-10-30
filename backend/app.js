const { conectar, conexion } = require("./db/db");
const express = require("express")
const cors = require("cors"); 
const path = require("path");
const cookieParser = require("cookie-parser")

const { UserModel } = require("./model/UserModel")
const { PetModel } = require("./model/PetModel")
const { PetPictureModel } = require("./model/PetPictureModel")

const userControllerFactory = require('./Controller/UserController');
const userRoutesFactory = require('./router/UserRoutes');
const authControllerFactory = require('./Controller/AuthController');
const authRoutesFactory = require('./router/authRoutes');
const { PetController } = require("./Controller/PetController");
const AuthController = require("./Controller/AuthController");


conectar();

const userModelInstance = new UserModel(conexion);
const petModel = new PetModel(conexion);
const petPictureModel = new PetPictureModel(conexion); 

const userController = userControllerFactory(userModelInstance);
const userRouter = userRoutesFactory(userController);

const authController = authControllerFactory(userModelInstance);
const authRouter = authRoutesFactory(authController);



const app = express();
app.use(express.json())
app.use(cors());

app.use(cookieParser())

app.use(express.static(path.join(__dirname, '..', 'frontend')));



app.get('/', authController.isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "static", "dash.html"));
});

app.get("/login", (req, res) =>
{
    res.sendFile(path.join(__dirname, '..', 'frontend', 'static',  'LoginApp.html'));
})

app.get("/limpiar", (req, res) =>
{
    res.clearCookie("jwt")
    console.log("cookie borrada");
    return res.redirect("/")
})




app.use('/users', userRouter);
app.use('/auth', authRouter);

const petController = new PetController(app, petModel);



app.listen(3000, () =>
{
    console.log("Servidor corriendo en http://localhost:3000");
})


