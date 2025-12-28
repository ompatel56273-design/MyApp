import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:"dswbayxid",
    api_key:861163681174472,
    api_secret:'1R3zMXPA9L4x6RMTsTAVBqH-vOk'
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
         if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
         }
         console.log('response', response);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteOnCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            console.log('no public id');
            return null
        }
        await cloudinary.uploader.destroy(publicId)
        console.log('publicid',publicId);
    } catch (error) {
        console.log(error);
    }
}

export {uploadOnCloudinary,deleteOnCloudinary}