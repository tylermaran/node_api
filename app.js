const express = require('express');
const app = express();
// require package logging - morgan
const morgan = require('morgan');
// require bodyparser - allows us to use req.body.whatever
const bodyParser = require('body-parser');
// setup mongoose - will run the MongoDB client as well as schemas and validation
const mongoose = require('mongoose');

// importing routes - add a new const for each of our routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// connect to mongoose and you need to pass a path
// You also need to change out the password here for your database password
// to do this properly, create a process.env file
// url... + process.env.MONGO_PASSWORD + ...url
mongoose.connect('mongodb://testing:' +
    process.env.MONGO_PW +
    '@node-api-app-shard-00-00-k8f4b.mongodb.net:27017,node-api-app-shard-00-01-k8f4b.mongodb.net:27017,node-api-app-shard-00-02-k8f4b.mongodb.net:27017/test?ssl=true&replicaSet=node-api-app-shard-0&authSource=admin&retryWrites=true', {
        useNewUrlParser: true
    });

// running morgan in dev mode
app.use(morgan('dev'));

// running bodyparser - apparently no longer necessary in newer version of Express
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Preventing any CORS Errors 
// the '*' will give all access
// you could do 'https://www.clubfinder.com - and only that page would have access
// PUT, POST, PATCH, DELETE, GET are all the allowed methods
app.use((res, req, next) => {
    res.header('Access-Control-Alllow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.status(200).json({});
    }
    next();
});

// use, as a method, sets up a middleware
// an incoming request has to go through app.use and to whatever we pass to it
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling: if you reach this line, it is because the request did not meet any of the 
// previous routes (/products, /orders, etc.)
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    // using the next message to forward the error
    next(error);
});

// This will be our error handing middleware. This allows us to throw errors from anywhere in the app
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;