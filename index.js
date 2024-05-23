const express=require('express');
const ejs=require("ejs");
const bodyParser=require("body-parser");
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const mongoose=require("mongoose");
const app=express();
const User=require('./schema/user');
const Record=require('./schema/record');

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public')); // setting the folder name (public) where all the static files like css, js, images etc are made available
app.set('view engine','ejs');

const SECRET_KEY=process.env.SECRET_KEY;



checkjwt=(req,res,next)=>{

  try
  {
  console.log(req.headers);
  const token=req.headers.authorization.split(' ')[1];
  console.log(token);
  req.token=token;
  next();
  }
  catch(err)
  {
    console.log(err);
  }
}





mongoose.connect("mongodb+srv://kanchireddyvarshith:8jDuXZL3cwv7iTfZ@cluster0.ijyfzbp.mongodb.net/test").then(()=>{
  console.log("connected to database");
})
.catch((err)=>{
  console.log(err);
})


app.get('/',function(req,res){
  res.render('home');
});


app.post('/login',async function(req,res){
   
   try{
    const { username,password }=req.body;
    const consumer=await User.findOne({username:username}).exec()
    if(!consumer)
    {
        res.send("USER NOT FOUND");
    }
    if(consumer&&consumer.password===password)
    {
        const token =jwt.sign({username:consumer.username},SECRET_KEY);
        res.cookie('token', token);
        res.render('addexpenses');
    }
  }
  catch(err)
  {
     console.log(err);
  }
  
})

app.get('/signup',function(req,res){
    // const id=req.query.id;
    // console.log(id);
    // const token=jwt.sign({id:id},SECRET_KEY);
    // console.log(token);
    // res.send(token);
    res.render('signup')
    
})

app.post('/register',async function(req,res){

  const { username,password }=req.body;

  const consumer= await User.create({
     username:username,
     password:password
  });
  
  res.render('home');

})

app.post('/addexpense',checkjwt,async function(req,res){
  console.log(req.body);
  const token=req.token;
  const decodedvalue=jwt.verify(token,SECRET_KEY);
  console.log(decodedvalue);
  const { expenseName,expenseDate,expenseAmount,expenseType }=req.body;
   const record=await Record.create({
         username:decodedvalue.username,
         expenseName,
         expenseAmount,
         expenseDate,
         expenseType

   });
   console.log(record);
   res.json(record);
})

app.get('/expenselist',function(req,res)
{
  res.render('expenses');
});

app.post('/allexpenses',checkjwt,async function(req,res){
const token=req.token;
console.log(token);
const decodedvalue=jwt.verify(token,SECRET_KEY);
console.log(decodedvalue);
const records=await Record.find({username:decodedvalue.username}).exec();
console.log(records);
res.json(records);
});

app.post('/filter',checkjwt,async function(req,res){
  
const { filter }=req.body;
const token=req.token;
console.log(token);
const decodedvalue=jwt.verify(token,SECRET_KEY);
console.log(decodedvalue);
const records=await Record.find({username:decodedvalue.username}).exec();
console.log(records);

if(filter==="lastweek")
  {
    let today=new Date();
    let lastweekDate= new Date(today.getTime()-7*24*60*60*1000);
    today=today.toISOString().split('T')[0];
    lastweekDate=lastweekDate.toISOString().split('T')[0];
    const final=[];
    for(let i=0;i<records.length;i++)
      {
        let expenseDate = new Date(records[i].expenseDate).toISOString().split('T')[0]
        if(today>=expenseDate&&expenseDate>=lastweekDate)
          {
             final.push(records[i]);
          }
      }
    res.json(final);
  }
else if(filter==="lastmonth")
  {
  let today=new Date();
  let lastweekDate= new Date(today.getTime()-30*24*60*60*1000);
  today=today.toISOString().split('T')[0];
  lastweekDate=lastweekDate.toISOString().split('T')[0];
  const final=[];
  for(let i=0;i<records.length;i++)
  {
    let expenseDate = new Date(records[i].expenseDate).toISOString().split('T')[0]
    if(today>=expenseDate&&expenseDate>=lastweekDate)
      {
         final.push(records[i]);
      }
  }
  res.json(final);
}
else if(filter==="lastthreemonths")
  {
    let today=new Date();
    let lastweekDate= new Date(today.getTime()-3*30*24*60*60*1000);
    today=today.toISOString().split('T')[0];
    lastweekDate=lastweekDate.toISOString().split('T')[0];
    const final=[];
    for(let i=0;i<records.length;i++)
    {
      let expenseDate = new Date(records[i].expenseDate).toISOString().split('T')[0]
      if(today>=expenseDate&&expenseDate>=lastweekDate)
        {
           final.push(records[i]);
        }
    }
    res.json(final);
  }
 else
 {
   res.json(records);
 }

});

app.listen(3000,()=>{
    console.log("server started at port 3000");
});

