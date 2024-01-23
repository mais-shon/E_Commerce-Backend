import productModel from "../../../../DB/model/product.model.js";
import Product_Color_SizeModel from "../../../../DB/model/Product_Color_Size.model.js";
import { blockModel } from "../../../../DB/model/block.model.js";
import cartModel from "../../../../DB/model/cart.model.js";
import userModel from "../../../../DB/model/User.model.js";

export const addToCart = async (req, res, next) => {
    const {  qty, color, size } = req.body;
    const { productId}=req.params;
    // check if admin make customer in active
    if (!await userModel.findOne({ _id: req.user._id, status: 'active' })) {
        return next(new Error(`invalid operation `));
    }
    const checkProduct = await productModel.findOne({ _id: productId, deletedAt: false });
    if (!checkProduct) {
        return next(new Error(`Product Not Found`, { cause: 404 }));
    }
    // check if stock block customer
    if (await blockModel.findOne({ customerId: req.user._id, stockholderId: checkProduct.createdBy })) {
        return next(new Error('you can not order from this stock'));
    }
    let product = {};
    const products = await Product_Color_SizeModel.findOne({ productId, "products.color": color, "products.size": size }).select('products _id');
    for (var i = 0; i < products.products.length; i++) {
        if (products.products[i].color == color && products.products[i].size == size) {
            product = products.products[i];
            break;
        }
    }
    if (product.qut < qty) {
        return next(new Error(` invalid quentity`));
    }
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        const newCart = await cartModel.create({ userId: req.user._id, products: [{ productId, qty, color, size, productName: checkProduct.name, productColorSize: product._id, stockholder: checkProduct.createdBy }] });
        return res.status(201).json({ message: "success", newCart });
    }
    let matchProduct = false;
    for (var i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId.toString() == productId && cart.products[i].color == color && cart.products[i].size == size) {
            cart.products[i].qty = parseInt(qty);
            matchProduct = true;
            break;
        }
    }
    if (!matchProduct) {
        cart.products.push({ productId, productName: checkProduct.name, qty, color, size, productColorSize: product._id, stockholder: checkProduct.createdBy });
    }
    await cart.save();
    return res.json({ message: "success", cart });
}
export const removeProductFromCart = async (req, res, next) => {
    const { productId, color, size } = req.body;
    const cart = await cartModel.findOneAndUpdate({ userId: req.user._id }, { $pull: { products: { productId, color, size } } },{new:true});
    return res.json({ message: "success", cart });
}
export const clearCart = async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate({ userId: req.user._id }, { products: [] }, { new: true });
    return res.json({ message: "success", cart });
}
export const getCart = async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        return next(new Error(`no cart created yet`, { cause: 404 }));
    }
    return res.json({ message: `success`, cart });
}
