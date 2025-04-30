import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';

export const addToCartValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  check('quantity')
    .optional()
    // .isFloat({ min: 1 })  
    .isInt({ min: 1 })// prevent neg- 
    // The quantity cannot be zero (0)
    // The quantity cannot be negative (-1, -2, etc.)
    // The minimum allowed quantity is 1
    .withMessage('Quantity must be a positive number'),
  validationMiddleware
];

export const removeFromCartValidator = [
  check('itemId')
    .isMongoId()
    .withMessage('Invalid cart item ID format'),
  validationMiddleware
];

export const updateCartItemValidator = [
  check('itemId')
    .isMongoId() 
    .withMessage('Invalid cart item ID format'),
  check('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive number'),
  validationMiddleware
];  


export const applyCouponValidator = [
  check('coupon')
    .notEmpty()
    .withMessage('Coupon code is required')
    .isString()
    .withMessage('Coupon must be a string'),
  validationMiddleware
];