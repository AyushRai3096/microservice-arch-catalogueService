const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const errorMessages = require('./en');
const appConfigs = require('./app-config')

//import routers
const productRouter    = require('./Routes/productsRoute');


const app = express();

//use middlewares
app.use(cors());
app.use(bodyParser.json());

//register routes
app.use("/products", productRouter)


//default error for unknown route
app.use((req, res, next) => {
    const error = new Error(errorMessages.ROUTE_NOT_FOUND)
    error.statusCode = 404;
    throw error;
});


//error handling middleware
app.use((error, req, res, next) => {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    console.log(error.message);
    res.status(error.statusCode).send(error.message);
});

//define port 
var port = process.env.PORT || 5001;

//connect mongodb and start server
mongoose.connect(appConfigs.mongoDbUrl).then(result => {
    console.log("Connected to mongo db")
    app.listen(port)
}).catch(err => {
    console.log(err)
});
