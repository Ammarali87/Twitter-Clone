import { Router } from "express";
import { 
  createCategory,
  getAllCategories,    // ✅ Changed from getProducts
  getCategory,
  updateCategory, 
  deleteCategory 
  // searchCategories, 
  // theFuzzySearch, 
} from "../controller/storeController.js";
import upload from "../middleware/uploadMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import { validateDelete, validateId, validateUpdate } from "../utils/validator/validateId.js";

const router = Router();

// ✅ إضافة كاتيجوري
router.post("/add-category",
   upload.single("image"), createCategory);

// ✅ جلب كل الكاتيجوريز
router.get("/categories", getAllCategories);

// ✅ جلب كاتيجوري واحد عن طريق الـ ID
router.get("/category/:id", validateId, validationMiddleware, getCategory);

// ✅ البحث
// router.get("/search", searchCategories);
// router.get("/fuzzy-search", theFuzzySearch);

// ✅ تحديث وحذف كاتيجوري باستخدام ID
router
  .route("/:id")
  .put(validateUpdate, validationMiddleware, updateCategory)
  .delete(validateDelete, validationMiddleware, deleteCategory);

export default router;
