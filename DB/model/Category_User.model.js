import mongoose, { Types, model, Schema } from 'mongoose';
const Category_UserSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  categoryId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Category'
  }
},
  {
    timestamps: true
  });
const Category_UserModel = mongoose.models.Category_User || model('Category_User', Category_UserSchema);
export default Category_UserModel;