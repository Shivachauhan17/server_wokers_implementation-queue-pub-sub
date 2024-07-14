import { createClient } from "redis";

const client=createClient()

// const personVerified=async(submission:string)=>{
//     console.log("submission string: ",submission)
//     const {name,passion}=JSON.parse(submission)
//     console.log("name of person:",name)
//     console.log("passion of person:",passion)
//     console.log("---------------------task Done--------------------")
//     client.publish('person',"hello")
// }



const startWorker=async()=>{
    try{
        await client.connect()
        console.log("Worker connected to Redis.");
        while(true){
            try{
                const submission=await client.brPop("indentity",0)
                console.log(submission)
                // await personVerified(submission.element)
            }
            catch(e){
                console.error("Error processing submission:", e);
            }
        }
    }
    catch(e){
        console.log("error in connecting worker to redis:",e)
    }
}

startWorker()