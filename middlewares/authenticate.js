const jwt = require('jsonwebtoken');
    require('dotenv').config();
const key= process.env.key
const refkey= process.env.refkey
const fs = require('fs');

const authenticate = async (req, res, next)=> {
        const token = req.headers.authorization;
    if(token){
        const blacklist =await JSON.parse(fs.readFileSync("./blacklist.json", "utf8"));
        if(blacklist.includes(token)){
            res.send("Please login");
        }else{
            try {
                jwt.verify(token, key, (err, decoded)=> {
                    if(err) res.send({"msg":err.message});
                const {userid,role} = decoded; 
                req.body.userid = userid;
                req.body.role = role;
                next();
                });
            }catch (error) {
                res.ssend({"msg":"Please login","error":error.message});
            }
        }
    }else{
        res.send("Please login");
    }
}

module.exports ={
    authenticate
}