import mongoose, { Schema, Types, model } from "mongoose";
const productReportSchema =new Schema({
    productId:{
        type:Types.ObjectId,
        required:true,
        ref:'Product'
    },
    customerId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    note:{
        type:String,
        required:true
    },
    stockholderId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    }
},{timestamps:true});
export const productReportModel = mongoose.models.ProductReport || model('ProductReport',productReportSchema);