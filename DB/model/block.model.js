import mongoose, { Schema, Types,model } from "mongoose";
const blockSchema = new Schema({
    customerId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    stockholderId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
});
export const blockModel = mongoose.models.Block || model('Block',blockSchema);
