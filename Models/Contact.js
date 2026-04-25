const mongoose=require('mongoose')
const ContactSchema=mongoose.Schema({
    fullname:{type:String,require:true},
    phone:{type:Number,require:true},
    gender:{type:String,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    imgId:{type:String},
    imgUrl:{type:String}
})
module.exports=mongoose.model('Contact',ContactSchema)