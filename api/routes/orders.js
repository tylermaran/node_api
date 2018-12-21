const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/products');

// GET request
router.get('/', (req, res, next) => {
    Order.find().select('-__v')
        .populate('product', 'name')
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                count: result.length,
                orders: result.map(result => {
                    return {
                        _id: result._id,
                        quantity: result.quantity,
                        product: result.product,
                        request: {
                            type: 'GET',
                            URL: 'http://localhost:3000/orders/' + result._id
                        }
                    }
                }),

            });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                error: err
            })
        });
});

// POST request
router.post('/', (req, res, next) => {
    // making sure we can't create orders for products we don't have
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "404 - Product not found"
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        }).then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order Saved',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error product not found",
                error: err
            });
        })
});

// Get Individual item
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: '404 - Order Not Found'
                })
            }
            res.status(200).json({
                order: result,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "500 - Not found",
                error: err
            })
        });
});

// Delete Individual Item
router.delete('/:orderId', (req, res, next) => {
    Order.remove({
            _id: req.params.orderId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {
                        productId: 'ID',
                        quantity: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "500 - Not found",
                error: err
            })
        })
});

module.exports = router;