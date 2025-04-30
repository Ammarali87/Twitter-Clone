import { check } from 'express-validator';
import validatorMiddleware from '../../middleware/validatorMiddleware.js';

export const createWishlistValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid Product ID format'),
  validatorMiddleware,
];

export const updateWishlistValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid Product ID format'),
  validatorMiddleware,
];

export const deleteWishlistValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid Product ID format'),
  validatorMiddleware,
];
