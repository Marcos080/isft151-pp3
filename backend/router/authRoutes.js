const express = require('express');
const router = express.Router();

module.exports = function(authController) {
    
    // Mapea la petición POST a /auth/register
    router.post('/register', authController.register);

    // Mapea la petición POST a /auth/login
    router.post('/login', authController.login);
    
    return router;
};