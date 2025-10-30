//esta el metodo insert en la carpeta de sql pero tengo que hacerlo promesa todavia
class PetPictureModel
{
    constructor(conexion)
    {
        this.conexion = conexion

        const tabla_sql = `CREATE TABLE IF NOT EXISTS photo
        (id INT AUTO_INCREMENT PRIMARY KEY,
         id_pet INT NOT NULL,
         image1 LONGBLOB,
         image2 LONGBLOB,
         image3 LONGBLOB,
         image4 LONGBLOB,
         
         FOREIGN KEY (id_pet) REFERENCES pet(id)
         );`;

         this.conexion.query(tabla_sql, (err) => {
            if (err) console.error("Error al crear tabla photo:", err);
            else console.log("Tabla photo conectada correctamente");
        });
    }

    hola()
    {
        console.log("hola");
    }
}

module.exports = { PetPictureModel };