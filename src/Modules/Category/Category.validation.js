import Joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";
export const createCategory = Joi.object({
   name: Joi.string().min(2).max(30).required(),
}).required()

export const updateCategory = Joi.object({
   name: Joi.string().min(2).max(30),
   categoryId: generalFeilds.id,
}).required()
export const getSpecificCategory = Joi.object({
   categoryId: generalFeilds.id,
}).required();

export const deleteCategory = Joi.object({
   categoryId: generalFeilds.id,
}).required();