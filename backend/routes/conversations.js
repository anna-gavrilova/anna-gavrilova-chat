var express= require('express');
const router=express.Router();
const util=require("./../util")
const User=require('../models/user')
const Conversation=require('../models/conversation')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
var http=require('http');
const io=require('socket.io')()
const _=require('underscore')

//Create new conversation
router.post("/new",(req,res,next)=>{
    

    const newConvo=new Conversation({
        members:[req.body.loggeduser,req.body.startWithId],
        dateOfCreation: new Date(),
        messageHistory:[]
    });
    var id=JSON.parse(req.headers.loggeduser)
    if(util.isLoggedIn(req)){
        Conversation.find({members:[id,req.body.startWithId]},(err,conv)=>{
            if(conv.length){
                util.res(res,false,'Conversation already exists',conv)
                
            }
            else{
                newConvo.save(newConvo,(err,convo)=>{
                    if(err){
                        util.resError(res,err)
                    }
                    else{
                        Conversation.populate(convo,{path:'members'},(err,convo)=>{
                            util.res(res,true,"Empty conversation was created",convo)
                        })
                        
                    }
                })
            }
        })
    }else{
        util.res(res,false,"User is not logged in and cannot create conversations",[]);
    }

})
//gets all the conversations this user is a part of
router.get('/',(req,res,next)=>{
    var id=JSON.parse(req.headers.loggeduser)
    if(util.isLoggedIn(req)){
        Conversation.find({members:id},(err,convos)=>{
            if(err){
                util.resError(res,err);
            }
            else{
                util.res(res,true,"Conversations for this user were retrieved",convos)
            }
        })
        
    }
    else{
        util.res(res,false,"You're not logged in")
    }
})

//send message to a chat
router.post('/',(req,res,next)=>{
    if(util.isLoggedIn(req)){
        Conversation.findById(req.body.dialog,(err,dialog)=>{
            if(err||!dialog){
                util.resError(res,err)
            }
            else{
                dialog.messageHistory.push(
                    {
                        text:req.body.message,
                        sender:JSON.parse(req.headers.loggeduser).id,
                        time:new Date()
                    }
                )
                dialog.save((err,d)=>{
                    if(err){
                        util.resError(res,err)
                    }
                    else{
                        util.res(res,true,"Message was sent",d)
                    }
                })
            }
        })
    }   
     else{
        util.res(res,false,"You're not logged in")
    }
})

router.get('/:id',(req,res,next)=>{
    Conversation.findById(req.params.id,(err,dialog)=>{

        if(err){
            util.resError(res,err)
        }
        else{
            util.res(res,true,"Messages were rerieved(from api)",dialog.messageHistory)
        }
    })
})







module.exports=router;