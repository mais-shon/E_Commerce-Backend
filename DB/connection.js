import mongoose from "mongoose";
const connectDB =()=>{
    return mongoose.connect(process.env.Local_DB);
}

export default connectDB
