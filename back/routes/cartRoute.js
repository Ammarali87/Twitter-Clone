import { Router } from 'express';
import { protect, allowedTo } from '../controller/authController.js';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  applyCoupon // Add this import
} from '../controller/cartController.js';
import { 
  addToCartValidator,
  removeFromCartValidator,
  updateCartItemValidator,
  applyCouponValidator // Add this import
} from '../utils/validator/cartValidator.js';

const router = Router();

// Protect all cart routes
router.use(protect);
router.use(allowedTo('user'));

router.route('/')
  .get(getCart)
  .post(addToCartValidator, addToCart)
  .delete(clearCart);

router.route('/:itemId')
  .delete(removeFromCartValidator, removeFromCart)
  .patch(updateCartItemValidator, updateCartItemQuantity);

// Add coupon route
router.put('/applyCoupon', applyCouponValidator, applyCoupon);

export default router;