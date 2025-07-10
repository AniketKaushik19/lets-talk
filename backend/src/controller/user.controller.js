import User from "../model/User.js";
import friendrequest from '../model/friendRequest.js'

export async function getRecommendedUsers(req,res){
    try{
        const currentUserId=req.user.id;
        const currentUser=req.user

        const recommendedUsers=await User.find({
            $and: [
                {_id:{$ne:currentUserId}}, //exclude current user
                {_id:{$nin:currentUser.friends}}, //exclude current user's friends
                {isOnboarded:true}
            ]
        })
        res.status(200).json(recommendedUsers);

    }catch(error){
        console.error("Error in getRecommendedUsers controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getMyFriends(req,res) {
    try {
        const user=await User.findById(req.user.id).select("friends").populate("friends","fullname profilepic nativelanguage , learninglanguage")
        res.status(200).json(user.friends)
    } catch (error) {
        console.error("Error in get My Friends",error.message)
        res.status(400).json({message:"Error in get my friend"})
    }
}

export async function sendFriendRequest(req,res) {
    try{
        const myId=req.user.id;
        const {id:recipientId}=req.params

        //prevent sending req to yourself
        if(myId===recipientId) {
            return res.status(400).json({message:"You can't send friend request to yourself"})
        }
        
        const recipient =await User.findById(recipientId)
        if(!recipient){
            return res.status(404).json({message:"Recipient not found"})
        }
        
        //check if user is already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"})
        }

        //check if a req already exists
        const existingRequest=await friendrequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId},
            ]
        })

        if(existingRequest){
            return res.status(400).json({message:"A friend request already exists b/w you and this user"})
        }
         
        //create a new friend request
        const friendRequest=await friendrequest.create({
            sender:myId,
            recipient:recipientId,
        })
        return res.status(201).json({friendRequest})
    }catch(error){
        console.error("Error in sendFriendRequest controller",error.message);
       return   res.status(500).json({message:"Internal Server Error"})
    }
}

export async function acceptFriendRequest(req,res){
    try{
        const {id:requestId}=req.params;
        const friendRequest=await friendrequest.findById(requestId)

        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"})
        }

        //verify the current user is the recipient
        if(friendRequest.recipient.toString()!==req.user.id){
            return res.status(403).json({message:"You are not authorized to accept this request"})
        }

        friendRequest.status="accepted"
        await friendRequest.save()

        //add each user to the other's friends array
        //$addToSet : adds elements to an array only if they do not already exist.
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })

        res.status(200).json({message:"Friends request accepted"})
    }catch(error){
        console.log("Error in acceptFriendRequest controller", error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export async function getFriendRequests(req,res){
    try {
        const incomingReqs=await friendrequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender", "fullname profilepic nativelanguage learninglanguage")

        const acceptedReqs=await friendrequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient","fullname profilepic")

        res.status(200).json({incomingReqs, acceptedReqs})
    } catch (error) {
        console.log("Error in getPendingFriendRequests controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getOutgoingFriendReqs(req,res) {
    try {
        console.log("Fetching outgoing friend requests for user:", req.user.id)
        const outgoingReq=await friendrequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient", "fullname profilepic nativelanguage learninglanguage")
        console.log("Outgoing Friend Requests:",outgoingReq)
        res.status(200).json(outgoingReq)
    } catch (error) {
        console.log("Error in getOutgoingFriendReq controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}