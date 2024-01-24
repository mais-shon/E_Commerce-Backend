import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import userModel from "../../../../DB/model/User.model.js";
import productModel from "../../../../DB/model/product.model.js";
import Product_Color_SizeModel from "../../../../DB/model/Product_Color_Size.model.js";
import { blockModel } from "../../../../DB/model/block.model.js";
//create product
export const createProduct = async (req, res, next) => {
  let { name, price, discount, description, products } = req.body;
  const check = await userModel.findOne({ _id: req.user._id, role: 'stakeHolder' });
  if (!check) {
    return next(new Error(`sorry, you cant post any product`, { cause: 400 }));
  }
  const slug = slugify(name);
  req.body.finalPrice = price - ((price * discount || 0) / 100);
  const finalPrice = req.body.finalPrice;
  const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/mainImage` });
  req.body.mainImage = { public_id, secure_url };
  const mainImage = req.body.mainImage;
  if (req.files.subImages) {
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/subImages` });
      req.body.subImages.push({ public_id, secure_url });
    }
  }
  const subImages = req.body.subImages;
  req.body.createdBy = req.user._id;
  const createdBy = req.body.createdBy;
  const newProduct = await productModel.create({ name, slug, price, discount, finalPrice, description, subImages, mainImage, createdBy });
  const productListInfo = products.map(product => ({
    size: product.size || "One Size",
    color: product.color || "One Color",
    qut: product.qut || "1",
  }));

  const Product_Color_Size = await Product_Color_SizeModel.create({ productId: newProduct._id, products: productListInfo });
  if (!newProduct || !Product_Color_Size) {
    return next(new Error("create product unsuccessfully", { cause: 400 }));
  }
  return res.status(201).json({ message: "success", newProduct });
}
//soft delete product
export const softDeleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOne({ _id: productId, deletedAt: false, createdBy: req.user._id });
  if (!product) {
    return next(new Error(`this product not fount `, { cause: 400 }));
  }
  product.deletedAt = true;
  product.save();
  return res.status(200).json({ message: "success", product });
}
//get all product
export const getProducts = async (req, res, next) => {
  let { page, size } = req.query;
  let skip = (page - 1) * size;
  if (!size || size <= 0) {
    size = 12;
  }
  if (!page || page <= 0) {
    page = 1;
  }
  const products = await productModel.find({ deletedAt: false }).limit(size).skip(skip);
  if (!products) {
    return next(new Error(`products not found `, { cause: 400 }));
  }
  return res.json({ message: 'success', products });
}
// delete product by admin 
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOne({ _id: productId });
  if (!product) {
    return next(new Error(`this product not fount `, { cause: 400 }));
  }
  await productModel.deleteOne({ _id: productId });
  await Product_Color_SizeModel.deleteOne({ productId });
  return res.status(200).json({ message: "success" });

}
//update product
export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOne({
    _id: productId,
    deletedAt: false,
    $or: [
      { createdBy: req.user._id },
      { role: 'Admin' }  // Assuming 'Admin' is the role value for an admin user
    ]
  });
  if (!product) {
    return next(new Error('this product unfound', { cause: 400 }));
  }
  const { name, price, discount, descreption } = req.body;
  if (name) {
    product.name = name;
    product.slug = slugify(name);
  }
  if (price && discount) {
    product.price = price;
    product.discount = discount;
    product.finalPrice = price - ((price * discount) / 100);
  } else if (price) {
    product.price = price;
    product.finalPrice = price - ((price * product.discount) / 100);
  } else if (discount) {
    product.discount = discount;
    product.finalPrice = product.price - ((product.price * discount) / 100);
  }
  if (descreption) {
    product.descreption = descreption;
  }
  if (req.files.mainImage && req.files.mainImage.length) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/mainImage` });
    // Destroy the existing main image on Cloudinary
    await cloudinary.uploader.destroy(product.mainImage.public_id);
    // Update the product's main image information
    product.mainImage.public_id = public_id;
    product.mainImage.secure_url = secure_url;
  }
  if (req.files.subImages && req.files.subImages.length) {
    // Destroy the existing sub-images on Cloudinary
    for (const existingSubImage of product.subImages) {
      await cloudinary.uploader.destroy(existingSubImage.public_id);
    }
    const subImages = [];
    for (const file of req.files.subImages) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/subImages` });
      subImages.push({ public_id, secure_url });
    }
    for (const existingSubImage of product.subImages) {
      await cloudinary.uploader.destroy(existingSubImage.public_id);
    }
    product.subImages = subImages;
  }
  // Update the product's subImages information
  product.updateBy = req.user._id
  const newProduct = await product.save();
  if (!newProduct) {
    return next(new Error("update product uncompleted", { cause: 400 }));
  }
  return res.json({ message: "success", product });
}
//update quntity
export const color_size_qutupdate = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOne({
    _id: productId,
    deletedAt: false,
    $or: [
      { createdBy: req.user._id },
      { role: 'Admin' } // Assuming 'Admin' is the role value for an admin user
    ]
  });
  if (!product) {
    return next(new Error('This product was not found', { cause: 400 }));
  }
  const { products } = req.body;
  if (products) {
    const existingInfo = await Product_Color_SizeModel.findOne({ productId });
    if (!existingInfo) {
      return res.status(404).json({ message: 'Product information not found' });
    }
    const updatedInfo = await Product_Color_SizeModel.findOneAndReplace(
      { productId },
      { products },
      { returnDocument: 'after' }
    );
    // Return success message after successfully updating information
    return res.json({ message: 'Success', updatedInfo });
  }
  else {
    return next(new Error(`aorry you cant update inforamtion `, { cause: 400 }));
  }
}
//get products for specific Store category -> stockholder -> products
export const getProductsForSpecificStore = async (req, res, next) => {
  const { stockholderId } = req.params;
  const products = await productModel.find({ createdBy: stockholderId });
  if (products.length == 0) {
    return next(new Error(`No Products found`));
  }
  return res.json({ message: "success", products });
}
export const addToWishList = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const product = await productModel.findOne({ _id: productId, deletedAt: false });
  if (!product) {
    return next(new Error(`product Not found`, { cause: 404 }));
  }
  const wishList = await userModel.findOne({ _id: userId, status: 'active', wishList: { $in: productId } });
  if (wishList) {
    return next(new Error(`product already on wishlist`));
  }
  const user = await userModel.findOneAndUpdate({ _id: userId, status: 'active' }, { $push: { wishList: productId } });
  return res.json({ message: "success" });
}
export const removeFromWishlist = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const product = await productModel.findOne({ _id: productId, deletedAt: false });
  if (!product) {
    return next(new Error(`product Not found`, { cause: 404 }));
  }
  const wishList = await userModel.findOne({ _id: userId, status: 'active', wishList: { $in: productId } });
  if (!wishList) {
    return next(new Error(`product not found  on wishlist`));
  }
  const user = await userModel.findOneAndUpdate({ _id: userId, status: 'active' }, { $pull: { wishList: productId } });
  return res.json({ message: "success" });
}
export const getWishList = async (req, res, next) => {
  const userId = req.user._id;
  const products = await userModel.findById(userId).select('wishList -_id');
  const wishList = [];
  for (var i = 0; i < products.wishList.length; i++) {
    const product = await productModel.findOne({ _id: products.wishList[i], deletedAt: false });
    wishList.push(product);
  }
  return res.json({ message: "success", wishList });
}
export const likeProduct = async (req, res, next) => {
  const id = req.user._id;
  if (!await userModel.findOne({ _id: id, status: 'active', role: 'Customer' })) {
    return next(new Error(`not active account`));
  }
  const { productId } = req.params;
  const productInfo = await productModel.findOne({ _id: productId, deletedAt: false }).select('createdBy -_id');
  if (!productInfo) {
    return next(new Error(`product not found`));
  }
  if (await blockModel.findOne({ customerId: id, stockholderId: productInfo.createdBy })) {
    return next(new Error(`stock blocked you`));
  }
  const product = await productModel.findByIdAndUpdate(productId, {
    $addToSet: { like: id },
    $pull: { unlike: id }
  }, { new: true });
  product.totalVote = product.like.length - product.unlike.length;
  await product.save();
  return res.json({ message: "success", product });
}
export const unlikeProduct = async (req, res, next) => {
  const id = req.user._id;
  if (!await userModel.findOne({ _id: id, status: 'active', role: 'Customer' })) {
    return next(new Error(`not active account`));
  }
  const { productId } = req.params;
  const productInfo = await productModel.findOne({ _id: productId, deletedAt: false }).select('createdBy -_id');
  if (!productInfo) {
    return next(new Error(`product not found`));
  }
  if (await blockModel.findOne({ customerId: id, stockholderId: productInfo.createdBy })) {
    return next(new Error(`stock blocked you`));
  }
  const product = await productModel.findByIdAndUpdate(productId, {
    $addToSet: { unlike: id },
    $pull: { like: id }
  }, { new: true });
  product.totalVote = product.like.length - product.unlike.length;
  await product.save();
  return res.json({ message: "success", product });
}
//showcolor_size_qutupdate
export const showcolor_size_qutupdate = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOne({
    _id: productId,
    deletedAt: false,
    createdBy: req.user._id,
  });
  if (!product) {
    return next(new Error('This product was not found', { cause: 400 }));
  }
  const existingInfo = await Product_Color_SizeModel.findOne({ productId });
  return res.json({ message: 'success', existingInfo })
}
//
export const showgeneralinfoforproduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findOne({
    _id: productId,
    deletedAt: false,
    createdBy: req.user._id,
  });
  if (!product) {
    return next(new Error('This product was not found', { cause: 400 }));
  }
  return res.json({ message: 'success', product })
}
export const getspecficProductForSpecificStore = async (req, res, next) => {
  const { categoryId, stakeHolderId, productId } = req.params;
  const product = await productModel.findOne({ _id:productId });
  if (!product) {
    return next(new Error('cant found this product'));
  }
  else return res.status(200).json({ message: "success", product })
}
export const getproductforsatkeholder = async (req, res, next) => {
  const stakeHolderId = req.user._id;
  const user = await userModel.findOne({_id: stakeHolderId });
  if (!user) {
    return next(new Error('this user not found'));
  }
  const products=await productModel.find({createdBy:stakeHolderId})
  if (products.length==0) {
    return next(new Error('no product yet'));
  }
  else return res.status(200).json({ message: "success", products })
}


