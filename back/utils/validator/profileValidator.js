import { check } from 'express-validator';
import validationMiddleware from "../../middleware/validationMiddleware.js"
import { User } from '../../models/userModel.js';

export const profileUpdateValidation = [
    check('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    
    check('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email')
      .custom(async (email, { req }) => {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
          throw new Error('Email already in use');
        }
        return true;
      }),
      
    check('phone')
      .optional()
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid phone number with country code'),
      
    check('address')
      .optional()
      .isObject()
      .withMessage('Address must be an object'),
      
    validationMiddleware
  ];