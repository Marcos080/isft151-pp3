const { conectar, conexion } = require("./db/db");
const express = require("express")

const { UserModel } = require("./model/UserModel")

const userControllerFactory = require('./Controller/UserController');
const userRoutesFactory = require('./router/UserRoutes');
const authControllerFactory = require('./Controller/AuthController');
const authRoutesFactory = require('./router/authRoutes');

conectar();

const userModelInstance = new UserModel(conexion);

const userController = userControllerFactory(userModelInstance);
const userRouter = userRoutesFactory(userController);

const authController = authControllerFactory(userModelInstance);
const authRouter = authRoutesFactory(authController);



const app = express();
app.use(express.json())

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.listen(3000, () =>
{
    console.log("Servidor corriendo en http://localhost:3000");
})


