var util={
res:function(res,success,mess,data){
    res.json({
        success:success,
        message:mess,
        docs:data
    })
},
resError:function(res,err){
    res.json({
        success:false,
        message:err
    })
},
isLoggedIn:function(req){
    if(req.headers.loggeduser){
      return true
    }
    else return false
}


}

module.exports=util;