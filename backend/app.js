const express=require('express');
var mongoose = require("mongoose");
const app=express();
const bodyParser = require('body-parser');
var cors = require('cors');
const loginRoute=require("./routes/login")
const userRoute=require('./routes/users')
const conversationRoute=require('./routes/conversations')
const path = require('path');
const Conversation=require('./models/conversation')
const Log = require('./models/log')
const _=require('underscore')

app.use(cors());

mongoose.connect("mongodb://admin:admin1@ds255784.mlab.com:55784/my-chat")
    .then(_=>{
        console.log("Connected to db");
    })
    .catch(err=>{
        console.log(`Connection error ${err.message}`)
    });

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers',
            'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept', 'user');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            
        next();
      });
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));



    app.use("/api/login",loginRoute);
    app.use("/api/users",userRoute)
    app.use("/api/dialogs",conversationRoute);

    app.use(express.static(path.join(__dirname,'build')))
    // app.get('*',(req,res)=>{
    //     res.sendFile(path.join(__dirname,'build/index.html'))
    // })

    app.get('/api/history',(req,res,next)=>{

        Conversation.find().exec((err,dialogs)=>{
    
            if(err){
                res.json(res,err)
            }
            else{
                var result=_.pluck(dialogs,'messageHistory')[0]
                result.map(el=>{
                    el.sender=el.sender.id
                })
                res.json({data:result})
            }
        })
    })

    app.post('/api/roomhistory',(req,res,next)=>{

        Conversation.findById(req.body.room,(err,dialog)=>{
            if(err){

                res.json({success:false,data:err})
            }
            else{
                var result=dialog.messageHistory
                result.map(el=>{
                    el.sender=el.sender.id
                })
                res.json({success:true,data:result})
            }
        })
    })

    app.get('/api/eventlog',(req,res,next)=>{
        Log.find({},(err,log)=>{
            if(err){
                res.json(err)
            }
            else{
                res.json({data:log})
            }
        })

    })

    app.get('/api/rooms',(req,res,next)=>{
        Conversation.find().exec((err,convos)=>{

            if(err){
                res.json({success:false,data:err})
            }
            else{
                console.log(convos[0].messageHistory[convos[0].messageHistory.length-1].time)
                
                res.json({data:convos.map(conv=>{
                    data={}
                    data.id=conv.id
                    data.name=conv.name
                    data.lastMessage=conv.messageHistory.length?conv.messageHistory[conv.messageHistory.length-1].time:"Empty"
                    data['Date of Creation']=conv.dateOfCreation
                    data['Participants']=conv.members[0].name+' '+conv.members[1].name
                    return data
                })})

            }
        })
    })

    module.exports=app;
