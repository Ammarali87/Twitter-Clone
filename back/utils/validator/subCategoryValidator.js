import slugify from 'slugify';
import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';

export const getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id format'),
  validationMiddleware,
];

export const createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory name is required')
    .isLength({ min: 2 })
    .withMessage('Too short Subcategory name')
    .custom((val, { req }) => {
      if (!val) return false; // extra check instead of if else
      req.body.slug = slugify(val);
      return true;
    }),
  check('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid Category id format'),
  validationMiddleware,
];

export const updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id format'),
  check('name')
    .optional() 
    .isLength({ min: 2 })
    .withMessage('Too short Subcategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];

export const deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid SubCategory id format'),
  validationMiddleware,
];