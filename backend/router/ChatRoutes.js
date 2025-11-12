// router/chatRoutes.js
const express = require("express");
const ChatController = require("../Controller/ChatController");

module.exports = function (model) {
    const router = express.Router();
    const controller = new ChatController(model); // ✅ sin app

    router.get("/chat/list/:id_user", controller.listarChats.bind(controller));

    router.post(
        "/chat/start/:id_user/:id_pet",
        controller.iniciarChat.bind(controller)
    );

    router.post(
        "/chat/:id_conversation/message",
        controller.enviarMensaje.bind(controller)
    );

    router.get(
        "/chat/:id_conversation/messages",
        controller.obtenerMensajes.bind(controller)
    );

    router.get(
        "/chat/conversations/:id_user",
        controller.listarConversaciones.bind(controller)
    );

    return router;
};
