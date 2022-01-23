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


//importing the consumer routes to use all consumer related routes
const consumerRoutes = require("./routes/consumer");
//importing the seller routes to use all the seller related routes
const sellerRoutes = require("./routes/seller");
//importing the validator routes to use the validator related routes
const validatorRoutes = require("./routes/validator");


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
app.use("/consumer", consumerRoutes);
//using the seller routes
app.use("/seller", sellerRoutes);
//using the validator routes
app.use("/validator", validatorRoutes);

//connnecting the mongodb 
mongoConnect(() => {
  app.listen(process.env.PORT || 8080);
});
