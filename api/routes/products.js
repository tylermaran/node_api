const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// importing our product schema from the models folder
const Product = require('../models/products');

router.get('/', (req, res, next) => {
    // find, with no input, will find all data
    Product.find()
        .select('name price _id') // you can select which fields you want to include
        .exec()
        .then(docs => {
            // sending additional information back to the user
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id // adding a url
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
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
    product.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id // adding a url
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// Get route
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec().then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: "Not found"
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

// Patch route
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    console.log(id);
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findByIdAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(results => {
            console.log(results);
            res.status(200).json(results);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

// Delete route
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;