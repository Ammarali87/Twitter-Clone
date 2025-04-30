import { getAll, getOne, createOne,
   updateOne, deleteOne } from './handlersFactory.js';
import Product from '../models/productModel.js';

export const getAllProducts = getAll(Product, 'Product');
export const getProduct = getOne(Product, { path: 'reviews' });
//  {path :"reviews"}  for popluatOpoti 
export const createProduct = createOne(Product);
export const updateProduct = updateOne(Product);
export const deleteProduct = deleteOne(Product);




// // Get featured products
// export const getFeaturedProducts = catchAsync(async (req, res) => {
//   const products = await Product.find({ featured: true })
//     .limit(8)
//     .populate('category');

//   res.status(200).json({
//     status: 'success',
//     results: products.length,
//     data: products
//   });
// });








// import Product from '../models/ProductModel.js';
// import Category from '../models/CategoryModel.js';
// import slugify from 'slugify';
// import ApiError from '../utils/ApiError.js';
// import catchAsync from '../utils/catchAsync.js';
// import cloudinary from "../config/cloudinaryConfig.js";
// import ApiFeatures from '../utils/ApiFeatures.js';

//   // after update and Delete make if (!product) {
//     // return next(new ApiError(404, 'Product not found'));
//   // }  


// // Create new product

// export const createProduct = catchAsync(async (req, res, next) => {
//   // 1. Get all fields from request body
//   const productData = { ...req.body };
  
//   // 2. Generate slug from title
//   if (productData.title) {
//     productData.slug = slugify(productData.title, { lower: true });
//   }

//   // 3. Create product
//   const product = await Product.create(productData);

//   // 4. Check if product was created
//   if (!product) {
//     return next(new ApiError(404, 'Product not Created'));
//   }

//   // 5. Send response
//   res.status(201).json({
//     status: 'success',
//     data: product
//   });
// });

// // export const createProduct = catchAsync(async (req, res, next) => {
// //   const { title, description, quantity, price, category, brand, imageCover } = req.body;

// //   // move existCategory to Vaildate middware 

// //   // Remove the image URL concatenation
// //   const product = await Product.create({
// //     title,
// //     slug: slugify(title, { lower: true }),
// //     description,
// //     quantity,
// //     price,
// //     category,
// //     brand,
// //     imageCover // Use the image URL directly
// //   });
// //    // optional 
// //   if (!product) {
// //     return next(new ApiError(404, 'Product not Created'));
// //   }




// // get all products
// export const getProducts = catchAsync(async (req, res) => {
//   // Create base query without executing it
//   const baseQuery = Product.find()
//     .populate('category', 'name -_id')
//     .populate('brand', 'name -_id');
  
//   // Get filtered count for accurate pagination
//   const filterInstance = new ApiFeatures(Product.find(), req.query).filter();
//   const filteredCount = await filterInstance.query.countDocuments();
  
//   // Apply all API features to the base query
//   const features = new ApiFeatures(baseQuery, req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate(filteredCount);

//   // Execute the final query
//   const products = await features.query;

//   // Send response
//   res.status(200).json({
//     status: "success",
//     results: products.length,
//     pagination: features.paginationReslut,
//     data: products
//   });
// });



// export const getProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findById(req.params.id)
//     .populate({
//       path: 'category',
//       select: 'name -_id'
//     });

//   if (!product) {
//     return next(new ApiError(404, 'Product not found'));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: product
//   });
// });




// // Update product
// export const updateProduct = catchAsync(async (req, res, next) => {
//   const { title } = req.body;
//   if (title) {
//     req.body.slug = slugify(title, { lower: true });
//   }  

//   const product = await Product.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true, runValidators: true }
//   );

//   if (!product) {
//     return next(new ApiError(404, 'Product not found'));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: product
//   });
// });

// // Delete product
// export const deleteProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndDelete(req.params.id);

//   if (!product) {
//     return next(new ApiError(404, 'Product not found'));
//   }

//   res.status(200).json({
//     status: 'success',
//     message: 'Product deleted successfully'
//   });
// });

// // Search products
// export const searchProducts = catchAsync(async (req, res) => {
//   const { query } = req.query;
  
//   const products = await Product.find({
//     $or: [
//       { title: { $regex: query, $options: 'i' } },
//       { description: { $regex: query, $options: 'i' } }
//     ]
//   });

//   res.status(200).json({
//     status: 'success',
//     results: products.length,
//     data: products
//   });
// });

// // Get featured products
// export const getFeaturedProducts = catchAsync(async (req, res) => {
//   const products = await Product.find({ featured: true })
//     .limit(8)
//     .populate('category');

//   res.status(200).json({
//     status: 'success',
//     results: products.length,
//     data: products
//   });
// });

// // Update product rating
// export const updateProductRating = catchAsync(async (req, res, next) => {
//   const { rating, message } = req.body;
  
//   const product = await Product.findById(req.params.id);
  
//   if (!product) {
//     return next(new ApiError(404, 'Product not found'));
//   }

//   // Calculate new rating average
//   const newRatingsQuantity = product.ratingsQuantity + 1;
//   const newRatingsAverage = 
//     (product.ratingsAverage * product.ratingsQuantity + rating) / newRatingsQuantity;

//   const updatedProduct = await Product.findByIdAndUpdate(
//     req.params.id,
//     {
//       ratingsAverage: newRatingsAverage,
//       ratingsQuantity: newRatingsQuantity,
//       $push: { 
//         ratingMessages: {
//           user: req.user._id,
//           message,
//           rating
//         }
//       }
//     },
//     { new: true }
//   );

//   res.status(200).json({
//     status: 'success',
//     data: updatedProduct
//   });
// });
