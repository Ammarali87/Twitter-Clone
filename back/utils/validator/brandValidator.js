import slugify from 'slugify';
import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';

export const getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validationMiddleware,
];

export const createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 2 })
    .withMessage('Too short brand name')
    .isLength({ max: 32 })
    .withMessage('Too long brand name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];

export const updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  check('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Too short brand name')
    .isLength({ max: 32 })
    .withMessage('Too long brand name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];

export const deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format'),
  validationMiddleware,
];