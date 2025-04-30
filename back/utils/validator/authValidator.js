import validationMiddleware from "../../middleware/validationMiddleware.js"
import { check } from 'express-validator';

 export const userUpdateValidation = [
  check('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  check('email').optional().isEmail().withMessage('Please provide a valid email'),
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validationMiddleware
];

// Existing validation rules
 export const signupValidation = [
  check('name').trim().notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validationMiddleware
];

 export const resetPasswordValidation = [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('code').notEmpty().withMessage('Verification code is required'),
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validationMiddleware
];

// Add this with other validation rules
 export const verifyCodeValidation = [
  check('code')
    .notEmpty()
    .withMessage('Code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must be 6 digits'),
  validationMiddleware
];