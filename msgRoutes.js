const express = require("express");
const router = express.Router();
const {
    sendMessage,
    getMessages,
    sendReply,
    deleteMessage
} = require("../controller/msgController");
router.post("/", sendMessage);          
router.get("/", getMessages);         
router.post("/reply/:id", sendReply);   
router.delete("/:id", deleteMessage);
module.exports = router;
