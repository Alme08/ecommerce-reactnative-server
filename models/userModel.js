import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: [true, 'Email already exists'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minLength: [6, 'Password must be atleast 6 characters long'],
		},
		address: {
			type: String,
			required: [true, 'Address is required'],
		},
		city: {
			type: String,
			required: [true, 'City is required'],
		},
		country: {
			type: String,
			required: [true, 'Country is required'],
		},
		phone: {
			type: String,
			required: [true, 'Phone is required'],
		},
		profilePic: {
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
		// answer: {
		// 	type: String,
		// 	required: [true, 'Answer is required'],
		// },
		role: {
			type: String,
			default: 'usuario',
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

//functions
//hash func
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
});

//Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

//JWT token
userSchema.methods.generateToken = function () {
	return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
};

export const userModel = mongoose.model('Users', userSchema);
export default userModel;
