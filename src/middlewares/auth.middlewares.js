import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const jwtVerify  = asyncHandler(async (req,res,next)=> {

    //check cookies or check authorization headers for single request 

    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ","");

        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, proccess.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } 
    
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})