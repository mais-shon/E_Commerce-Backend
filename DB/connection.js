import mongoose from "mongoose";
const connectDB =()=>{
    return mongoose.connect(process.env.DB_LOCAL);
}

export default connectDB
