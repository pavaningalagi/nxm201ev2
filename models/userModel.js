const mongoose = require('mongoose');

const userSchema = ({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, default:"user"}
});

const userModel = mongoose.model('user',userSchema);


module.exports ={
    userModel
}