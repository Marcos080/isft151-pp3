mysql = require("mysql2")
dotenv = require("dotenv")

dotenv.config();

const conexion = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }



);

function conectar()
{
    conexion.connect((error) => {
        if(error)
        {
            console.error("ERROR al conectarse a la base de datos", error)
            return      
        }

        console.log("Conectado a mySQL")

        }
    );
}

module.exports = { conexion, conectar};