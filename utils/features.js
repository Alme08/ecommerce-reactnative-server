import DataURIParser from 'datauri/parser.js';
import path from 'path';

export const getDataUri = file => {
	const parser = new DataURIParser();
	const extName = path.extname(file.fileName).toString();
	console.log('extName', extName);
	console.log(parser.format(extName, file.buffer));
	return parser.format(extName, file.buffer);
};

// {"assetId": null, "base64": null, "duration": null, "exif": null, "fileName": "6892e94a-522f-48b7-bb29-02df425d5123.jpeg", "fileSize": 4209745, "height": 2160, "mimeType": "image/jpeg", "rotation": null, "type": "image", "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fclient-a9f4794d-96cf-4133-b29e-c75bffa7e5fc/ImagePicker/6892e94a-522f-48b7-bb29-02df425d5123.jpeg", "width": 2880}
