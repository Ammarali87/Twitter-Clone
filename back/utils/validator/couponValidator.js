import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';

export const createCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('Coupon name is required')
    .custom((val) => /^[A-Z0-9]{4,}$/.test(val))
    .withMessage('Coupon name must be uppercase and at least 4 characters'),
  
  check('expire')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isDate()
    .withMessage('Invalid date format')
    .custom((val) => new Date(val) > new Date())
    .withMessage('Expiry date must be in the future'),
    
  check('discount')
    .notEmpty()
    .withMessage('Discount value is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
    
  validationMiddleware
];

export const updateCouponValidator = [
  check('id').isMongoId().withMessage('Invalid Coupon id format'),
  validationMiddleware
];

export const deleteCouponValidator = [
  check('id').isMongoId().withMessage('Invalid Coupon id format'),
  validationMiddleware
];