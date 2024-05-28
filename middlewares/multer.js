import multer from 'multer';

const storage = multer.memoryStorage();

export const singleUpload = multer({
	storage,
	limits: {
		fileSize: 50 * 1024 * 1024, // 50 MB
	},
}).single('file');
