"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const redis_1 = require("redis");
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const PORT = 3000;
const NAME_CHANNEL = "channel1";
app.use((0, express_1.urlencoded)({ extended: false }));
app.use((0, express_1.json)());
const redisClient = (0, redis_1.createClient)();
redisClient.on('error', err => console.log('Redis Client Error', err));
app.post('/testRedis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.json({ msg: "json input is not sent in body" });
        }
        const message = {
            id: (0, uuid_1.v4)(),
            message: req.body.message,
            date: new Intl.DateTimeFormat('es-ES').format(new Date()),
        };
        redisClient.publish(NAME_CHANNEL, JSON.stringify(message));
        return res.json({ mag: 'Publishing an Event using Redis successful' });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ err: e });
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    redisClient.connect();
    console.log('redis server is connected');
    app.listen(PORT, () => {
        console.log(`server is connected at ${PORT}`);
    });
});
start();
