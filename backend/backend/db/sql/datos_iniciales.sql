-- const fs = require("fs");
-- const script_sql = fs.readFileSync("./db/sql/datos_iniciales.sql", "utf8" );
-- conexion.query(script_sql);

--codificacion: utf8/utf8_bin
--borra los comentarios si lo vas a ejecutar y pone la codificacion, sino no lo agarra
--usar comillas simples en strings

INSERT INTO user(name, username, email, password) 
VALUES
("tomas", "tomasElusuario", "tomas@", "1221"),
("augusto", "augustoUnGusto", "elAugus@", "1111"),
("sebastian", "elSebado", "@nose", "12345"),
("ramiro", "ramiroRamirezzz", "@ramirezzz", "2121");

INSERT INTO pet (id_owner, name, age, description) 
VALUES
( 2, 'pancho', 5, 'perro salchicha, con tendencia piromaniaca'),
( 3, 'milanesa', 6, 'loro, te juzga con la miarada'),
( 4, 'tobias', 1, 'gato naranja, el color te dice el resto'),
( 5, 'rocky', 200, 'una piedra, tiene forma de europa');