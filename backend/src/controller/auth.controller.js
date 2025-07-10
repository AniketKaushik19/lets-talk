import User from '../model/User.js';
import jwt from 'jsonwebtoken'
import { upsertStreamUser } from '../lib/stream.js';

export async function signup(req, res) {
  const { fullname, email, password, bio, nativelanguage, learninglanguage, location } = req.body;
  try {
    if(!fullname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });     
    }  
    if(password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });  
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
       return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const id=Math.floor(Math.random()*100)+1; //generate a number b/w 1 to 100
    const randomAvatar=`https://avatar.iran.liara.run/public/${id}.png`;
    const newUser =await User.create({
        email,
        fullname,
        password,
        profilepic:randomAvatar
    })

    //TODO: create the user in stream as well
    try{
      await upsertStreamUser({
      id:newUser._id.toString(),
      name:newUser.fullname,
      image:newUser.profilepic || ""
    })
    console.log(`Stream user created for ${newUser.fullname}`)
    }catch(error){
      console.log("Error creating Stream user:",error)
    }
    
    const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
      expiresIn:'7d'
    })

    res.cookie("jwt",token,{
      maxAge:7*24*60*60*1000,
      httpOnly:true, // prevent XSS attacks  
      sameSite:"strict", //prevent CSRF attacks
      secure:process.env.NODE_ENV==="production",
    }) 

    res.status(201).json({success:true,user:newUser})
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


export async function login(req, res) {
  try {
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({message:"All fields are required"})
    }

    const user=await User.findOne({email});
    if(!user) return res.status(400).json({message:"Invalid email or password"})
     
    const isPasswordCorrect =await user.matchPassword(password)
    if(!isPasswordCorrect) return res.status(401).json({message:"Invaild email or Password "})
    //TODO: login the user in stream as well
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
      expiresIn:'7d'
    })

    res.cookie("jwt",token,{
      maxAge:7*24*60*60*1000,
      httpOnly:true, // prevent XSS attacks  
      sameSite:"strict", //prevent CSRF attacks
      secure:process.env.NODE_ENV==="production",
    }) 

    res.status(200).json({success:true ,user})
  } catch (error) {
    console.log("Error in login Controller",error.message)
    res.status(500).json({message:"Internal Server Error"})
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt")
  res.status(200).json({success:true, message:"Logout Successful"})
}

export async function onboarding(req , res ) {
  try {
    const userId=req.user._id;
    const {fullname ,bio,nativelanguage,learninglanguage,location}=req.body

    if(!fullname || !bio || !nativelanguage || !learninglanguage || !location){
      return res.status(400).json({message:"All fields are required",})
    }
    const updatedUser =await User.findByIdAndUpdate(userId ,{
      ...req.body,
      isOnboarded:true,
    },{new:true})

    if(!updatedUser) return res.status(404).json({message:"User not found"})
    
    //TODO: UPDATE THE USER INFO IN STREAM
    try {
      await upsertStreamUser({
        id:updatedUser._id.toString(),
        name:updatedUser.fullname,
        image:updatedUser.profilepic || "",
      })
      console.log(`Stream user updated after onboarding for ${updatedUser.fullname}`)
    } catch (streamError) {
      console.log("Error updating stream user during", streamError.message);
    }
    res.status(200).json({success:true,user:updatedUser})
  } catch (error) {
    console.error("Onboarding error:",error)
    res.status(500).json({message:"Internal server error"})
  }
    console.log(req.user)
}