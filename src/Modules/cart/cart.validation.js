import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const addToCartSchema = joi.object({
    productId:generalFeilds.id,
    qty:joi.number().positive().required(),
    color:joi.string().required(),
    size:joi.string().valid('M','L','XL','XXL','S','One Size' ,'34','35','36','37', '38','39','40','41','42','43','44','One Size','Standard').required(),
}).required();
export const removeProductFromCart = joi.object({
    productId:generalFeilds.id,
    color:joi.string().required(),
    size:joi.string().valid('M','L','XL','XXL','S','One Size' ,'34','35','36','37', '38','39','40','41','42','43','44','One Size','Standard').required(),
}).required();