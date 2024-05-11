import express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import {
	changeOrderStatusController,
	createOrderController,
	getAllOrderController,
	getAllOrdersController,
	getOrderDetailController,
	paymentController,
} from '../controllers/orderController.js';

const router = express.Router();

//routes
// CREATE ORDER
router.post('/create', isAuth, createOrderController);

// GET ALL MY ORDERS
router.get('/my-orders', isAuth, getAllOrderController);

// GET SINGLE ORDER DETAILS
router.get('/my-orders/:id', isAuth, getOrderDetailController);

// ACCEPT PAYMENT
router.post('/payments', isAuth, paymentController);

/// ============= ADMIN ============== ///
// GET ALL ORDERS
router.get('/admin/get-all-orders', isAuth, isAdmin, getAllOrdersController);

// CHANGE ORDER STATUS
router.put('/admin/order/:id', isAuth, isAdmin, changeOrderStatusController);

export default router;
