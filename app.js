const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

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

const mongoConnect = require("./util/database").mongoConnect;

const consumerRoutes = require("./routes/consumer");
const sellerRoutes = require("./routes/seller");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json()); //application/json
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).any()
  );
app.use("/images", express.static(path.join(__dirname, "images")));
// Solving the CORS errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Allowing the access from all the domains
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/consumer", consumerRoutes);
app.use("/seller", sellerRoutes);

mongoConnect(() => {
  app.listen(process.env.PORT || 8080);
});
