import HttpError from '../helpers/HttpError.js';
import Jimp from 'jimp';
import path from 'path';
import * as fse from 'fs-extra';
import cloudinary from '../helpers/cloudinary.js';

const tempDir = path.join(process.cwd(), 'temp');

export async function resizeImg(file) {
    try {
        await fse.ensureDir(tempDir);

        const tempResizedPath = path.join(tempDir, `resized-${file.filename}`);

        const img = await Jimp.read(file.path);
        await img.resize(250, 250);
        await img.write(tempResizedPath);

        const result = await cloudinary.uploader.upload(tempResizedPath, {
            folder: 'foodies/avatars',
            resource_type: 'image',
        });

        await fse.remove(file.path);
        await fse.remove(tempResizedPath);

        return result.secure_url;
    } catch (error) {
        console.log('resize/upload error', error);
        throw HttpError(500, 'Error uploading avatar');
    }
}
