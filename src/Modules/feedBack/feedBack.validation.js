import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";
export const createFeedbackSchema = joi.object({
    comment: joi.string().required(),
    rating: joi.number().positive().min(0).max(5).required(),
    productId: generalFeilds.id
}).required();
export const updateFeedbackSchema = joi.object({
    comment: joi.string(),
    rating: joi.number().positive().min(0).max(5),
    feddbackId: generalFeilds.id
}).required();

