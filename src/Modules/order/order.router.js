import { Router } from "express";
import * as orderController from './controller/order.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './order.validation.js';
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
const router = Router();
router.post('/', auth([roles.Customer]), validation(validators.addAllFromCartSchema),asyncHandler(orderController.addAllFromCart));
router.patch('/:orderId', auth([roles.stakeHolder]),  validation(validators.changeStatusSchema),asyncHandler(orderController.changeStatus));
router.get('/', auth([roles.stakeHolder]), asyncHandler(orderController.getOrderForSpecificStock));
router.patch('/cancelOrder/:orderId',auth([roles.Customer]),  validation(validators.cancelOrderSchema),asyncHandler(orderController.cancelOrder));
router.get('/getCustomerOrders',auth([roles.Customer]),asyncHandler(orderController.getCustomerOrders));
export default router;