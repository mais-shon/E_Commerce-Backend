import {Router} from 'express';
import * as AuthController from './controller/Auth.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Auth.validation.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
const router =Router();

router.post('/signUp',validation(validators.signUpSchema),fileUpload(fileValidation.image).single('image'),asyncHandler(AuthController.signUp));
router.get('/confirmEmail/:token',validation(validators.token),asyncHandler(AuthController.confirmEmail));
router.get('/NewconfirmEmail/:token',validation(validators.token),asyncHandler(AuthController.NewconfirmEmail));
router.post('/signIn',asyncHandler(AuthController.signIn));
export default router;