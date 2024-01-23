import { Router } from "express";
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import * as reportController from './controller/report.controller.js';
import * as validators from './report.validation.js';
import validation from "../../Middleware/validation.js";
const router = Router();
router.post('/:stockholderId', auth([roles.Customer]), validation(validators.createReportStockholderSchema),asyncHandler(reportController.createReportStockholder));

router.get('/', auth([roles.Admin]), asyncHandler(reportController.getStockholdersReports));

router.post('/createReportProduct/:productId', auth([roles.Customer]), validation(validators.createReportProductSchema),asyncHandler(reportController.createReportProduct));

router.get('/getProductreports/:stockholderId', auth([roles.Admin]), validation(validators.getProductsReportedForSpecificStockholderSchema),asyncHandler(reportController.getProductsReportedForSpecificStockholder));

router.get('/getProductreports', auth([roles.stakeHolder]), asyncHandler(reportController.getProductsReportedForSpecificStockholder));

router.get('/:productId', auth([roles.Admin, roles.stakeHolder]),validation(validators.getReportsForSpecificProductSchema), asyncHandler(reportController.getReportsForSpecificProduct));

export default router;