import { Router } from 'express';
import {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controller/couponController.js';
import { protect, allowedTo } from '../controller/authController.js';
import {
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator
} from '../utils/validator/couponValidator.js';

const router = Router();

// Protect all routes
router.use(protect);
router.use(allowedTo('admin')); // Only admin can manage coupons

router.route('/')
  .get(getCoupons)
  .post(createCouponValidator, createCoupon);

router.route('/:id')
  .get(getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

export default router;