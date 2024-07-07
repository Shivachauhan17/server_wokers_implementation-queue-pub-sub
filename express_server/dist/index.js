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
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
app.post('/pushToQueue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("endpoint hitted");
    const { name, passion } = req.body;
    if (!name || !passion) {
        return res.status(400).json({ msg: "input are not sent correctly" });
    }
    try {
        yield client.lPush("person", JSON.stringify({ name: name, passion: passion }));
        return res.status(200).json({ msg: "succesfully added to queue" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "some error occured on server" });
    }
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    console.log("redis client is connected");
    app.listen(5000, () => {
        console.log("server is connected you better catch it");
    });
});
start();
