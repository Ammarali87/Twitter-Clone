import { Router } from 'express';
 import {   allowedTo } from '../controller/authController.js';
 import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controller/userController.js';
import { userUpdateValidation} from "../utils/validator/userValidator.js"

const router = Router();

 router.use(allowedTo('admin'));


  
router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .get(getUser)
  .patch(userUpdateValidation, updateUser)
  .delete(deleteUser);

export default router;