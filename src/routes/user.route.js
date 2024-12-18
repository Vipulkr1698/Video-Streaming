import { Router } from "express";
import {registerUser, loginUser, logOutUser, refreshAccessToken} from "../controllers/user.controller.js"

import {upload} from "../middlewares/multer.middlewares.js"
import { jwtVerify } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),registerUser);


router.route("/login").post(loginUser)
router.route("/refreshAccessToken").post(refreshAccessToken)

//secured routes
router.route("/logout").post(jwtVerify,  logOutUser)


export default router;