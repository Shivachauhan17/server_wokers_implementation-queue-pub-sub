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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
// const personVerified=async(submission:string)=>{
//     console.log("submission string: ",submission)
//     const {name,passion}=JSON.parse(submission)
//     console.log("name of person:",name)
//     console.log("passion of person:",passion)
//     console.log("---------------------task Done--------------------")
//     client.publish('person',"hello")
// }
const startWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Worker connected to Redis.");
        while (true) {
            try {
                const submission = yield client.brPop("indentity", 0);
                console.log(submission);
                // await personVerified(submission.element)
            }
            catch (e) {
                console.error("Error processing submission:", e);
            }
        }
    }
    catch (e) {
        console.log("error in connecting worker to redis:", e);
    }
});
startWorker();
