
// Function to generate a random OTP
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}
export const generateOtpExpiry = () => {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10); // OTP expires in 10 minutes
    return expiryTime;
};
export const handleErrorResponse = (res, statusCode, message, key = null, value = false) => {
    return res.status(statusCode).json({
        message,
        [key]: value
    });
};