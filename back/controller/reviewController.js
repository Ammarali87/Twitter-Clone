import { getAll, getOne, createOne, updateOne, deleteOne } from './handlersFactory.js';
import Review from '../models/ReviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';


// Nested route
// GET /api/v1/products/:productId/reviews
export function createFilterObj(req, res, next) {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
}

export const getProductReviews = getAll(Review);

export const getReview = getOne(Review);

// Nested route (Create)
export const setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
}


export const createReview = createOne(Review);

export const updateReview = updateOne(Review);

export const deleteReview = deleteOne(Review);


