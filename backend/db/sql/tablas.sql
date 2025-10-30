-- crear
--usar comillas invertidas para las consultas en js

-- base de datos
DATABASE_sql = "CREATE DATABASE IF NOT EXISTS AppDB;";
use_database = "USE AppDB";

-- tablas
tabla_user = "CREATE TABLE IF NOT EXISTS user (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
username VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL 

);";

tabla_pet = "CREATE TABLE IF NOT EXISTS pet (
id INT AUTO_INCREMENT PRIMARY KEY,
id_owner INT NOT NULL,
name VARCHAR(255) NOT NULL,
age INT NOT NULL,
description VARCHAR(255) NOT NULL,

FOREIGN KEY (id_owner) REFERENCES user(id)

);";


 const tabla_sql = `CREATE TABLE IF NOT EXISTS photo
        (id INT AUTO_INCREMENT PRIMARY KEY,
         id_pet INT NOT NULL,
         image1 LONGBLOB,
         image2 LONGBLOB,
         image3 LONGBLOB,
         image4 LONGBLOB,
         
         FOREIGN KEY (id_pet) REFERENCES pet(id) ON DELETE CASCADE
         );`;

const tabla_user_pet_follow = `CREATE TABLE IF NOT EXISTS user_pet_follow
        (id INT AUTO_INCREMENT PRIMARY KEY,
        id_user INT NOT NULL,
        id_pet INT NOT NULL,

        FOREIGN KEY(id_user) REFERENCES pet(id) ON DELETE CASCADE,
        FOREIGN KEY(id_pet) REFERENCES user(id) ON DELETE CASCADE,

        UNIQUE(id_user, id_pet)
       );`;

