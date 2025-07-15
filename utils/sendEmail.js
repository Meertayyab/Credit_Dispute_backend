const nodemailer = require('nodemailer');

async function sendEmail({ email, subject, resetUrl = '', type, name = '',newEmail, orderStatus = '', orderId = '',refundAmount,refundReason,refundStatus }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const logoImage = 'https://res.cloudinary.com/dqlyxvgcc/image/upload/v1726153699/logo3_iejcu4.png';

  let htmlContent = '';

  const emailFooter = `
<div style="display: flex; align-items: center; justify-content: center; padding-top: 20px;">
  <img src="${logoImage}" alt="PoultryPal Logo" style="max-width: 50px; margin-right: 10px;" />
  <p style="color: #555; margin: 0; font-size: 16px;">
    Best regards,<br>
    <strong>Phenom Security Team</strong>
  </p>
</div>
  `;

  // Email body content based on the type
  if (type === 'welcome') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color:#2C3E50; text-align: center;">Welcome to PoultryPal!</h2>
        <p style="color: #555;">Dear ${name ? name : 'User'},</p>
        <p style="color: #555;">Thank you for registering with PoultryPal! We're excited to have you join our community. Your account has been successfully created, and you’re all set to explore everything our platform has to offer.</p>
        <p style="color: #555;">If you have any questions or need assistance, feel free to reach out to our support team at any time.</p>
        <p style="color: #555;">Welcome aboard, and happy browsing!</p>
        ${emailFooter}
      </div>
    `;
  } else if (type === 'verify') {
    htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="color:#2C3E50; text-align: center;">Reset Your Password</h2>
    <p style="color: #555;">Dear ${name ? name : 'User'},</p>
    <p style="color: #555;">We received a request to reset your password. To proceed, please click the link below to reset your password:</p>
    <div style="background-color: #ffffff; border-radius: 5px; font-size: 12px; font-weight: bold; color: #2C3E50; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
    <a href="${resetUrl}" style="color: #2C3E50; text-decoration: none;">
      ${resetUrl}
    </a>
    </div>
    <p style="color: #555;">Please note that this link will expire in 30 minutes. If you did not request a password reset, please ignore this email.</p>
    <p style="color: #555;">If you have any questions or need further assistance, feel free to reach out to our support team.</p>
    ${emailFooter}
   </div>
`;
  } else if (type === 'reset') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color:#2C3E50; text-align: center;">Password Reset Confirmation</h2>
        <p style="color: #555;">Dear ${name ? name : 'User'},</p>
        <p style="color: #555;">Your password has been successfully updated.</p>
        <p style="color: #555;">If you did not make this change, please contact our support team immediately.</p>
        <p style="color: #555;">For your security, do not share your account details with anyone.</p>
        ${emailFooter}
       </div>
    `;
  }else if (type === 'emailChange') {
    htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="color: #2C3E50; text-align: center;">Email Address Changed</h2>
    <p style="color: #555;">Dear ${name ? name : 'User'},</p>
    <p style="color: #555;">We wanted to let you know that your email address has been successfully updated. Your new email address is:</p>
    <div style="background-color: #ffffff; border-radius: 5px; font-size: 16px; font-weight: bold; color: #2C3E50; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
      ${newEmail}
    </div>
    <p style="color: #555;">If you did not make this change or believe it was done in error, please contact our support team immediately to secure your account.</p>
    <p style="color: #555;">For any additional assistance, feel free to reach out to us. We're here to help!</p>
    ${emailFooter}
   </div>
`;
  }else if (type === 'orderStatus') {
    htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <h2 style="color: #2C3E50; text-align: center;">Order Status Update</h2>
      <p style="color: #555;">Dear ${name ? name : 'Valued Customer'},</p>
      <p style="color: #555;">We would like to inform you about the status of your order with ID: <strong>${orderId}</strong>. The current status is as follows:</p>
      <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; font-size: 14px; color: #2C3E50; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <strong>Status:</strong> ${orderStatus}
      </div>
      <p style="color: #555;">If you have any questions or need further clarification regarding your order, please do not hesitate to contact us.</p>
      <p style="color: #555;">We appreciate your business and look forward to serving you again!</p>
      ${emailFooter}
     </div>
  `;
  }else if (type === 'refundStatus') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #2C3E50; text-align: center;">Refund Update</h2>
        <p style="color: #555;">Dear ${name ? name : 'Valued Customer'},</p>
        <p style="color: #555;">We would like to inform you about the status of your refund request for Order ID: <strong>${orderId}</strong>.</p>
        <p style="color: #555;">Refund Amount: <strong>${refundAmount}</strong></p>
        <p style="color: #555;">Reason: <strong>${refundReason}</strong></p>
         <p style="color: #555;">The current status of your refund is as follows:</p>
      <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; font-size: 14px; color: #2C3E50; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <strong>Status:</strong> ${refundStatus}
      </div>
        <p style="color: #555;"> We will notify you of the process. If you have any questions or concerns, please do not hesitate to contact us.</p>
        <p style="color: #555;">We appreciate your business and thank you for your patience.</p>
        ${emailFooter}
      </div>
    `;
  }

  const mailOptions = {
    from: `"Phenom Security Team" <${process.env.smtp_email}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email.');
  }
}

module.exports = sendEmail;