"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const redisClient2 = (0, redis_1.createClient)();
app.get('/getMessages', (req, res) => {
    try {
        return res.status(200).json({ msg: messagesStorage });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "error in returning the meessages" });
    }
});
app.post('/rpopFromList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listKey = req.body.listKey;
        const poppedElement = yield redisClient2.rPop(listKey);
        return res.status(200).json({ msg: poppedElement });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "Error in RPOP operation" });
    }
}));
Promise.all([redisClient.connect(), redisClient2.connect()])
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Redis clients are connected");
    // Subscribe to the channel after the client has connected
    yield redisClient.subscribe(NAME_CHANNEL, (message) => {
        console.log("message got on Channel: ", message);
        messagesStorage.push(JSON.parse(message));
    });
    app.listen(PORT, () => {
        console.log(`Server is started at port ${PORT}`);
    });
}))
    .catch((err) => {
    console.error("Error connecting to Redis", err);
});
