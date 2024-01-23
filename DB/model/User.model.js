
import mongoose, { Schema, Types, model } from 'mongoose';
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Guest', 'Admin', 'Customer', 'stakeHolder'],
        default: 'Guest',
        required: true,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'not active']
    },
    address: {
        type: String,
    },
    phone: {
        type: String
    },
    forgetCode: {
        type: String,
        default: null
    },
    Bio: {
        type: String,
        default: function () {
            if (this.role === 'stakeHolder') {
                const userAddress = this.address;
                const userPhone = this.phone;
                return `Welcome, . Our address is ${userAddress}, and you can contact us using this number ${userPhone}.`;
            } else {
                return undefined; // Set to undefined for other roles to avoid storing a default bio
            }
        },
    },
    changePasswordTime: {
        type: Date,
    },
    categoryName: {
        type: String,
        ref: 'Category'
    },
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category'
    },
    profilePic: {
        type: Object,
    },
    wishList: [{
        type: Types.ObjectId,
        ref: 'Product',
    }]
},
    {
        timestamps: true,
        
    });
   
const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;


