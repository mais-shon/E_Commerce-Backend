import mongoose, {Schema,Types,model} from 'mongoose';
const categorySchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
        enum:['Clothes','Shoes','Men fashion','Bags','Accessories','Home furniture and accessories','Kids','Electronics','Educational needs','Other']
    },
    slug:{
        type:String,
        required:true,
    },
},
{
    timestamps:true
});
const categoryModel = mongoose.models.Category ||  model('Category', categorySchema);
export default categoryModel;