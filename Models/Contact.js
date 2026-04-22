const mongoose=require('mongoose')
const ContactSchema=mongoose.Schema({
    fullname:{type:String,require:true},
    phone:{type:Number,require:true},
    gender:{type:String,required:true},
    userId:{type:String,required:true},
    image:{type:String,required:true},
    url:{type:String,required:true}
})
module.exports=mongoose.model('Contact',ContactSchema)