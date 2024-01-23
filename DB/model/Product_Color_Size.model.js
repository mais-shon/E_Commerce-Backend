
import mongoose,{Types,model,Schema} from 'mongoose';
const Product_Color_SizeSchema=new Schema({
    productId:{
        type:Types.ObjectId,
        required:true,
        ref:'Product'}
    ,//
    products:[{
        qut:{type:Number,required:true,default:1},
        color:{ type:String,default:"One Color"},
        size:{ type:String,
            enum:['M','L','XL','XXL','S','One Size' ,'34','35','36','37', '38','39','40','41','42','43','44','One Size','Standard'],
            default:"One Size", required:true
        },
    }],
},
{
    timestamps:true
});
const  Product_Color_SizeModel = mongoose.models.Product_Color_SizeModel ||  model(' Product_Color_Size', Product_Color_SizeSchema);
export default  Product_Color_SizeModel;