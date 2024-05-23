const mongoose=require("mongoose");
const { model,Schema }=mongoose;

const userschema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const User=model('User',userschema);

module.exports = User; 