const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Separate Routes for Assets and Users
const AssetRoute = require("./route");
const UserRoute = require("./userRoute");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set the routes for Assets and Users
app.use("/Assets", AssetRoute);
app.use("/Users", UserRoute);

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

