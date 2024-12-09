import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const uploadResult = await cloudinary.uploader
       .upload(
           localFilePath, {
               resource_type : "auto",
           }
       )
       console.log("file uploaded successfully on Cloudinary", uploadResult.url);
       return uploadResult;
       
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("File Upload on Cloudinary got failed", error);
        return null
        
    }
}