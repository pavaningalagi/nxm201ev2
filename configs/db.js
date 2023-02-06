const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();
const db= process.env.mongoDB
const connection = mongoose.connect(db);


module.exports={
    connection
}