import Brand from "../models/BrandModel.js";
import { getAll, getOne, createOne,
  updateOne, deleteOne } from './handlersFactory.js';

export const getAllBrands = getAll(Brand, 'Brand');
export const getBrand = getOne(Brand, { path: 'reviews' });
export const createBrand = createOne(Brand);
export const updateBrand = updateOne(Brand);
export const deleteBrand = deleteOne(Brand);




// import slugify from "slugify";
// import ApiError from "../utils/ApiError.js";
// import cloudinary from "../config/cloudinaryConfig.js";


// export const CreateBrand = async (req, res, next) => {
//   try { 
//     const { name } = req.body;
//     if (!name) return next(new ApiError(400, "Brand name is required"));

//     let imageUrl = ""; // يمكن أن يكون فارغًا إذا لم يتم رفع صورة

//     if (req.file) {
//       // رفع الصورة إلى Cloudinary إذا تم رفعها
//       const result = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "brands" },
//           (error, result) => {
//             if (error) reject(new ApiError(500, "Error uploading image"));
//             else resolve(result);
//           }
//         );
//         stream.end(req.file.buffer);
//       });

//       imageUrl = result.secure_url;
//     }

//     const newBrand = await Brand.create({
//       name,
//       slug: slugify(name, { lower: true, strict: true }),
//       image: imageUrl || "https://via.placeholder.com/150", // صورة افتراضية إذا لم يتم رفع صورة
//     });

//     console.log("Created Brand:", newBrand);
//     res.status(201).json({ status: "success", newBrand });
//   } catch (error) {
//     console.error("Error adding Brand:", error);
//     next(new ApiError(500, "Error adding Brand"));
//   }
// };

// // جلب جميع العلامات التجارية مع التصفية والتقسيم إلى صفحات
// export const getBrands = async (req, res, next) => {
//   try {  
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const skip = (page - 1) * limit;

//     const totalCount = await Brand.countDocuments();
//     const brands = await Brand.find().skip(skip).limit(limit);

//     res.status(200).json({
//       status: "success",
//       result: brands.length,
//       page,
//       totalPages: Math.ceil(totalCount / limit),
//       totalCount, 
//       data: brands,
//     });
//   } catch (error) {
//     console.error("Error fetching brands:", error);
//     next(new ApiError(500, "Error fetching brands"));
//   }
// };

// // جلب علامة تجارية واحدة
// export const getOneBrand = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const brand = await Brand.findById(id);

//     if (!brand) return next(new ApiError(404, "Brand not found"));

//     res.status(200).json({ status: "success", brand });
//   } catch (error) {
//     console.error("Error fetching Brand:", error);
//     next(new ApiError(500, "Error fetching Brand"));
//   }
// };

// // حذف علامة تجارية
// export const deleteBrand = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const brand = await Brand.findByIdAndDelete(id);
//     if (!brand) return next(new ApiError(404, "Brand not found"));

//     res.status(200).json({ status: "success Deleted", message: "Brand deleted successfully", brand });
//   } catch (error) {
//     console.error("Error Deleting Brand:", error);
//     next(new ApiError(500, "Error deleting Brand"));
//   }
// };

// // تحديث علامة تجارية
// export const updateBrand = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;
//  // Check if name is provided
//  if (!name  || !id) {
//   return next(new ApiError(400, "Nothing to update : name and id  is required"));
// }

// // First find the existing brand
// const existingBrand = await Brand.findById(id);
// if (!existingBrand) {
//   return next(new ApiError(404, "Brand not found"));
// }

// // Check if the new name is different from the existing name
// if (existingBrand.name === name) {
//   return res.status(400).json({ 
//     status: "fail",
//     message: "No changes needed - brand name is the same",
//     brand: existingBrand 
//   });
// }

//   const brand = await Brand.findOneAndUpdate(
//     { _id: id }, 
//     { 
//       name, 
//       slug: slugify(name, { lower: true }) 
//     },    
//     { new: true } 
//   );

//   if (!brand) return next(new ApiError(404, "Brand not found"));

//   res.status(200).json({ status: "success Update", brand });
// });



