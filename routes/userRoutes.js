import express from 'express';
import {
	getAllUsersController,
	getUserProfileController,
	loginController,
	logoutController,
	passwordResetController,
	registerController,
	updatePasswordController,
	updateProfileController,
	updateProfilePicController,
	updateUserController,
} from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';
import { rateLimit } from 'express-rate-limit';

// RATE LIMITER
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // limit each IP to 100 requests per windowMs
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

//router object
const router = express.Router();

//routes
//register
router.post('/register', limiter, registerController);

//login
router.post('/login', limiter, loginController);

//profile
router.get('/profile', isAuth, getUserProfileController);

//get all users
router.get('/get-all', isAuth, getAllUsersController);

//logout
router.get('/logout', logoutController);

//update profile
router.put('/profile-update', isAuth, updateProfileController);

//update password
router.put('/update-password', isAuth, updatePasswordController);

//update profile pic
router.post(
	'/update-profile-pic',
	isAuth,
	singleUpload,
	updateProfilePicController
);

// FORGOT PASSWORD
router.post('/reset-password', passwordResetController);

// UPDATE USER
router.put('/user-update/:id', isAdmin, updateUserController);

//export
export default router;
