import { Router } from "express";
import { 
  createProduct,
  getAllProducts,    // ✅ Changed from getProducts
  getProduct,
  updateProduct,
  deleteProduct
} from "../controller/productController.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
} from '../utils/validator/prodcutValidate.js';

import { allowedTo, protect } from "../controller/authController.js";

const router = Router();

// Public routes - no authentication needed
router.get("/", getAllProducts);  // ✅ Changed from getProducts
router.get("/:id", getProductValidator, getProduct);

router.use(protect);   // can add to all  only regesters can view


   // i forgot  upload.single("imageCover"),
router  // add 3 stuff 
  .route("/add-product") 
  .post(    //  remove protect do not add many 
    allowedTo("admin", "manager"), // Only allow admin/manager roles
    upload.single("imageCover"),
    createProductValidator
  );   

 
router
.route("/:id")
.put(
  allowedTo("admin", "manager"),
  updateProductValidator,
  updateProduct
)
.delete(
  allowedTo("admin"), // Only admin can delete
 deleteProductValidator, deleteProduct
);

//////////////////

// Only authenticated users


// Admin or manager
router.post("/products",
    allowedTo("admin", "manager"), createProduct);

// Multiple roles with different HTTP methods
// router.route("/orders") .get( allowedTo("admin " , "manager" , "user" ))
//   .get( allowedTo("admin", "manager", "user")) // All can view
//   .post( allowedTo("user")) // Only users can create
//   .delete( allowedTo("admin")); // Only admin can delete




export default router;







