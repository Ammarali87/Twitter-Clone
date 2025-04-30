import slugify from 'slugify';
import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';
import Category from '../../models/CategoryModel.js';
// استخدام الاختزال (req.body.slug = slugify(val),
//  true) بدلًا من return true.
// const Delete = [idValidation,
//   check("id"),check("titiel")]
// export {
//   createProductValidator,
//   updateProductValidator,
//   deleteProductValidator,
//   getProductValidator,
// };




// إعادة استخدام التحقق من الـ ID
const idValidation = check('id').isMongoId().withMessage('Invalid ID format');

// دالة للتحقق من وجود الكاتيجوري
const categoryExistsValidation = check('category')
  .isMongoId().withMessage('Invalid category ID format')
  .bail() // stop the chain if the previous check failed
  .custom(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error('Category not found');
    return true;
  });

// التحقق المشترك للعناصر الاختيارية
const optionalMongoId = (field) => check(field).optional().isMongoId().withMessage(`Invalid ${field} ID format`);


// قواعد التحقق عند إنشاء المنتج
const createProductValidator = [
  check('title')
    .notEmpty().withMessage('Product title is required')
    .isLength({ min: 3 }).withMessage('Product title must be at least 3 characters')
    .custom((val, { req }) =>
       (req.body.slug = slugify(val), true)),
    check('description')
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

  check('quantity')
    .notEmpty().withMessage('Product quantity is required')
    .isNumeric().withMessage('Product quantity must be a number'),

    check('price')
    .notEmpty().withMessage('Product price is required')
    .isFloat({ min: 0 }).withMessage('Price cannot be negative'),

    categoryExistsValidation,
  optionalMongoId('brand'),

  validationMiddleware,
];

// قواعد التحقق عند تحديث المنتج
const updateProductValidator = [
  idValidation,
  check('title').optional().custom((val, { req }) => (req.body.slug = slugify(val), true)),
  optionalMongoId('category'),
  optionalMongoId('brand'),
  validationMiddleware,
];

// قواعد التحقق عند حذف أو استرجاع المنتج
const deleteProductValidator = [idValidation, validationMiddleware];
const getProductValidator = [idValidation, validationMiddleware];

export {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
};
