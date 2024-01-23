import mongoose, { Schema,model,Types } from "mongoose";
const reportSchema = new Schema({
    customerId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    stockholderId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    note:{
        type:String,
        required:true
    },
},
    {timestamps:true});
export const reportModel = mongoose.models.Report || model('Report',reportSchema);
