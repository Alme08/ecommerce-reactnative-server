import mongoose from 'mongoose';

//review model
const reviewSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your name'],
		},
		image: {
			public_id: {
				type: String,
				default: '149071_cskhjj',
			},
			url: {
				type: String,
				default:
					'https://res.cloudinary.com/djanluujt/image/upload/v1715559800/149071_cskhjj.png',
			},
		},
		rating: {
			type: Number,
			default: 0,
		},
		comment: {
			type: String,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
			required: [true, 'user required'],
		},
	},
	{
		timestamps: true,
	}
);

//product model
const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Product name is required'],
		},
		description: {
			type: String,
			required: [true, 'Product description is required'],
		},
		price: {
			type: Number,
			required: [true, 'Product price is required'],
		},
		stock: {
			type: Number,
			required: [true, 'Product stock is required'],
		},
		active: {
			type: Boolean,
			default: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		images: [
			{
				public_id: String,
				url: String,
			},
		],
		reviews: [reviewSchema],
		rating: {
			type: Number,
			default: 0,
		},
		numReviews: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

export const productModel = mongoose.model('Products', productSchema);
export default productModel;
