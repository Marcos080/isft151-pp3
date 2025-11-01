const express = require("express");

module.exports = (authController) => {
    const router = express.Router();

    router.post("/login", authController.login);
    router.post("/register", authController.register);
    router.get("/verify", authController.isAuthenticated);

    return router;
};
