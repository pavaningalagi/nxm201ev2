const authorization = (roleArray) =>{
    return (req,res,next)=>{
        const role = req.body.role;
        if(roleArray.includes(role)){
            next();
    }else{
        res.send({"msg":"not authorized"});
    }
}
}

module.exports = {
    authorization
}