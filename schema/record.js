const mongoose=require("mongoose");
const { model,Schema }=mongoose;

const recordschema=new Schema({
    username:{
        type:String,
        required:true
    },
   expenseName:{
    type:String,
    required:true
   },
   expenseAmount:{
    type: Number,
    required:true
   },
   expenseDate:{
    type:Date,
    required:true
   },
   expenseType:{
    type:String,
    required:true
   }
});

const Record=model('Record',recordschema);

module.exports = Record; 