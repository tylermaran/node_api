const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// importing our product schema from the models folder
const Product = require('../models/products');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {

    // create new instance - use the Product model as a constructor
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    // use mongoose function 'save()' and chain 'exec' method
    // exec will turn this into a promise (nvm using .then) 
    product.save().then(result => {
        console.log(result);
    }).catch(err => console.log(err));


    res.status(200).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});

// Get route
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

// Patch route
router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    });
});

// Delete route
router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    });
});


module.exports = router;