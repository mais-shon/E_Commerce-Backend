import { Router } from "express";
import * as categoryController from './Controller/Category.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Category.validation.js';
import validation from "../../Middleware/validation.js";
import { auth ,roles} from "../../Middleware/auth.middleware.js";
import UserRouter from '../User/User.router.js';

const router = Router();
router.use('/:categoryId/user',UserRouter);
router.post('/createCategory',auth([roles.Admin]),validation(validators.createCategory),asyncHandler(categoryController.createCategory));
router.patch('/updateCategory/:categoryId',auth([roles.Admin]),validation(validators.updateCategory),asyncHandler(categoryController.updateCategory));
router.get('/getAllCategory',auth([roles.Admin,roles.stakeHolder,roles.Customer]),asyncHandler(categoryController.getAllCategory));
router.get('/getSpecificCategory/:categoryId',auth([roles.Admin]),validation(validators.getSpecificCategory),asyncHandler(categoryController.getSpecificCategory));
router.delete('/deleteCategory/:categoryId',auth([roles.Admin]),validation(validators.deleteCategory),asyncHandler(categoryController.deleteCategory));

export default router;