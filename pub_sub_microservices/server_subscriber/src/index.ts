import express from 'express'
import {v4} from 'uuid'
import { createClient } from 'redis'
const NAME_CHANNEL = "channel1";

const PORT=5000

const app=express()
app.use(express.json())

const messagesStorage: any[] = [];

const redisClient = createClient();
const redisClient2 = createClient();



app.get('/getMessages',(req,res)=>{
    try{
        return res.status(200).json({msg:messagesStorage})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({msg:"error in returning the meessages"})
    }
})

app.post('/rpopFromList', async (req, res) => {
    try {
        
      const listKey = req.body.listKey;
      const poppedElement = await redisClient2.rPop(listKey);
      return res.status(200).json({ msg: poppedElement });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "Error in RPOP operation" });
    }
  });

  Promise.all([redisClient.connect(), redisClient2.connect()])
  .then(async () => {
    console.log("Redis clients are connected");
    
    // Subscribe to the channel after the client has connected
    await redisClient.subscribe(NAME_CHANNEL,(message)=>{
        console.log("message got on Channel: ",message)
        messagesStorage.push(JSON.parse(message))
    });
    
    app.listen(PORT, () => {
      console.log(`Server is started at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to Redis", err);
  });