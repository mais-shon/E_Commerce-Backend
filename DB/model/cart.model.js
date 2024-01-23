import mongoose,{Types,model,Schema} from 'mongoose';
const cartSchema=new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productId:{type:Types.ObjectId,ref:'User',required:true},
        productColorSize:{type:Types.ObjectId,ref:'Product_Color_SizeModel.products',required:true},
        productName:{type:String, required:true},
        qty:{type:Number,default:1},
        color:{ type:String,required:true},
        size:{type:String,required:true},
        stockholder:{type:Types.ObjectId,ref:'User',required:true},
        _id:false
    }]
},
{
    timestamps:true
});
const cartModel = mongoose.models.Cart ||  model('Cart', cartSchema);
export default cartModel;