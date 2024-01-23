import productModel from "../../../../DB/model/product.model.js";
import feedBackModel from "../../../../DB/model/feedBack.model.js";
import orderModel from "../../../../DB/model/order.model.js";

export const createFeedback = async (req, res, next) => {
    const { comment, rating } = req.body;
    const { productId } = req.params;
    const checkProduct = await productModel.findById(productId);
    if (!checkProduct) {
        return next(new Error(`product not found`));
    }
    const order = await orderModel.findOne({ userId: req.user._id, "products.productId": productId });
    if (!order || order.status != 'delivered') {
        return next(new Error(`we cann't review before delivered the product`, { cause: 400 }));
    }
    if (await feedBackModel.findOne({ userId: req.user._id, productId })) {
        return next(new Error(`you already review`, { cause: 400 }));
    }
    const feedBack = await feedBackModel.create({ userId: req.user._id, comment, rating, productId, orderId: order._id });
    return res.json({ message: "success", feedBack });
}
export const updateFeedback = async (req, res, next) => {
    const { feddbackId } = req.params;
    const preFeedback = await feedBackModel.findById(feddbackId);
    if (!preFeedback) {
        return next(new Error('feedback not found', { cause: 400 }));
    }
    const checkProduct = await productModel.findById(preFeedback.productId);
    if (!checkProduct) {
        return next(new Error(`product not found`));
    }
    const feedBack = await feedBackModel.updateOne(req.body);
    return res.json({ message: "success", feedBack });
}
export const showfeedBack = async (req, res, next) => {
        const { productId } = req.params;
        const feedback = await feedBackModel.find({productId}).populate('feedback');
        if (!feedback || feedback.length === 0) {
            return res.json({ message: "No feedback yet for this product" });
        }
        return res.json({ message: "Success", feedback });
    
}
