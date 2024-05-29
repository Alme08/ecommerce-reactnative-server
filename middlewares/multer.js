import multer from 'multer';

const storage = multer.memoryStorage();

export const singleUpload = multer({
	storage,
	limits: {
		fieldSize: 50 * 1024 * 1024,
	},
}).single('file');
