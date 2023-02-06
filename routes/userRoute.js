const express = require('express');
const {userModel} = require("../models/userModel");
const userRoute = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const key= process.env.key
const refkey= process.env.refkey
const fs = require('fs');


userRoute.get("/",(req,res)=>{
    res.send("welome to user route")
});

userRoute.post("/signup",async(req,res)=>{
    try {
      const {name,email,password,role} = req.body;
      const extuser = await userModel.findOne({email:email});
      if(extuser){
        res.send({"msg":"user already present please login"});
      }else{
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds,async (err, hash) =>{
            if (err) res,send({"msg":err.message});
            const user = new userModel({name,email,password:hash,role});
            await user.save();
            res.send({"msg":`Signup successful ${name}`});
        });
      }
    } catch (error) {
        res.send({"msg":"Invald credentials",
                    "error":error.message});
    }
});

userRoute.post("/login",async(req,res)=>{
    try {
    const {email,password} = req.body;
      const extuser = await userModel.findOne({email:email});
      if(!extuser){
        res.send({"msg":"Invalid credentials"});
      }else{
        bcrypt.compare(password, extuser.password, (err, result) =>{
            if (err) res,send({"msg":err.message});
            if(result){
                const token = jwt.sign({ userId:extuser._id, role:extuser.role }, key, { expiresIn: 60 });
                const reftoken = jwt.sign({ userId:extuser._id, role:extuser.role }, refkey, { expiresIn: 300 });
                res.send({"msg":`login successful ${extuser.name}`,
                            "token":token,
                            "refreshtoken":reftoken
                        });
            };
        });
      }
    } catch (error) {
        res.send({"msg":"Invald credentials",
                    "error":error.message});
    }
});

userRoute.get("/logout",async(req,res)=>{
    const token = req.headers.authorization;
    try {
        console.log(token);
        if(token){
           const blacklist =await JSON.parse(fs.readFileSync("../blacklist.json", "utf8"));
            blacklist.push(token);
        //    console.log(data);
           fs.writeFileSync('./blacklist.json',JSON.stringify(blacklist));
            // console.log(blacklist);
            res.send({"msg":"logout successful"});
        }else{
            res.send("Please login");
        }
    } catch (error) {
        res.send({"msg":"Invald credentials",
                    "error":error.message});
    }
});


module.exports = {
    userRoute
}