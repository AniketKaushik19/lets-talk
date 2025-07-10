import express from 'express';
import { login, logout, signup } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { onboarding } from '../controller/auth.controller.js';
const router = express.Router();

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.post("/onboarding",protectRoute,onboarding)



//check user is login or not
router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true , user:req.user})
})


export default router;