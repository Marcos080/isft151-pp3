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


 

const tabla_user_pet_follow = `CREATE TABLE IF NOT EXISTS user_pet_follow
        (id INT AUTO_INCREMENT PRIMARY KEY,
        id_user INT NOT NULL,
        id_pet INT NOT NULL,

        FOREIGN KEY(id_user) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY(id_pet) REFERENCES pet(id) ON DELETE CASCADE,

        UNIQUE(id_user, id_pet)
       );`;


CREATE TABLE conversation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user1 INT NOT NULL,
    id_user2 INT NOT NULL,
    id_pet INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user1) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (id_user2) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pet) REFERENCES pet(id) ON DELETE CASCADE,

    CONSTRAINT unique_conversation_per_pet UNIQUE (id_user1, id_user2, id_pet);
);


CREATE TABLE IF NOT EXISTS message (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_conversation INT NOT NULL,
  id_sender INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_conversation) REFERENCES conversation(id) ON DELETE CASCADE,
  FOREIGN KEY (id_sender) REFERENCES user(id) ON DELETE CASCADE
);

