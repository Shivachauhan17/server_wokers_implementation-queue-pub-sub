"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const NAME_CHANNEL = "channel1";
const PORT = 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const messagesStorage = [];
const redisClient = (0, redis_1.createClient)();
redisClient.subscribe(NAME_CHANNEL, (message) => {
    console.log("message got on Channel: ", message);
    messagesStorage.push(JSON.parse(message));
});
app.get('/getMessages', (req, res) => {
    try {
        return res.status(200).json({ msg: messagesStorage });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "error in returning the meessages" });
    }
});
redisClient.connect().then(() => {
    console.log("redis is connected");
    app.listen(PORT, () => { console.log(`Subscriers server is started at port ${PORT}`); });
});
