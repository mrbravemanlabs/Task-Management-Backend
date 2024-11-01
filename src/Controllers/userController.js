import { User } from '../Model/userModel.js';
import bcrypt from 'bcryptjs';
import { sendOTP } from '../utils/otp.js';
import { generateOTP, generateOtpExpiry, handleErrorResponse } from '../utils/utilsFun.js';

/**
 * User Login
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return handleErrorResponse(res, 400, "Email and password are required", "userLoggedIn", false);
        }
        console.log("passed1");
        const user = await User.findOne({ email });
        if (!user) {
            return handleErrorResponse(res, 404, "User with this email not found", "userLoggedIn", false);
        }
        console.log("passed2");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return handleErrorResponse(res, 401, "Incorrect password", "userLoggedIn", false);
        }
        console.log("passed3");
        const userWithoutPassword = await User.findById(user._id).select("-password");
        return res.status(200).json({
            userLoggedIn: true,
            message: "Login successful",
            user: userWithoutPassword
        });
    } catch (error) {
        console.log("passed0");
        console.error("Login error:", error);
        return handleErrorResponse(res, 500, "Internal server error", "userLoggedIn", false);
    }
};

/**
 * User Registration
 */
export const registerUser = async (req, res) => {
    console.log("passed1");
    try {
        const { email, password, fullName, fileUrl, imagePublicId } = req.body;
        if (!email || !password || !fullName || !fileUrl || !imagePublicId) {
            return handleErrorResponse(res, 400, "All credentials are required", "userCreated", false);
        }
        console.log("passed2");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return handleErrorResponse(res, 400, "User already exists", "userCreated", false);
        }
        console.log("passed3");
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email,
            password: hashedPassword,
            fullName,
            avatarImage: fileUrl,
            imageId: imagePublicId
        });
        console.log("passed4");
        await newUser.save();
        const userWithoutPassword = await User.findById(newUser._id).select("-password");
        console.log("passed5");
        return res.status(201).json({
            userCreated: true,
            message: "User registered successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Registration error:", error);
        return handleErrorResponse(res, 500, "Internal server error", "userCreated", false);
    }
};

/**
 * Get User Details
 */
export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return handleErrorResponse(res, 400, "User ID is required", "userFound", false);
        }

        const user = await User.findById(userId).select("avatarImage fullName");
        if (!user) {
            return handleErrorResponse(res, 404, "User not found", "userFound", false);
        }

        return res.status(200).json({
            userFound: true,
            message: "User details",
            user
        });
    } catch (error) {
        console.error("Get user error:", error);
        return handleErrorResponse(res, 500, "Internal server error", "userFound", false);
    }
};

/**
 * Request Password Reset (Send OTP)
 */
export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return handleErrorResponse(res, 400, "Please provide an email", "userFound", false);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return handleErrorResponse(res, 404, "User with this email doesn't exist", "userFound", false);
        }

        const OTP = generateOTP();
        const OTPExpiry = generateOtpExpiry();
        user.otp = OTP;
        user.otpExpiry = OTPExpiry;
        await user.save();
        sendOTP(email, OTP);

        return res.status(200).json({
            message: "An OTP has been sent to your email",
            sentOTP: true
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return handleErrorResponse(res, 500, "Internal server error", "userFound", false);
    }
};

/**
 * Confirm Password Reset (Validate OTP and Change Password)
 */
export const confirmPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!newPassword || !email) {
            return handleErrorResponse(res, 400, "Invalid credentials", "changedPassword", false);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return handleErrorResponse(res, 404, "User with this email doesn't exist", "changedPassword", false);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        user.otp = "";
        user.otpExpiry = "";
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully",
            changedPassword: true
        });
    } catch (error) {
        console.error("Confirm password error:", error);
        return handleErrorResponse(res, 500, "Internal server error", "changedPassword", false);
    }
};
