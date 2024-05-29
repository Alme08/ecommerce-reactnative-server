import userModel from '../models/userModel.js';
import cloudinary from 'cloudinary';
import { getDataUri } from '../utils/features.js';
export const registerController = async (req, res) => {
	try {
		const { name, email, password, address, city, country, phone, answer } =
			req.body;
		if (
			!name ||
			!email ||
			!password ||
			!address ||
			!city ||
			!country ||
			!phone ||
			!answer
		) {
			return res.status(500).send({
				success: false,
				message: 'All fields are required',
			});
		}
		//check existing user
		const existingUser = await userModel.findOne({ email });
		//validation
		if (existingUser) {
			return res.status(500).send({
				success: false,
				message: 'Email already exists',
			});
		}
		const user = await userModel.create({
			name,
			email,
			password,
			address,
			city,
			country,
			phone,
			answer,
		});
		res.status(201).send({
			success: true,
			message: 'Register Success',
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error In Register API',
			error,
		});
	}
};

//LOGIN
export const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;
		//validation
		if (!email || !password) {
			return res.status(500).send({
				success: false,
				message: 'All fields are required',
			});
		}
		//check existing user
		const user = await userModel.findOne({ email });
		//user validation
		if (!user) {
			return res.status(404).send({
				success: false,
				message: 'User not found',
			});
		}
		//password validation
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(500).send({
				success: false,
				message: 'Invalid Password',
			});
		}
		//token
		const token = user.generateToken();

		res
			.status(200)
			.cookie('token', token, {
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				secure: process.env.NODE_ENV === 'development' ? true : false,
				httpOnly: process.env.NODE_ENV === 'development' ? true : false,
				sameSite: process.env.NODE_ENV === 'development' ? true : false,
			})
			.send({
				success: true,
				message: 'login successfully',
				token,
				user,
			});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: 'false',
			message: 'Error in Login API',
			error,
		});
	}
};

// GET USER PROFILE
export const getUserProfileController = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id);
		user.password = undefined;
		res.status(200).send({
			success: true,
			message: 'User profile fetched successfully',
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error In Profile API',
			error,
		});
	}
};

//GET ALL USERS

export const getAllUsersController = async (req, res) => {
	const { keyword } = req.query;
	try {
		let users;
		users = await userModel.find({
			name: {
				$regex: keyword ? keyword : '',
				$options: 'i',
			},
		});
		res.status(200).send({
			success: true,
			message: 'All users fetched successfully',
			totalUsers: users.length,
			users,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error in getting all users API',
			error,
		});
	}
};

// LOGOUT
export const logoutController = async (req, res) => {
	try {
		res
			.status(200)
			.cookie('token', '', {
				expires: new Date(Date.now()),
				secure: process.env.NODE_ENV === 'development' ? true : false,
				httpOnly: process.env.NODE_ENV === 'development' ? true : false,
				sameSite: process.env.NODE_ENV === 'development' ? true : false,
			})
			.send({
				success: true,
				message: 'Logout successfully',
			});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error In logout API',
			error,
		});
	}
};

// UPDATE USER PROFILE
export const updateProfileController = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id);
		const { name, email, address, city, country, phone } = req.body;
		//validation + update
		if (name) user.name = name;
		if (email) user.email = email;
		if (address) user.address = address;
		if (city) user.city = city;
		if (country) user.country = country;
		if (phone) user.phone = phone;

		//save user
		await user.save();
		res.status(200).send({
			success: true,
			message: 'Profile updated successfully',
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error In update profile API',
			error,
		});
	}
};

// UPDATE PASSWORD
export const updatePasswordController = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id);
		const { oldPassword, newPassword } = req.body;
		//validation
		if (!oldPassword || !newPassword) {
			return res.status(500).send({
				success: false,
				message: 'All fields are required',
			});
		}
		//password validation
		const isMatch = await user.comparePassword(oldPassword);
		if (!isMatch) {
			return res.status(500).send({
				success: false,
				message: 'Invalid Password',
			});
		}
		user.password = newPassword;
		await user.save();
		res.status(200).send({
			success: true,
			message: 'Password updated successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error In update password API',
			error,
		});
	}
};

// UPDATE PROFILE PIC
export const updateProfilePicController = async (req, res) => {
	try {
		const user = await userModel.findById(req.user._id);
		if (!req.file) {
			console.log('file not found');
			return res.status(404).send({
				success: false,
				message: 'Please upload an image',
			});
		}
		//get file
		console.log(req.file);
		const file = getDataUri(req.file);
		//delete prev image
		if (user.profilePic.public_id !== '149071_cskhjj') {
			await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
		}
		//upload new image
		const cdb = await cloudinary.v2.uploader.upload(file);
		user.profilePic = {
			public_id: cdb.public_id,
			url: cdb.secure_url,
		};
		//save func
		await user.save();
		res.status(200).send({
			success: true,
			message: 'profile pic updated successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error In update profile pic API',
			error,
		});
	}
};

// FORGOT PASSWORD
export const passwordResetController = async (req, res) => {
	try {
		// user get email || new password || answer
		const { email, newPassword, answer } = req.body;
		// validation
		if (!email || !newPassword || !answer) {
			return res.status(500).send({
				success: false,
				message: 'Please provide all fields',
			});
		}
		// find user
		const user = await userModel.findOne({ email, answer });
		//validation
		if (!user) {
			return res.status(404).send({
				success: false,
				message: 'Invalid email or answer',
			});
		}

		user.password = newPassword;
		await user.save();
		res.status(200).send({
			success: true,
			message: 'Your password has been reset successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: 'Error In password reset pic API',
			error,
		});
	}
};
