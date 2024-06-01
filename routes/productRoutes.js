import express from 'express';
import {
	changeActiveProductController,
	createProductController,
	deleteProductController,
	deleteProductImageController,
	getAllProductsController,
	getSingleProductController,
	getTopProductsController,
	productReviewController,
	updateProductController,
	updateProductImageController,
} from '../controllers/productController.js';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

//routes
// GET ALL PRODUCTS
router.get('/get-all', getAllProductsController);

// GET TOP PRODUCTS
router.get('/top', getTopProductsController);

// GET PRODUCT
router.get('/:id', getSingleProductController);

// CREATE PRODUCT
router.post('/create', isAuth, singleUpload, createProductController);

// UPDATE PRODUCT
router.put('/:id', isAuth, isAdmin, updateProductController);

// UPDATE PRODUCT IMAGE
router.put('/image/:id', isAuth, singleUpload, updateProductImageController);

// CHANGE PRODUCT STATUS
router.put(
	'/:id/change-status',
	isAuth,
	isAdmin,
	changeActiveProductController
);

// DELETE PRODUCT IMAGE
router.delete(
	'/delete-image/:id',
	isAuth,
	isAdmin,
	deleteProductImageController
);

// DELETE PRODUCT
router.delete('/delete/:id', isAuth, isAdmin, deleteProductController);

// REVIEW PRODUCT
router.put('/:id/review', isAuth, productReviewController);
export default router;
