import productModel from "../../../../DB/model/product.model.js";
import Product_Color_SizeModel from "../../../../DB/model/Product_Color_Size.model.js";
import { blockModel } from "../../../../DB/model/block.model.js";
import cartModel from "../../../../DB/model/cart.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import userModel from "../../../../DB/model/User.model.js";

/*export const createOrder=async (req,res,next)=>{
    let{products,phoneNumber,address,note}=req.body;
    let finalPrice = 0;
    let productIdList =[];
    for(let product of products){
        const checkProduct = await productModel.findOne({_id:product.productId,deletedAt:false});
        if(!checkProduct){
            return next(new Error(`product not found`));
        }
        const validateProduct = await Product_Color_SizeModel.findOne({productId:product.productId,"products.color":product.color,"products.size":product.size});
        if(!validateProduct){
            return next(new Error(`invalid product color ${product.color}  or size ${product.size}`,{cause:400}));
        }
        let lessQuentity = false;
        let result =validateProduct.products.map((ele=>{
            if(ele.color == product.color && ele.size==product.size){
                if(ele.qut < product.qty){
                    lessQuentity=true;
                }else{
                    productIdList.push(ele._id);
                    product.productColorSize=ele._id;
                }
            }
        }));
        if(lessQuentity){
            return next(new Error(`invalid product quntity of ${product.productId}`,{cause:400}));
        }
        const productData =await productModel.findById(product.productId);
        product.productName=checkProduct.name;
        product.unitPrice = checkProduct.finalPrice;
        product.finalPrice=product.qty * product.unitPrice;
        finalPrice += product.finalPrice;
    }
    const order = await orderModel.create({
        products,
        phoneNumber,
        address,
        note,
        finalPrice,
        userId:req.user._id
    });
    for(const product of products){
        const productInfo=await Product_Color_SizeModel.findOne({productId:product.productId,"products.color":product.color,"products.size":product.size}).select('products');
        let result =productInfo.products.map((ele=>{
            if(ele.color == product.color && ele.size==product.size){
                ele.qut = ele.qut - product.qty;
            }
        }));
        await productInfo.save();
    }
    const cart = await cartModel.findOneAndUpdate({userId:req.user._id,},{$pull:{products:{productColorSize:{$in:productIdList}}}});
    return res.json({message:"success",order});
}*/
export const addAllFromCart = async (req, res, next) => {
    let { phoneNumber, address, note } = req.body;
    if (! await userModel.findOne({ _id: req.user._id, status: 'active' })) {
        return next(new Error(`invalid operation`));
    }
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart?.products?.length) {
        return next(new Error(`empty cart`, { cause: 400 }));
    }
    let products = cart.products.toObject();
    let finalPrice = 0;
    let productIdList = [];
    for (let product of products) {
        const checkProduct = await productModel.findOne({ _id: product.productId, deletedAt: false });
        if (!checkProduct) {
            return next(new Error('product not found', { cause: 404 }));
        }
        if (await blockModel.findOne({ customerId: req.user._id, stockholderId: checkProduct.createdBy })) {
            return next(new Error('you can not order from this stock'));
        }
        let productColorSize = await Product_Color_SizeModel.findOne({ "products._id": product.productColorSize, productId: product.productId });
        if (!productColorSize) {
            return next(new Error(`invalid product color or size`));
        }
        let lessQuentity = false;
        let result = productColorSize.products.map((ele => {
            if ((ele._id).equals(product.productColorSize)) {
                if (ele.qut < product.qty) {
                    lessQuentity = true;
                } else {
                    productIdList.push(ele._id);
                    product.productColorSize = ele._id;
                }
            }
        }));
        if (lessQuentity) {
            return next(new Error(`invalid product quntity of ${product.productId}`, { cause: 400 }));
        }
        product.productName = checkProduct.name;
        product.unitPrice = checkProduct.finalPrice;
        product.finalPrice = product.qty * product.unitPrice;
        product.mainImage=checkProduct.mainImage
        finalPrice += product.finalPrice;
    }
    const order = await orderModel.create({
        products,
        phoneNumber,
        address,
        note,
        finalPrice,
        userId: req.user._id
    });
    for (const product of products) {
        const productInfo = await Product_Color_SizeModel.findOne({ productId: product.productId, "products._id": product.productColorSize }).select('products');
        let result = productInfo.products.map((ele => {
            if ((ele._id).equals(product.productColorSize)) {
                ele.qut = ele.qut - product.qty;
            }
        }));
        await productInfo.save();
    }
    const cartUpdated = await cartModel.findOneAndUpdate({ userId: req.user._id, }, { products: [] });
    return res.json({ message: "success", order });
}
export const changeStatus = async (req, res, next) => {
    const { status } = req.body;
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order || order.status == 'delivered') {
        return next(new Error(`cann't change order's status`, { cause: 400 }));
    }
    if (order.status == status) {
        return next(new Error(`old status match new one`));
    }
    order.status = status;
    await order.save();
    return res.json({ message: "success" });
}
export const getOrderForSpecificStock = async (req, res, next) => {
    const orders = await orderModel.find({ "products.stockholder": req.user._id });
    if (!orders) {
        return next(new Error(`no orders found`));
    }
    let stockOrders = [];
    for (let order of orders) {
        for (let i = 0; i < order.products.length; i++) {
            if (order.products[i].stockholder.equals(req.user._id)) {
                stockOrders.push({orderId:order._id, product: order.products[i], userId: order.userId, phoneNumber: order.phoneNumber, address: order.address, note: order.note,status:order.status });
            }
        }
    }
    return res.json({ orders: stockOrders });
}
export const cancelOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
        return next(new Error(`order not found`));
    }
    if (order.status !== "pending") {
        return next(new Error(`you can not cancle the order after stock accepted it`));
    }
    order.status = "canceled";
    await order.save();
    return res.json({ message: "success" });
}
export const getCustomerOrders = async(req,res,next)=>{
    const order = await orderModel.find({userId:req.user._id});
    if(!order){
        return next(new Error(`no orders found`));
    }
    return res.json({message:"success",order});
}
