const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
const _=require('underscore')
var fs=require('fs');
const User=require('./user')
const Message=require('./message');

var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
  };

const logSchema=mongoose.Schema({
    type:String,
    message:String,
    sender:String,
    time: { type: Date, default: Date.now() }
},schemaOptions);

logSchema.statics.newRecord=function(type,message,sender,callback){
    var record= this({
        type:type,
        message:message,
        sender:sender
    })
    record.save((err,doc)=>{
        if(err)
        callback(err,null)
        else callback(err,doc)
    })
}

module.exports=mongoose.model("Log",logSchema)