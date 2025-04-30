import { Router } from 'express';
import { protect, allowedTo } from '../controller/authController.js';
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  cancelOrder,
  updateOrder
} from '../controller/orderController.js';

const router = Router();

// Protect all order routes  can remove if whant
// router.use(protect);    remove i have protect in app.js 


// User routes

router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Order routes working correctly 🚀',
  });
});

router.post('/', allowedTo('user'), createOrder);
router.get('/my-orders', allowedTo('user'), getMyOrders);
router.patch('/cancel/:id', allowedTo('user'), cancelOrder);
  // i love to forgot  orders/
  // in {{BaseURL}}orders/cancel/6807f1fdc3b127baf8a7f4dd


// Admin routes   // we add /orders in app.js with orderFunc 
router.use(allowedTo('admin', 'manager'));
router.get('/', getAllOrders);
router.patch('/:id', updateOrder);

export default router;