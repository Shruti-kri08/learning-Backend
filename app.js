require('dotenv').config();
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')


 //Routes
const userRoutes=require('./Routes/user')
const contactRoutes=require('./Routes/contact')


 //Connect with database
 const connectWithDatabase= async()=>{
      try{
             await  mongoose.connect(process.env.MONGODB_URL)
        console.log("connect with database");
        
      }
      catch(err){
        console.log("something is wrong");
        
        console.log(err);
        
      }

 }

 connectWithDatabase()

//use body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())


//Use Routes
app.use('/user',userRoutes)
app.use('/contact',contactRoutes)



module.exports=app