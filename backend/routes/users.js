var express= require('express');
const router=express.Router();
const util=require("../util")
const User=require('../models/user')

//Add new user
router.post("/new",(req,res,next)=>{
    
    const newUser=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role:0,
        conversations:[]

    })

    User.new(newUser,(err,user)=>{
        if(err){
            util.resError(res,err)
        }
        else{
            util.res(res,true,"User was added",user)
        }
    })
})

//Get all users
router.get('/',(req,res,next)=>{
    User.find({},(err,users)=>{
        if(err){
            util.resError(res,err);
        }
        else{
            util.res(res,true,"Users were retrieved",users)
        }
    })
})

router.post('/find',(req,res,next)=>{
    if(util.isLoggedIn(req)){
        User.find({"name":{"$regex":"^"+req.body.pattern,"$options":"i"}},(err,users)=>{
            if(err){
                util.resError(res,err)
            }
            else{
                util.res(res,true,"Users were found",users)
            }
        })
    }
    else{
        util.res(res,false,"You are not logged in")
    }
})

module.exports=router;