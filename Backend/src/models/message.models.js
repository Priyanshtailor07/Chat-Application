import mongoose, { trusted } from "mongoose";

const messageSchema=new mongoose.Schema({
    // sender 
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
     chat:{
        type:mongoose.Schema.Types.ObjectId, ref:"Chat",
        required:true
     },
     content:{
        type:String,
        trim:true
     },
     /// for multimedia
     type:{
        type:String,
        enum:["text","image","video","audio"],
        default:"text",
        
     },
     // type url for cloudinary  
     fileUrl:{type:String},

     status:{
        type:String,
        enum:["sent","delivered"],
        default:"sent",
     },
        // for group receiver is array
     readBy:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
     }],

     // for ai feature (in future)
     isAiCorrected:{
        type:Boolean,
        default:false
     },
     // stoing original if ai corrected
     originalContent:{
        type:String
     },
     

},{timestamps:true})

export const Message =mongoose.model("Message",messageSchema)