const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require("./util/database").mongoConnect;

const consumerRoutes = require('./routes/consumer');

const app = express();

app.use(bodyParser.json()); //application/json

// Solving the CORS errors
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Allowing the access from all the domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})

app.use('/consumer', consumerRoutes);

mongoConnect(() => {
    app.listen(process.env.PORT || 8080);
  });