import express from 'express';
import "dotenv/config";
import cors from 'cors'

import authRoutes from './routes/auth.route.js'; // Import the auth routes
import userRoutes from './routes/user.route.js'; // Import the auth routes
import chatRoutes from './routes/chat.route.js'; // Import the auth routes

import { connectDB } from './lib/db.js'; // Import the database connection function
import cookieParser from 'cookie-parser'
import path from 'path'
const app = express(); 
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true, //allow frontend to send cookies
}))
app.use(express.json());
app.use(cookieParser())
const PORT=process.env.PORT || 3001;

const __dirname=path.resolve()

app.use("/api/auth",authRoutes); // Define a auth route
app.use("/api/users",userRoutes); // Define a user route
app.use("/api/chat",chatRoutes)

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});