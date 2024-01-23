import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const signUpSchema = joi.object({
    firstName: joi.string().alphanum().min(3).max(20).required().messages({
        'any.required': 'firstname is required',
        'string.empty': 'firstname is required'
    }),
    lastName: joi.string().alphanum().min(3).max(20),
    address: generalFeilds.address,
    phone: generalFeilds.phone,
    role: joi.string().alphanum().required(),
    email: generalFeilds.email,
    categoryName: joi.string().alphanum(),
    password: generalFeilds.password,
    cPassword: joi.string().valid(joi.ref('password')).required(),

}).required();

export const signInSchema = joi.object({
    email: generalFeilds.email,
    password: generalFeilds.password,
}).required();

export const token = joi.object({
    token: joi.string().required(),
}).required();

export const forgetPassword = joi.object({
    email: generalFeilds.email,
    password: generalFeilds.password,
    code: joi.string().required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
}).required();

