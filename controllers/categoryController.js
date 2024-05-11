import categoryModel from '../models/categoryModel.js';
import productModel from '../models/productModel.js';

// CREATE CATEGORY
export const createCategoryController = async (req, res) => {
	try {
		const { category } = req.body;
		//validation
		if (!category) {
			return res.status(404).send({
				success: false,
				message: 'Please enter category name',
			});
		}
		await categoryModel.create({ category });
		res.status(201).send({
			success: true,
			message: ` ${category} Category created successfully`,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in create category API',
		});
	}
};

// GET ALL CATEGORY
export const getAllCategoryController = async (req, res) => {
	try {
		const categories = await categoryModel.find();
		res.status(200).send({
			success: true,
			message: 'Categories fetched successfully',
			total: categories.length,
			categories,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in get all category API',
		});
	}
};

// DELETE CATEGORY
export const deleteCategoryController = async (req, res) => {
	try {
		//find category
		const category = await categoryModel.findById(req.params.id);
		//validation
		if (!category) {
			return res.status(404).send({
				success: false,
				message: 'Category not found',
			});
		}
		//find product with category id
		const products = await productModel.find({ category: req.params.id });
		//update product category to undefined
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			product.category = undefined;
			await product.save();
		}
		//save
		await category.deleteOne();
		res.status(200).send({
			success: true,
			message: 'Category deleted successfully',
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
			message: 'Error in deleting category API',
			error,
		});
	}
};
// UPDATE CATEGORY
export const updateCategoryController = async (req, res) => {
	try {
		//find category
		const category = await categoryModel.findById(req.params.id);
		//validation
		if (!category) {
			return res.status(404).send({
				success: false,
				message: 'Category not found',
			});
		}
		//get new category
		const { updatedCategory } = req.body;
		//find product with category id
		const products = await productModel.find({ category: req.params.id });
		//update product category to undefined
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			product.category = updatedCategory;
			await product.save();
		}
		if (updatedCategory) category.category = updatedCategory;
		//save
		await category.save();
		res.status(200).send({
			success: true,
			message: 'Category updated successfully',
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
			message: 'Error in updating category API',
			error,
		});
	}
};
