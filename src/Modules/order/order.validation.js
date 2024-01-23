import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";
export const addAllFromCartSchema = joi.object({
    phoneNumber: joi.string().required(),
    address: joi.string().required(),
    note: joi.string()
}).required();
export const changeStatusSchema = joi.object({
    status: joi.string().valid('onWay', 'delivered','canceled','approved').required(),
    orderId: generalFeilds.id
}).required();
export const cancelOrderSchema =joi.object({
    orderId:generalFeilds.id,
}).required();