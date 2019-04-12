const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var fs=require('fs');
const Conversation=require('./conversation')
var User=require('./user')

var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
  };

const messageSchema=mongoose.Schema({
    text:String,
    sender:{ type: Schema.Types.ObjectId, ref: 'User' },
    time:Date

    

},schemaOptions)

module.exports=mongoose.model("Message",messageSchema)