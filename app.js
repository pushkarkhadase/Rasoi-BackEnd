const express = require('express');

const consumerRoutes = require('./routes/consumer');

const app = express();

app.use('/consumer', consumerRoutes);

app.listen(8080);