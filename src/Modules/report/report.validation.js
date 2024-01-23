import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';
export const createReportStockholderSchema = joi.object({
    stockholderId: generalFeilds.id,
    note: joi.string().required()
}).required();
export const createReportProductSchema = joi.object({
    productId: generalFeilds.id,
    note: joi.string().required()
}).required();
export const getProductsReportedForSpecificStockholderSchema = joi.object({
    stockholderId: generalFeilds.id
}).required();
export const getReportsForSpecificProductSchema = joi.object({
    productId: generalFeilds.id
}).required();
