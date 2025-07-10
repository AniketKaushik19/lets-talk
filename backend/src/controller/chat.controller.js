import { generateStreamToken } from "../lib/stream.js"
export async function getStreamToken(req,res) {
    try {
        const token=await generateStreamToken(req.user.id)
     return  res.status(201).json({token})
    } catch (error) {
        console.log("Error in getStreamToken controller",error.message) 
        res.status(500).json({message:"Internal Server Error"})  
    }
}

