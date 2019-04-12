const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var fs=require('fs');
var Conversation=require('./conversation')

var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
  };

  const userSchema=mongoose.Schema({
      name:String,
      email:String,
      password:String,
      role:Number,
      conversations:[{ type: Schema.Types.ObjectId, ref: 'Conversation' }]
  },schemaOptions)


userSchema.statics.new=function(newUser,callback){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          if(err){
              callback(err,null);
          }
          else{
              newUser.password=hash;
              newUser.save((err,user)=>{
                  callback(err,user)
              })
          }
        });
    });
}



userSchema.statics.login=function (_email,pass,callback){

    return this.findOne({email:_email}).exec((err,user)=>{
        if(err||!user){
            callback(err,null);
        }
        else{
            bcrypt.compare(pass, user.password, function(err, res) {
                if(err || !res) callback(err,null)
                
                else if (res) {
                    user=user.toObject()
                    delete user.password;
                    callback(err, user);
                }
            });
        }
    })
}

  module.exports=mongoose.model("User",userSchema)

