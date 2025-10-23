//este es Commonjs
const { conectar, conexion } = require("./db/db");
express = require("express")
const fs = require("fs");



conectar();
const script_sql = fs.readFileSync("./db/sql/datos_iniciales.sql", "utf8" );
// conexion.query(script_sql);

// script_sql = `SELECT * FROM user`
conexion.query(script_sql, (error, response) =>
    {
    if(error)
    {
        console.error("error en select", error);
        return;
    }

    console.log("salio bien");

//     for (let user of response){
//     console.log(user);
// }
}
);



//Si quiero usarlo de este modo tengo que poner  "type": "module", en package
//revisar mas tarde la diferencia entre Commonjs y ESM (este es ESM)

// import mysql from "mysql2";
// import express from "express";
// import dotenv from "dotenv";

// const agregar_user = `INSERT INTO user(name, username, email, password) VALUES (?, ?, ?, ?)`;
// const user = [
//     "julian",
//     "julianElPro",
//     "@julianes12",
//     "1222"
// ]

// const agregar_pet = `INSERT INTO PET(id_owner, name, age, description) VALUES (?, ?, ?, ?)`
// const pet = [
//     "1",
//     "bomba",
//     4,
//     "pitbull negro, le gusta las empanadas de pollo"
// ];



// dotenv.config();

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

