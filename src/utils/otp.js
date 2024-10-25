import nodemailer from "nodemailer";

export async function sendOTP(email, otp) {
  var transporter = nodemailer.createTransport({

    host: "live.smtp.mailtrap.io",
  
    port: 587,
  
    auth: {
  
      user: "smtp@mailtrap.io",
  
      pass: "9fe083c31610396c3112a69009526cc8"
  
    }
  
  });

  const mailOptions = {
    from: 'pwnkr7777@gmail.com', // Use an actual email from your domain
    to: email, // Receiver's email
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is ${otp}.`, // Plain text body
    html: `<p>Your OTP code is <strong>${otp}</strong>.</p>`, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return otp; // Return the OTP
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error; // Throw the error to handle it outside the function
  }
}
