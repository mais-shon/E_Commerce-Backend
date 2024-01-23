import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";
export const createBlockSchema = joi.object({
    customerId:generalFeilds.id
}).required();
export const deleteBlockSchema = joi.object({
    customerId:generalFeilds.id
}).required();