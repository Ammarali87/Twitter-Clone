import { Router } from 'express';
 import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile
} from '../controller/profileController.js';
import { profileUpdateValidation} from "../utils/validator/profileValidator.js"

const router = Router();
 

  
router
  .route('/me')
  .get(getMyProfile)
  .patch(profileUpdateValidation, updateMyProfile)
  .delete(deleteMyProfile);


  export default router;