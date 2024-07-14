import express from 'express'
import { createClient } from 'redis'

const app=express()
app.use(express.json())
const client=createClient()

// client.subscribe("person",()=>{
//     console.log("subscriber to channel")
// })

// client.on('message',(channel,message)=>{
//     console.log("received message on channel: ",message)
// })

app.post('/pushToQueue',async(req,res)=>{
    console.log("endpoint hitted")
    const {name,passion}=req.body
    if(!name|| !passion){
        return res.status(400).json({msg:"input are not sent correctly"})
    }
    try{
        await client.lPush("indentity",JSON.stringify({name:name,passion:passion}))
        return res.status(200).json({msg:"succesfully added to queue"})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({msg:"some error occured on server"})
    }
})


const start=async()=>{
    await client.connect()
    console.log("redis client is connected")
    app.listen(5000,()=>{
        console.log("server is connected you better catch it")
    })
}

start()