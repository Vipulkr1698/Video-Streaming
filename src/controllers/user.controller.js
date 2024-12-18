import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


const loginUser = asyncHandler( async (req,res) => {
    //get req body 
    // check if email or username present
    // find the user with email or username db call
    // validate the password
    // generate refresh and access token 
    // send the cookies 

    const {username, email, password} = req.body
    if(!username && !email) {
        throw new ApiError(400, "email or username must be present")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user){
        throw new ApiError(404, "user with this email or username does not exists")
    }

    if(!user.isPasswordCorrect(user.password)){
        throw new ApiError(401, "Incorrect Password")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    ) 


})

const registerUser = asyncHandler(async (req,res) => {
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username , fullname , email, password } = req.body;
    console.log("email: ", email);

    if ( [username , fullname , email, password].some( field => field?.trim() == "")){
        throw new ApiError(400, "required field cannot be empty")
    }
    
    const existedUser = await User.findOne({
        $or : [ {username}, {email}]
    })

    if (existedUser) {
        throw new ApiError( 409 , "user already exists please use different name")
    }

    console.log("avatar",req.files);

    const avatarLocalPath  = req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image cannot be empty")
     }

    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);


    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
   
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})


const logOutUser = asyncHandler ( async (req,res) => {
    //find user, users comes from auth midlleware
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    //remove the cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))


})


const refreshAccessToken  = asyncHandler ( async (req,res) => {
    //get refreshtoken or access token from cookies or req body
    // decode the refresh token
    // find the user for the particular refresh token
    //generate new access and refresh token 
    // update the datebase

    const incomingRequest = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRequest) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRequest, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id) 
    
        if (!user){
            throw new ApiError(404, "user with this refresh token does not exits")
        }
    
        if (incomingRequest == !user.refreshAccessToken)
            {
                throw new ApiError(404, "refresh token incorrect or expired")
            }
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
    
        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "Access token is refreshed now"
            )
        ) 
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }






})

export {registerUser,loginUser, logOutUser, refreshAccessToken}