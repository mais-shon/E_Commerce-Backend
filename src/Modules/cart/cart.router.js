import { Router } from "express";
import * as cartController from './controller/cart.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './cart.validation.js';
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
const router = Router();
router.post('/:productId',validation(validators.addToCartSchema),auth([roles.Customer]),asyncHandler(cartController.addToCart));
router.patch('/removeProductFromCart',validation(validators.removeProductFromCart),auth([roles.Customer]),asyncHandler(cartController.removeProductFromCart));
router.patch('/clearCart',auth([roles.Customer]),asyncHandler(cartController.clearCart));
router.get('/',auth([roles.Customer]),asyncHandler(cartController.getCart));
export default router;
