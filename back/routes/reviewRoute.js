import { Router } from 'express';
import { protect, allowedTo } from '../controller/authController.js';
import { createReviewValidator } from '../utils/validator/reviewValidator.js';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  setProductIdAndUserIdToBody
} from '../controller/reviewController.js';

// ✅ لازم يكون قبل استخدام router
const router = Router({ mergeParams: true }); 
// ⬅️ ده بيمكّننا نقرأ params من راوتر تاني (زي productId)


router.route('/')   //make one route to hold all stuff 
  .get(getProductReviews)
  .post(
    protect,
    allowedTo('user'),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );


  // this nessary even i have made mergeParams 
  
router
.route('/:id')
.patch(protect, allowedTo('user', 'admin'), updateReview)
.delete(protect, allowedTo('user', 'admin'), deleteReview);

export default router;
