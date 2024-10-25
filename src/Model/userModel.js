import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        index: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] // Email validation
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    avatarImage: {
        type: String,
        required: [true, "Image is required"],
        trim: true,
        index: true
    },
    otp:{
        type:Number,
        required:false
    },
    otpExpiry:{
        type:Date,
        required:false
    },
    imageId:{
        type:String,
        required:true,
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
