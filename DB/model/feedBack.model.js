import mongoose,{Types,model,Schema} from 'mongoose';
const feedBackSchema=new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    productId:{
        type:Types.ObjectId,
        ref:'Product',
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    orderId:{
        type:Types.ObjectId,
        ref:'Order',
        required:true
    }},{
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
feedBackSchema.virtual('feedback', {
    localField: "userId",
    foreignField: "_id",
    ref: "User"});
const feedBackModel = mongoose.models.feedBack ||  model('feedBack', feedBackSchema);
export default feedBackModel;