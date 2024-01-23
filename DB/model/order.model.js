import mongoose, { Types, model, Schema } from 'mongoose';
const orderSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
        stockholder: { type: Types.ObjectId, ref: 'User', required: true },
        mainImage:{type:Object,required:true},
        _id: false
    }],
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    note: String,
    status: {
        type: String,
        enum: ['pending', 'onWay', 'delivered', 'canceled','approved'],
        default: 'pending'
    }
},
    {
        timestamps: true
    })

const orderModel = mongoose.models.Order || model('order', orderSchema);
export default orderModel;