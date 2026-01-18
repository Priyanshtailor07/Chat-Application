import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database online ${conn.connection.host}`)
    }
    catch(error){
        console.log(`connection error ${error.message}`);
        process.exit(1);
    }



};
export default connectDB;