const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// requiring our authorization check middleware
const checkAuth = require('../middleware/check-auth');

// Requiring multer and initializing it 
const multer = require('multer');
// storage basically allows you to adjust storage settings (name folder etc)
const storage = multer.diskStorage({
    // multer will execute these two functions whenever a new file is received
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    // accept an incoming file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);  
    } else {
        // reject an incoming file
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// importing our product schema from the models folder
const Product = require('../models/products');

// no authorization needed on the get all request 
router.get('/', (req, res, next) => {
    // find, with no input, will find all data
    Product.find()
        .select('name price _id productImage') // you can select which fields you want to include
        .exec()
        .then(docs => {
            // sending additional information back to the user
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
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

// POST - Creating a new item (required checkauth)
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    // using the multer middleware we have the req.file option
    console.log(req.file);
        // with this req.file, you get a lot of data - including the file.path
    // create new instance - use the Product model as a constructor
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
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

// GET - individual id (no authorization required)
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

// Patch route (requires checkAuth)
router.patch('/:productId', checkAuth, (req, res, next) => {
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

// Delete route (requires checkAuth)
router.delete('/:productId', checkAuth, (req, res, next) => {
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