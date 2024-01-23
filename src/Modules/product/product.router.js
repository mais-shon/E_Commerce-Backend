import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as productController from './controller/product.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './product.validation.js';
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";

const router = Router({ mergeParams: true });
router.post('/createProduct', auth([roles.stakeHolder]), fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 4 }
]), validation(validators.createProductSchema), asyncHandler(productController.createProduct));

router.patch('/softDelete/:productId', auth([roles.stakeHolder]), validation(validators.softDeleteProductSchema), asyncHandler(productController.softDeleteProduct));

router.get('/getAllProduct', asyncHandler(productController.getProducts));

router.delete('/deleteProduct/:productId', auth([roles.Admin]), validation(validators.deleteProductSchema), asyncHandler(productController.deleteProduct));

router.put('/updateProduct/:productId', auth([roles.stakeHolder, roles.Admin]), fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 4 }
]), validation(validators.updateProductSchema), asyncHandler(productController.updateProduct));

router.put('/color_size_qutupdate/:productId', auth([roles.stakeHolder]), validation(validators.color_size_qutupdateSchema), asyncHandler(productController.color_size_qutupdate));
router.get('/:stockholderId', auth([roles.stakeHolder, roles.Customer, roles.Admin]), validation(validators.getProductsForSpecificStoreSchema), asyncHandler(productController.getProductsForSpecificStore));
router.patch('/addToWishlist/:productId', auth([roles.Customer]), validation(validators.removeFromWishlistSchema), asyncHandler(productController.addToWishList));
router.patch('/removeFromWishlist/:productId', auth([roles.Customer]), validation(validators.addToWishListSchema), asyncHandler(productController.removeFromWishlist));
router.get('/', auth([roles.Customer]), asyncHandler(productController.getWishList));
router.patch('/like/:productId', auth([roles.Customer]), validation(validators.likeProductSchema), asyncHandler(productController.likeProduct));
router.patch('/unlike/:productId', auth([roles.Customer]), validation(validators.unlikeProductSchema), asyncHandler(productController.unlikeProduct));
router.get('/showcolor_size_qutupdate/:productId', auth([roles.stakeHolder]), asyncHandler(productController.showcolor_size_qutupdate));
router.get('/showgeneralinfoforproduct/:productId', auth([roles.stakeHolder]), asyncHandler(productController.showgeneralinfoforproduct));
router.get(
    '/getspecficProductForSpecificStore/:categoryId/:stakeHolderId/:productId',
    auth([roles.Customer, roles.stakeHolder, roles.Admin]),
    asyncHandler(productController.getspecficProductForSpecificStore)
);
router.get(
    '/getspecficProductForSpecificStore/:categoryId/:stakeHolderId/:productId',
    auth([roles.Customer, roles.stakeHolder, roles.Admin]),
    asyncHandler(productController.getspecficProductForSpecificStore)
);
export default router;


