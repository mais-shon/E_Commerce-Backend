import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as feedBackController from './controller/feedBack.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './feedBack.validation.js';
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
const router = Router();
router.post('/:productId', auth([roles.Customer]), validation(validators.createFeedbackSchema),asyncHandler(feedBackController.createFeedback));
router.patch('/:feddbackId', auth([roles.Customer]),  validation(validators.updateFeedbackSchema),asyncHandler(feedBackController.updateFeedback));
router.get('/:productId', auth([roles.Customer,roles.Admin,roles.stakeHolder]),asyncHandler(feedBackController.showfeedBack));
export default router;
