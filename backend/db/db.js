mysql = require("mysql2");
dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const conexion = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
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
        initDatabase();

        }
    );
}

function initDatabase() {
    const sqlPath = path.join(__dirname, "sql", "tablas.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    const statements = sql.split(/;\s*$/m).filter(s => s.trim().length);

    statements.forEach(statement => {
        conexion.query(statement, (err, results) => {
            if (err) {
                console.error("Error ejecutando SQL:", err);
            } else {
                console.log("✔ SQL ejecutado correctamente");
            }
        });
    });
}

module.exports = { conexion, conectar};