import productModel from '../models/productModel.js';
import { getDataUri } from '../utils/features.js';
import cloudinary from 'cloudinary';

// GET ALL PRODUCTS
export const getAllProductsController = async (req, res) => {
	const { keyword, category } = req.query;
	try {
		let products;
		if (category) {
			products = await productModel.find({
				name: {
					$regex: keyword ? keyword : '',
					$options: 'i',
				},
				category: category ? category : null,
			});
		} else {
			products = await productModel.find({
				name: {
					$regex: keyword ? keyword : '',
					$options: 'i',
				},
			});
		}
		// .populate('category');
		res.status(200).send({
			success: true,
			message: 'All products fetched successfully',
			totalProducts: products.length,
			products,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in getting all products API',
			error,
		});
	}
};

// GET TOP PRODUCT
export const getTopProductsController = async (req, res) => {
	try {
		const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
		res.status(200).send({
			success: true,
			message: 'top 3 products',
			products,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in getting all products API',
			error,
		});
	}
};

// GET SINGLE PRODUCT
export const getSingleProductController = async (req, res) => {
	try {
		// get product id
		const product = await productModel.findById(req.params.id);
		//validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: 'Product not found',
			});
		}
		res.status(200).send({
			success: true,
			message: 'Product fetched successfully',
			product,
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
			message: 'Error in getting single product API',
			error,
		});
	}
};

// CREATE PRODUCT
export const createProductController = async (req, res) => {
	try {
		console.log(req.body.formData, req.body.file);
		const { name, description, price, stock, category } = req.body;
		//validation
		if (!name || !description || !price || !stock) {
			console.log('aqui');
			return res.status(500).send({
				success: false,
				message: 'Please fill all fields',
			});
		}
		if (!req.file) {
			console.log('o aqui');
			return res.status(500).send({
				success: false,
				message: 'Please upload an image',
			});
		}
		const file = getDataUri(req.file);
		const cdb = await cloudinary.v2.uploader.upload(file.content);
		const image = {
			public_id: cdb.public_id,
			url: cdb.secure_url,
		};
		await productModel.create({
			name,
			description,
			price,
			category,
			stock,
			images: [image],
		});
		res.status(201).send({
			success: true,
			message: 'Product created successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in creating product API',
			error,
		});
	}
};

// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
	try {
		//find product
		const product = await productModel.findById(req.params.id);
		//validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: 'Product not found',
			});
		}
		const { name, description, price, stock, category } = req.body;
		//validate and update
		if (name) product.name = name;
		if (description) product.description = description;
		if (price) product.price = price;
		if (stock) product.stock = stock;
		if (category) product.category = category;

		await product.save();
		res.status(200).send({
			success: true,
			message: 'Product updated successfully',
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
			message: 'Error in updating product API',
			error,
		});
	}
};

// UPDATE PRODUCT IMAGE
export const updateProductImageController = async (req, res) => {
	try {
		//find product
		const product = await productModel.findById(req.params.id);
		//validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: 'Product not found',
			});
		}
		//check file
		if (!req.file) {
			return res.status(404).send({
				success: false,
				message: 'Please upload an image',
			});
		}

		const file = getDataUri(req.file);
		const cdb = await cloudinary.v2.uploader.upload(file.content);
		const image = {
			public_id: cdb.public_id,
			url: cdb.secure_url,
		};
		//save
		product.images.push(image);
		await product.save();
		res.status(200).send({
			success: true,
			message: 'Product image updated successfully',
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
			message: 'Error in updating product image API',
			error,
		});
	}
};

// DELETE PRODUCT IMAGE
export const deleteProductImageController = async (req, res) => {
	try {
		//find product
		const product = await productModel.findById(req.params.id);
		//validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: 'Product not found',
			});
		}
		//get image id
		const id = req.query.id;
		if (!id) {
			return res.status(404).send({
				success: false,
				message: 'Product image not found',
			});
		}

		let exist = -1;
		product.images.forEach((item, index) => {
			if (item._id.toString() === id.toString()) exist = index;
		});
		if (exist < 0) {
			return res.status(404).send({
				success: false,
				message: 'Image not found',
			});
		}
		//delete image
		await cloudinary.v2.uploader.destroy(product.images[exist].public_id);
		product.images.splice(exist, 1);
		await product.save();
		return res.status(200).send({
			success: true,
			message: 'Product image deleted successfully',
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
			message: 'Error in deleting product API',
			error,
		});
	}
};

// DELETE PRODUCT
export const deleteProductController = async (req, res) => {
	try {
		//find product
		const product = await productModel.findById(req.params.id);
		//validation
		if (!product) {
			return res.status(404).send({
				success: false,
				message: 'Product not found',
			});
		}
		//find and delete image cloudinary
		for (let index = 0; index < product.images.length; index++) {
			await cloudinary.v2.uploader.destroy(product.images[index].public_id);
		}
		await product.deleteOne();
		res.status(200).send({
			success: true,
			message: 'Product deleted successfully',
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
			message: 'Error in deleting product API',
			error,
		});
	}
};

// CREATE PRODUCT REVIEW AND COMMENT
export const productReviewController = async (req, res) => {
	try {
		const { comment, rating } = req.body;
		// find product
		const product = await productModel.findById(req.params.id);
		//check previous reviews
		const alreadyReviewed = product.reviews.find(
			r => r.user.toString() === req.user._id.toString()
		);
		if (alreadyReviewed) {
			return res.status(400).send({
				success: false,
				message: 'Product Already Reviewed',
			});
		}
		//review object
		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		};
		//passing review object to reviews array
		product.reviews.push(review);
		//number of reviews
		product.numReviews = product.reviews.length;
		product.rating =
			product.reviews.reduce((total, item) => item.rating + total, 0) /
			product.reviews.length;
		//save
		await product.save();
		res.status(200).send({
			success: true,
			message: 'Review added.',
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
			message: 'Error in review API',
			error,
		});
	}
};
