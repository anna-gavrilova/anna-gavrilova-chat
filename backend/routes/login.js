var express= require('express');
const router=express.Router();
const util=require("./../util")
const User=require('../models/user');

router.post("/",(req,res,next)=>{
   User.login(req.body.email,req.body.password,(err,user)=>{
       if(err){
           util.resError(res,err);
       }
       else if(user){
            util.res(res,true,"User logged in",user)
       }
       else{
           util.res(res,false,"Wrong credentials");
       }
   })
    
})

module.exports=router;