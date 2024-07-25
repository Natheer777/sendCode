// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// إعداد حساب Gmail لإرسال البريد الإلكتروني
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // حساب Gmail الخاص بك
    pass: process.env.EMAIL_PASS  // كلمة المرور الخاصة بالتطبيق
  }
});

// إرسال البريد الإلكتروني مع الرمز الخاص بالتحقق
app.post('/sendEmail', (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Failed to send verification email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send({ message: 'Verification email sent successfully', code });
    }
  });
});

// تشغيل الخادم على منفذ معين
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
