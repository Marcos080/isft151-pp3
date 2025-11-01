const express = require('express');
const router = express.Router();

module.exports = function(userController) {
    
    router.get('/', userController.getAllUsers);

    router.get('/:id', userController.getUserById);

    router.post('/', userController.createUser);
    
    router.put('/:id/name', userController.updateUserName); 
    
    router.delete('/:id', userController.deleteUser);
    
    return router;
};