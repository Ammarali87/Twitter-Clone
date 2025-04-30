import { Router } from 'express';
import {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} from '../controller/WishlistController.js';
import {  allowedTo } from '../controller/authController.js';
import {
  createWishlistValidator,
  deleteWishlistValidator,
} from '../utils/validator/WishlistValidator.js';

const router = Router();

  router.use(allowedTo('user'));


 router
  .route('/')
  .get(getLoggedUserWishlist) // Get my wishlist
  .post(createWishlistValidator, addProductToWishlist); // Add to wishlist

router   
  .route('/:productId')
  .delete(deleteWishlistValidator, removeProductFromWishlist); // Remove from wishlist

export default router;
