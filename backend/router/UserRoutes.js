const express = require('express');
const router = express.Router();

//Función que recibe el Controlador y mapea las rutas.
//@param {object} userController - El objeto con las funciones del controlador.
//@returns {object} El router de Express listo para ser usado.

module.exports = function(userController) {
    
    router.get('/', userController.getAllUsers);

    router.get('/:id', userController.getUserById);

    router.post('/', userController.createUser);
    
    router.put('/:id/name', userController.updateUserName); 
    
    router.delete('/:id', userController.deleteUser);
    
    return router;
};