import express, { urlencoded, json } from 'express';
import { createClient } from 'redis';

import { v4 } from 'uuid';
const app = express();
const PORT = 3000;
const NAME_CHANNEL = "channel1";

app.use(urlencoded({ extended: false }));
app.use(json());


const redisClient=createClient()
redisClient.on('error', err => console.log('Redis Client Error', err));

app.post('/testRedis',async(req,res)=>{
    try{
        if(!req.body){
            return res.json({msg:"json input is not sent in body"})
        }

        const message={
            id:v4(),
            message:req.body.message,
            date:new Intl.DateTimeFormat('es-ES').format(new Date()),
        }

        redisClient.publish( NAME_CHANNEL,JSON.stringify(message))
        return res.json({ mag: 'Publishing an Event using Redis successful'});

    }
    catch(e){
        console.log(e)
        return res.status(500).json({err:e})
    }
})

const start=async()=>{
    redisClient.connect()
    console.log('redis server is connected')
    app.listen(PORT,()=>{
        console.log(`server is connected at ${PORT}`)
    })
}

start()