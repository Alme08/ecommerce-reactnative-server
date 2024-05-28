import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import Stripe from 'stripe';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import bodyParser from 'body-parser';

//dot env config
dotenv.config();

//database connection
connectDB();

//stripe configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

//cloudinary config
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

//rest object
const app = express();

//middelewares
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors());
app.use(cookieParser());
// var bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(
// 	bodyParser.urlencoded({
// 		limit: '50mb',
// 		extended: true,
// 		parameterLimit: 50000,
// 	})
// );

//route
//routes imports
import testRoutes from './routes/testRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
app.use('/api/v1', testRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cat', categoryRoutes);
app.use('/api/v1/order', orderRoutes);

app.get('/', (req, res) => {
	return res.status(200).send('<h1>NodeJS REST API</h1>');
});

//port
const PORT = process.env.PORT || 5000;

//listen
app.listen(PORT, () => {
	console.log(
		`Server Running on PORT ${process.env.PORT} on ${process.env.NODE_ENV} Mode`
			.bgCyan.white
	);
});

export default app;
