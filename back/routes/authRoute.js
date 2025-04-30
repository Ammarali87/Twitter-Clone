import { Router } from 'express';
import { 
  signup, 
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyCode
} from '../controller/authController.js';
import {signupValidation , verifyCodeValidation ,resetPasswordValidation }from "../utils/validator/authValidator.js"


const router = Router();




// router.post('/verify-email', verifyEmail);
// Auth routes with validation
router.post('/signup', signupValidation, signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCodeValidation, verifyCode);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.post('/change-password',
   resetPasswordValidation, changePassword);




   
export default router;

