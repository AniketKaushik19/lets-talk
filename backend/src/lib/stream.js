import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apiKey=process.env.STREAM_KEY
const apiSecret=process.env.STREAM_SECRET

if(!apiKey ||  !apiSecret){
    console.error("Stream API key or secret is missing")
}

const StreamClient = StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreamUser =async (userData) => {
    try{
        await StreamClient.upsertUsers([userData]);
        return userData
    }catch(error){
        console.error("Error upserting Stream user",error)
    }
}


// TODO : do
export const  generateStreamToken= async(userId)=>{
    try {
        //ensure userId is a string
        const userIdStr=userId.toString();
        return StreamClient.createToken(userIdStr)
    } catch (error) {
        console.log("Error generating Stream token",error.message)
    }
}