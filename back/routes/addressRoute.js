import { Router } from 'express';
import {
  addAddress,
  removeAddress,
  getLoggedUserAddresses
} from '../controller/addressService.js';

import { addAddressValidator, removeAddressValidator } from '../utils/validator/addressValidator.js';

const router = Router();

router.route('/')
  .post(addAddressValidator,addAddress)
  .get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddressValidator,removeAddress);

export default router;