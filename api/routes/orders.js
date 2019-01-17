const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

// GET request (requires checkAuth)
router.get('/', checkAuth, OrdersController.orders_get_all);

// POST request (requires checkauth)
router.post('/', checkAuth, OrdersController.orders_post_new);

// Get Individual item detail (requires checkAuth)
router.get('/:orderId', checkAuth, OrdersController.orders_detail);

// Delete Individual Item (requires checkAuth)
router.delete('/:orderId', checkAuth, OrdersController.delete_order);

module.exports = router;