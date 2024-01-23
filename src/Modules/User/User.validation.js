import { generalFeilds } from "../../Middleware/validation.js";
import joi from 'joi';
export const getstakeHolderSchema = joi.object({
    categoryId:generalFeilds.id
}).required();
export const profilePicSchema = joi.object({
    file:generalFeilds.file.required()
}).required();
export const BioSchema = joi.object({
    Bio:joi.string().required()
}).required();
export const softDeleteUserSchema = joi.object({
    userId:generalFeilds.id
}).required();
export const updateInfoSchema = joi.object({
    firstName: joi.string().alphanum().min(3).max(20).messages({
        'any.required': 'firstname is required',
        'string.empty': 'firstname is required'
    }),
    lastName :joi.string().alphanum().min(3).max(20),
    email:generalFeilds.email,
    password:generalFeilds.password,
    address:joi.string().min(10),
    phone:joi.string().length(10),
    newPassword: joi.string().min(3),
    confirmNewPassword:joi.string().valid(joi.ref('newPassword')),
}).required();
