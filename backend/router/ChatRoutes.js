const express = require("express");
const router = express.Router();

module.exports = function(ChatController) {
    router.post('/start/:id_user/:id_pet', ChatController.startConversation);
    router.post('/:id_conversation/message', ChatController.sendMessage);
    router.get('/:id_conversation/messages', ChatController.getMessages);
    return router;
};
