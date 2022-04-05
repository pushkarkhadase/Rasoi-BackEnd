//importing the path package for handling the system paths
const path = require("path");

//importing the express for handling and heavy lifting the server
const express = require("express");

//importing the Body Parser for parsing the url encoded JSON formats
const bodyParser = require("body-parser");

//importing the multer for parsing the multi part form data
const multer = require("multer");

//importing the CORS to resolve all the CORS errors
const cors = require("cors");

//function for storing information for recieved images
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//function for filtering the file types like JPEG, PNG
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    console.log(file.mimeType);
    cb(null, false);
  }
};

//importing the mongoClient to connect into the mongodb database
const mongoConnect = require("./util/database").mongoConnect;

//importing the consumer Authentication routes to use all consumer related routes
const consumerAuthRoutes = require("./routes/Auth/consumer");
//importing the seller Authentication routes to use all the seller related routes
const sellerAuthRoutes = require("./routes/Auth/seller");
//importing the validator Authentication routes to use the validator related routes
const validatorRoutes = require("./routes/Auth/validator");

//importing the consumer Regular routes to use all the consumer related routes
const consumerRegularRoutes = require("./routes/regular/consumer");
//importing the seller Regualar routes to use all the seller related routes
const sellerRegularRoutes = require("./routes/regular/seller");
//importing the Validator Regualar routes to use all the validator related routes
const validatorRegularRoutes = require("./routes/regular/validator");

// order routes
const consumerOrderRoutes = require("./routes/orders/consumer");

//intializing the express into the app
const app = express();

//using the cors package
app.use(cors());

//using the bodyParser
app.use(bodyParser.json()); //application/json

//using the multer
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).any() //for multi part form data
);

//making the images folder to be accesible accross the web
app.use("/images", express.static(path.join(__dirname, "images")));

// Solving the CORS errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Allowing the access from all the domains
  //allowing the following methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  //allowing the all headers
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

//using the consumer routes
app.use("/consumer", consumerAuthRoutes);

//using the seller authorization routes
app.use("/seller", sellerAuthRoutes);

//using the validator routes
app.use("/validator", validatorRoutes);

//using the seller Regular routes
app.use("/seller", sellerRegularRoutes);

//using the validator Regular routes
app.use("/validator", validatorRegularRoutes);

//using the consumer Regualr routes
app.use("/consumer", consumerRegularRoutes);

//order routes
app.use("/consumer",consumerOrderRoutes);

//connnecting the mongodb
mongoConnect(() => {
  app.listen(process.env.PORT || 8080);
});
