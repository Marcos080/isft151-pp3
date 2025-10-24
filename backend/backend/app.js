//este es Commonjs
const { conectar, conexion } = require("./db/db");
const express = require("express")
// const fs = require("fs");

// const { UserModel } = require("./model/UserModel")
// const { PetModel } = require("./model/PetModel")

conectar();
// const script_sql = fs.readFileSync("./db/sql/datos_iniciales.sql", "utf8" );
// conexion.query(script_sql);

// const model = new UserModel(conexion);
// model.listar();
// model.buscar(2);
// model.setUsername(2, "tomazzzElUser");
// model.setPassword(2, "contraseña");
// model.buscar(2);
// // model.borrar(6)

const model = new PetModel(conexion);
// // model.agregar(1, "pedro", 4, "un pavo, ladra a los gatos el loco");
model.listar();
// model.setName(4, "cafe");
// model.setAge(4, 6);
model.setDescription(5, "Una piedra, tiene forma de alemania");
model.listar();
// model.buscar(4);
// model.borrar(6);

//Si quiero usarlo de este modo tengo que poner  "type": "module", en package
//revisar mas tarde la diferencia entre Commonjs y ESM (este es ESM)

// import mysql from "mysql2";
// import express from "express";
// import dotenv from "dotenv";

const app = express();
app.use(express.json())

// const conexion = mysql.createConnection(
//     {
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         port: process.env.DB_PORT
//     }
// );

// conexion.execute(tabla_user)
// conexion.execute(tabla_pet)

// conexion.execute(agregar_user, user);
// conexion.execute(agregar_pet, pet);



app.listen(3000, () =>
{
    console.log("Servidor corriendo en http://localhost:3000");
})





//rutas con express(usarlo mas adelante)


// // Ejemplo: obtener todos los usuarios
// app.get('/usuarios', (req, res) => {
//   const query = 'SELECT * FROM usuarios';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error al ejecutar consulta:', err);
//       return res.status(500).json({ error: 'Error al obtener usuarios' });
//     }
//     res.json(results);
//   });
// });

// // Ejemplo: insertar usuario
// app.post('/usuarios', (req, res) => {
//   const { nombre, email } = req.body;
//   const query = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
//   db.query(query, [nombre, email], (err, result) => {
//     if (err) {
//       console.error('Error al insertar:', err);
//       return res.status(500).json({ error: 'Error al crear usuario' });
//     }
//     res.json({ id: result.insertId, nombre, email });
//   });
// });

