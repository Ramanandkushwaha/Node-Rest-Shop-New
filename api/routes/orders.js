const express = require('express');
const router = express.Router();

const chechAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');


router.get('/', chechAuth, OrdersController.orders_get_all );

router.post('/', chechAuth, OrdersController.orders_create_order);

router.get('/:orderId', chechAuth, OrdersController.orders_get_order);

router.delete('/:orderId', chechAuth, OrdersController.orders_delete_order);



module.exports = router;