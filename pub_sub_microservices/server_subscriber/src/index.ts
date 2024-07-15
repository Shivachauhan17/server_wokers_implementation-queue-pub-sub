import express from 'express'
import {v4} from 'uuid'
import { createClient } from 'redis'
const NAME_CHANNEL = "channel1";

const PORT=5000

const app=express()
app.use(express.json())

const messagesStorage: any[] = [];

const redisClient = createClient();

redisClient.subscribe(NAME_CHANNEL,(message)=>{
    console.log("message got on Channel: ",message)
    messagesStorage.push(JSON.parse(message))
})

app.get('/getMessages',(req,res)=>{
    try{
        return res.status(200).json({msg:messagesStorage})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({msg:"error in returning the meessages"})
    }
})

redisClient.connect ().then(()=>{
    console.log("redis is connected")
    app.listen(PORT,()=>{console.log(`Subscriers server is started at port ${PORT}`)})
})