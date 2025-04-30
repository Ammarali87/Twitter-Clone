import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';

export const createReviewValidator = [
  check('product')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  
  check('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
    
  check('comment')
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
    
  validationMiddleware
];