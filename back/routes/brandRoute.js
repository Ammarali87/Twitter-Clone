import { Router } from "express";
import { 
  createBrand,
  getAllBrands,    // ✅ Changed from getBrands
  getBrand,
  updateBrand,
  deleteBrand
} from "../controller/BrandController.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
} from '../utils/validator/brandValidator.js';

const router = Router();

// Public routes
router.get("/", getAllBrands);  // ✅ Changed from getBrands
router.get("/:id", getBrandValidator, getBrand);

// // Protected routes

router.post(
  "/add-brand",  // Change this to "/add-brand" (lowercase)
  createBrandValidator,
  upload.single("imageCover"),
  createBrand
);


router
  .route("/:id")
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;