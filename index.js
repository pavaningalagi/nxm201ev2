const express = require('express');

const app = express();
app.use(express.json());
require('dotenv').config();
const PORT= process.env.PORT
const {connection} = require('./configs/db');
const {userRoute} = require('./routes/userRoute');
const {authenticate} = require("./middlewares/authenticate");
const {authorization} = require("./middlewares/authorization");
app.get("/", (req,res)=>{
    res.send("welcome to evaluvation")
});

app.use("/users",userRoute);

app.get("/goldrate",authenticate,(req,res)=>{
    res.send("welcome to goldrate")
});

app.get("/userstats",authenticate,authorization(['manager']),(req,res)=>{
    res.send("welcome to userstats")
});

app.listen(PORT,async()=>{
try {
    await connection;
    console.log("connection established wiht DB")
    } 
catch (error) {
    console.log(error);
    }
console.log(`server is running on port ${PORT}`)
});