import { check } from "express-validator";
import validationMiddleware from "../../middleware/validationMiddleware.js";

// ✅ التحقق من ID صالح لمونغو
export const validateId = [
  check("id").isMongoId().withMessage("Invalid ID"),
];

// ✅ التحقق من الاسم عند إضافة الفئة
export const validateCategory = [
  check("name")
    .notEmpty().withMessage("Category is required")
    .isLength({ min: 3 }).withMessage("Too short category")
    .isLength({ max: 12 }).withMessage("Too long category"),
];

// id check and togther name check isleng
// ✅ التحقق من ID + الاسم عند التحديث
export const validateUpdate = [
   check("id").isMongoId().withMessage("Invalid ID"),
   check("name")  
    .optional() // ✅ خلي الاسم اختياري عشان مش كل التحديثات بتحتاجه
    .isLength({ min: 3 }).withMessage("Too short category")
    .isLength({ max: 12 }).withMessage("Too long category"),
];

// ✅ التحقق من ID عند الحذف
export const validateDelete = [
  check("id").isMongoId().withMessage("Invalid ID"),
];
