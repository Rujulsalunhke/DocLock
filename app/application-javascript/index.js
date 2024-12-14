const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config(); // Load environment variables from .env file

// Separate Routes for Assets and Users
const AssetRoute = require("./route");
const UserRoute = require("./userRoute");
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set the routes for Assets and Users
app.use("/Assets", AssetRoute);
app.use("/Users", UserRoute);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for email
    pass: process.env.EMAIL_PASS, // Use environment variable for email password
  },
});

// Example: Send a test email (remove in production)
transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'Hello, this is a test email!',
}, (err, info) => {
  if (err) {
    console.error('Error sending email:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});

// PORT
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Connected to port " + port);
});

// Error Handling
app.use((req, res, next) => {
  next();
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
