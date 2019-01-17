const express = require('express');
const router = express.Router();

// requiring our authorization check middleware
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

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

// no authorization needed on the get all request 
router.get('/', ProductController.get_all_products);

// POST - Creating a new item (required checkauth)
router.post('/', checkAuth, upload.single('productImage'), ProductController.product_new);

// GET - individual id (no authorization required)
router.get('/:productId', ProductController.product_detail);

// Patch route (requires checkAuth)
router.patch('/:productId', checkAuth, ProductController.product_edit);

// Delete route (requires checkAuth)
router.delete('/:productId', checkAuth, ProductController.product_delete);

module.exports = router;