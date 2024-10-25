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

        const user = await User.findOne({ email });
        if (!user) {
            return handleErrorResponse(res, 404, "User with this email not found", "userLoggedIn", false);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return handleErrorResponse(res, 401, "Incorrect password", "userLoggedIn", false);
        }

        const userWithoutPassword = await User.findById(user._id).select("-password");
        return res.status(200).json({
            userLoggedIn: true,
            message: "Login successful",
            user: userWithoutPassword
        });
    } catch (error) {
        return handleErrorResponse(res, 500, "Internal server error", "userLoggedIn", false);
    }
};

/**
 * User Registration
 */
export const registerUser = async (req, res) => {
    try {
        const { email, password, fullName, fileUrl,imagePublicId } = req.body;
        if (!email || !password || !fullName || !fileUrl || !imagePublicId) {
            return handleErrorResponse(res, 400, "All credentials are required", "userCreated", false);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return handleErrorResponse(res, 400, "User already exists", "userCreated", false);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            fullName,
            avatarImage:imageUrl || null,
            imageId:imagePublicId || null
        });

        await newUser.save();
        const userWithoutPassword = await User.findById(newUser._id).select("-password");

        return res.status(201).json({
            userCreated: true,
            message: "User registered successfully",
            user: userWithoutPassword
        });
    } catch (error) {
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

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = "";
        user.otpExpiry = "";
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully",
            changedPassword: true
        });
    } catch (error) {
        return handleErrorResponse(res, 500, "Internal server error", "changedPassword", false);
    }
};

/**
 * Confirm OTP
 */
export const confirmOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return handleErrorResponse(res, 400, "Email and OTP are required", "validOTP", false);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return handleErrorResponse(res, 404, "User with this email doesn't exist", "validOTP", false);
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return handleErrorResponse(res, 400, "Invalid or expired OTP", "validOTP", false);
        }

        user.otp = "";
        user.otpExpiry = "";
        await user.save();

        return res.status(200).json({
            message: "OTP confirmed successfully",
            validOTP: true
        });
    } catch (error) {
        return handleErrorResponse(res, 500, "Internal server error", "validOTP", false);
    }
};

/**
 * Change Avatar
 */
export const changeAvatar = async (req, res) => {
    try {
        const { userId, avatarUrl } = req.body;
        if (!userId || !avatarUrl) {
            return handleErrorResponse(res, 400, "User ID and avatar URL are required", "changedAvatar", false);
        }

        const existedUser = await User.findById(userId);
        if (!existedUser) {
            return handleErrorResponse(res, 404, "User not found with this User ID", "changedAvatar", false);
        }

        existedUser.avatarImage = avatarUrl;
        await existedUser.save();

        return res.status(200).json({
            message: "Avatar changed successfully",
            changedAvatar: true
        });
    } catch (error) {
        return handleErrorResponse(res, 500, "Internal server error", "changedAvatar", false);
    }
};

/**
 * Get User's Image Public ID
 */
export const imagePublicId = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return handleErrorResponse(res, 400, "Please provide a User ID", "hasImagePublicId", false);
        }

        const existedUser = await User.findById(userId).select("imagePublicId");
        if (!existedUser || !existedUser.imagePublicId) {
            return handleErrorResponse(res, 404, "This user doesn't have an image Public ID", "hasImagePublicId", false);
        }

        return res.status(200).json({
            message: "Here is your Public Image ID",
            hasImagePublicId: true,
            imagePublicId: existedUser.imagePublicId
        });
    } catch (error) {
        return handleErrorResponse(res, 500, "Internal server error", "hasImagePublicId", false);
    }
};
