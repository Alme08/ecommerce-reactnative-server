import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		shippingInfo: {
			address: {
				type: String,
				required: [true, 'Please enter your address'],
			},
			city: {
				type: String,
				required: [true, 'Please enter your city'],
			},
			country: {
				type: String,
				required: [true, 'Please enter your country'],
			},
		},
		orderItems: [
			{
				name: {
					type: String,
					required: [true, 'Please enter product name'],
				},
				price: {
					type: Number,
					required: [true, 'Please enter product price'],
				},
				quantity: {
					type: Number,
					required: [true, 'Please enter product quantity'],
				},
				image: {
					type: String,
					required: [true, 'Please enter product image'],
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: 'Product',
				},
			},
		],
		paymentMethod: {
			type: String,
			enum: ['COD', 'ONLINE'],
			default: 'COD',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
			required: [true, 'Please enter user id'],
		},
		paidAt: Date,
		paymentInfo: {
			id: String,
			status: String,
		},
		itemPrice: {
			type: Number,
			required: [true, 'Please enter item price'],
		},
		tax: {
			type: Number,
			required: [true, 'Please enter tax price'],
		},
		shippingCharges: {
			type: Number,
			required: [true, 'Please enter shipping charges'],
		},
		totalAmount: {
			type: Number,
			required: [true, 'Please enter total price'],
		},
		orderStatus: {
			type: String,
			enum: ['Procesando', 'Enviado', 'Entregado', 'Cancelado'],
			default: 'Procesando',
		},
		deliveredAt: Date,
	},
	{
		timestamps: true,
	}
);

export const orderModel = mongoose.model('Orders', orderSchema);
export default orderModel;
