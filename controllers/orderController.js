import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import { stripe } from '../server.js';

// CREATE ORDER
export const createOrderController = async (req, res) => {
	try {
		const {
			shippingInfo,
			orderItems,
			paymentMethod,
			paymentInfo,
			itemPrice,
			tax,
			shippingCharges,
			totalAmount,
		} = req.body;
		//validation
		//create order
		await orderModel.create({
			user: req.user._id,
			shippingInfo,
			orderItems,
			paymentMethod,
			paymentInfo,
			itemPrice,
			tax,
			shippingCharges,
			totalAmount,
		});
		// stock update
		for (let i = 0; i < orderItems.length; i++) {
			//find products
			const product = await productModel.findById(orderItems[i].product);
			product.stock -= orderItems[i].quantity;
			await product.save();
		}
		res.status(201).send({
			success: true,
			message: 'Order created successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in create order API',
			error,
		});
	}
};

// GET ALL ORDERS - MY ORDERS
export const getAllOrderController = async (req, res) => {
	try {
		//find order
		const orders = await orderModel.find({ user: req.user._id });
		//validation
		if (!orders) {
			return res.status(404).send({
				success: false,
				message: 'Orders not found',
			});
		}
		res.status(200).send({
			success: true,
			message: 'Orders fetched successfully',
			total: orders.length,
			orders,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in get order API',
			error,
		});
	}
};

// GET SINGLE ORDER DETAIL
export const getOrderDetailController = async (req, res) => {
	try {
		//find order
		const order = await orderModel.findById(req.params.id);
		//validation
		if (!order) {
			return res.status(404).send({
				success: false,
				message: 'Order not found',
			});
		}
		res.status(200).send({
			success: true,
			message: 'Order fetched successfully',
			order,
		});
	} catch (error) {
		console.log(error);
		//Cast error || Object ID
		if (error.name === 'CastError') {
			return res.status(500).send({
				success: false,
				message: 'Invalid ID',
			});
		}
		res.status(500).send({
			success: false,
			message: 'Error in get detail order API',
			error,
		});
	}
};

// ACCEPT PAYMENT
export const paymentController = async (req, res) => {
	try {
		//get amount
		const { totalAmount } = req.body;
		//validation
		if (!totalAmount) {
			return res.status(404).send({
				success: false,
				message: 'Total Amount is required',
			});
		}
		console.log(totalAmount);
		const { client_secret } = await stripe.paymentIntents.create({
			amount: Number(totalAmount) * 100,
			currency: 'usd',
		});
		res.status(200).send({
			success: true,
			client_secret,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in get detail order API',
			error,
		});
	}
};

/// ================== ADMIN SECTION ================ ///
// GET ALL ORDER
export const getAllOrdersController = async (req, res) => {
	try {
		const orders = await orderModel.find({});
		res.status(200).send({
			success: true,
			message: 'All orders Data',
			totalOrders: orders.length,
			orders,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in get all orders API',
			error,
		});
	}
};

// CHANGE ORDER STATUS
export const changeOrderStatusController = async (req, res) => {
	try {
		//find order
		const order = await orderModel.findById(req.params.id);
		//validation
		if (!order) {
			return res.status(404).send({
				success: false,
				message: 'Order not found',
			});
		}
		if (order.orderStatus === 'Processing') order.orderStatus = 'Shipped';
		else if (order.orderStatus === 'Shipped') {
			order.orderStatus = 'Delivered';
			order.deliveredAt = Date.now();
		} else {
			return res.status(500).send({
				success: false,
				message: 'Order already delivered',
			});
		}
		await order.save();
		res.status(200).send({
			success: true,
			message: 'Order status updated successfully',
		});
	} catch (error) {
		console.log(error);
		//Cast error || Object ID
		if (error.name === 'CastError') {
			return res.status(500).send({
				success: false,
				message: 'Invalid ID',
			});
		}
		res.status(500).send({
			success: false,
			message: 'Error in update order API',
			error,
		});
	}
};
