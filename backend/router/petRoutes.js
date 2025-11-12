// routes/petRoutes.js
const express = require("express");
const upload = require("../upload.js");

module.exports = function (model) {
    const router = express.Router();
    const PetController = require("../Controller/PetController.js");
    const controller = new PetController(model);

    
        // ✅ Rutas con prefijo como antes
    router.post("/pet", controller.agregarMascota.bind(controller));
    router.put("/pet", controller.borrarMascota.bind(controller));
    router.get("/pets", controller.listarMascotas.bind(controller));
    router.get("/pet/:username", controller.buscarPorUsername.bind(controller));
    router.get("/pet/own_pets/:id", controller.listarMascotasDelUsuario.bind(controller));

    router.post(
        "/pet/:id/photo",
        upload.single("photo"),
        controller.subirFoto.bind(controller)
    );

    return router;
};
