import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';
import { User } from '../../models/userModel.js'; // Fixed import with .js extension


export const addAddressValidator = [
  check('street')
    .notEmpty()
    .withMessage('Street address is required')
    .isLength({ min: 3 })
    .withMessage('Street address too short')
    .isLength({ max: 100 })
    .withMessage('Street address too long')
    .custom(async (street, { req }) => {
        const user = await User.findById(req.user._id);
        
        const isDuplicateStreet = user.addresses.some(address => 
          address.street.toLowerCase() === street.toLowerCase()
        );
  
        if (isDuplicateStreet) {
          throw new Error('This street address already exists in your addresses');
        }
        return true;
      }),

  check('city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2 })
    .withMessage('City name too short')
    .isLength({ max: 50 })
    .withMessage('City name too long'),

  check('state')
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2 })
    .withMessage('State name too short')
    .isLength({ max: 50 })
    .withMessage('State name too long'),

  check('zipCode')
    .notEmpty()
    .withMessage('Zip code is required')
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/)
    .withMessage('Invalid zip code format'),

  check('country')
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2 })
    .withMessage('Country name too short')
    .isLength({ max: 15 })
    .withMessage('Country name too long'),

  validationMiddleware,
];

export const removeAddressValidator = [
  check('addressId')
    .isMongoId()
    .withMessage('Invalid address ID format'),
  validationMiddleware,
];