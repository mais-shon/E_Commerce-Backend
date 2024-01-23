
import Joi from 'joi';
import joi from 'joi';
import { Types } from 'mongoose';
const validationObjectId = (value, helper) => {
    if (Types.ObjectId.isValid(value)) {
        return true;
    } else {
        return helper.message("this id is invalid");
    }
}
export const generalFeilds = {
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().min(3).required(),
    address: Joi.string().min(10).required(),
    phone: Joi.string().length(10).required(),
    file: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().positive().required(),
        dest: joi.string(),
    }),
    id: joi.string().custom(validationObjectId).required(),
};
const validation = (schema) => {
    return (req, res, next) => {
        const inputData = { ...req.body, ...req.params, ...req.query };
        if (req.file) {
            inputData.file = req.file;
        }
        const validationResults = schema.validate(inputData, { abortEarly: false });
        if (validationResults.error?.details) {
            return res.json({ message: "valiation error", validationError: validationResults.error?.details });
        } return next();
    }
}
export default validation;