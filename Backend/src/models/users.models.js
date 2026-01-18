    import mongoose from "mongoose";

    const userSchema=new mongoose.Schema({
        username:{
            type:String,
            required: true,
            unique:true,
            index:true
        },
        email :{
            type:String,
            required: true,
            unique:true,
            index:true
        },
        password:{
            type:String,
            required: true,
            },
            avatar:{
                type:String,
                default:""// i am going to add it
            },
            bio:{
                type:String,
                default:"Hey I am using "
            },

            isOnline:{
                type:Boolean,
                default:false
            },
            lastSeen:{
                type:Date,
                default:Date.now
            }
            },{timestamps:true}
        );
        

        export const User =mongoose.model("User",userSchema)