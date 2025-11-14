const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// ❗ Cargar dotenv: Se asume que el .env está en la carpeta '../backend'
require("dotenv").config({
    // La ruta es relativa a donde se ejecuta el script (release)
    path: path.join(__dirname, "..", "backend", ".env")
});

console.log("DEBUG: iniciando setupDB.js");
console.log("DEBUG: __dirname =", __dirname);

// Crear conexión
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Conexión promisificada
function conectarAsync() {
    return new Promise((resolve, reject) => {
        conexion.connect(err => {
            if (err) return reject(err);
            console.log("✔ Conectado a MySQL");
            resolve();
        });
    });
}

(async () => {
    try {
        await conectarAsync();

        // Ruta al archivo SQL: Asume que el SQL está en '../backend/db/sql/'
        const sqlPath = path.join(
            __dirname,
            "..",
            "backend",
            "db",
            "sql",
            "tablas.sql"
        );

        console.log("Ruta SQL:", sqlPath);

        if (!fs.existsSync(sqlPath)) {
            console.error("❌ ERROR: No se encuentra el archivo SQL en la ruta:", sqlPath); // Mensaje de error mejorado
            process.exit(1);
        }

        const sql = fs.readFileSync(sqlPath, "utf8");
        const statements = sql.split(/;\s*$/m).filter(s => s.trim().length);

        console.log("Sentencias encontradas:", statements.length);

        for (const statement of statements) {
            await new Promise((resolve, reject) => {
                conexion.query(statement, (err, results) => {
                    if (err) return reject(err);
                    console.log("✔ SQL ejecutado");
                    resolve(results);
                });
            });
        }

        console.log("✔ Base de datos inicializada correctamente");
        process.exit(0);

    } catch (err) {
        console.error("❌ ERROR FATAL:", err);
        process.exit(1);
    }
})();