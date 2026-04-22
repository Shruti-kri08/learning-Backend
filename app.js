require('dotenv').config();
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cloudinary=require('cloudinary').v2
const fileUpload=require('express-fileupload')          //It helps to recive file(img,vedio file) form frontend.....




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
app.use(fileUpload({
    useTempFiles:true,         //store files for temperory in backend 
    tempFileDir:'/temp/'
}))


//Use Routes
app.use('/user',userRoutes)
app.use('/contact',contactRoutes)


module.exports=app