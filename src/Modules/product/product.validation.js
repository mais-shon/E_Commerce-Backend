import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";
export const createProductSchema = joi.object({
    name:joi.string().required(),
    price:joi.number().positive().required(),
    discount:joi.number().min(1).max(100),
    description:joi.string().required(),
    products:joi.array().items(joi.object().keys({
        size:joi.string().valid('M','L','XL','XXL','S','One Size' ,'34','35','36','37', '38','39','40','41','42','43','44','One Size','Standard').required(),
        qut:joi.number().positive().min(1).required(),
        color:joi.string()
    })).required(),
    files:joi.object({
        subImages:joi.array().items(generalFeilds.file),
        mainImage:joi.array().items(generalFeilds.file).required()
}),
}).required();
export const softDeleteProductSchema = joi.object({
    productId:generalFeilds.id,
}).required();
export const deleteProductSchema = joi.object({
    productId:generalFeilds.id,
}).required();
export const updateProductSchema = joi.object({
    productId:generalFeilds.id,
    name:joi.string(),
    price:joi.number().positive(),
    discount:joi.number().min(1).max(100),
    description:joi.string(),
    files:joi.object({
        subImages:joi.array().items(generalFeilds.file),
        mainImage:joi.array().items(generalFeilds.file)
}),
}).required();
export const color_size_qutupdateSchema = joi.object({
    productId:generalFeilds.id,
    products:joi.array().items(joi.object().keys({
        size:joi.string().valid('M','L','XL','XXL','S','One Size' ,'34','35','36','37', '38','39','40','41','42','43','44','One Size','Standard').required(),
        qut:joi.number().positive().min(1).required(),
        color:joi.string()
    }))
}).required();
export const getProductsForSpecificStoreSchema = joi.object({
    stockholderId:generalFeilds.id
}).required();
export const addToWishListSchema = joi.object({
    productId:generalFeilds.id
}).required();
export const removeFromWishlistSchema = joi.object({
    productId:generalFeilds.id
}).required();
export const likeProductSchema = joi.object({
    productId:generalFeilds.id
}).required();
export const unlikeProductSchema = joi.object({
    productId:generalFeilds.id
}).required();