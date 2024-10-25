import { Router } from "express";
import { getUser, loginUser, registerUser, resetPassword } from "../Controllers/userController.js";

const userRoute = Router();

// Use POST method for login and registration
userRoute.route("/loginUser").post(loginUser);
userRoute.route("/registerUser").post(registerUser);
userRoute.route("/getUser/:userId").get(getUser);
userRoute.route("/resetPassword").post(resetPassword);

export default userRoute;

