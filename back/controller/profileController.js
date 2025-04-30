import { User } from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/catchAsync.js';
import { sanitizeUser } from '../utils/sanitizeData.js';

// Get logged in user profile
export const getMyProfile = asyncHandler(async (req, res) => {
  // req.user is already available from protect middleware
  const user = await User.findById(req.user._id);
  
  res.status(200).json({
    status: 'success',
    data: sanitizeUser(user)
  });
});

// Update logged in user profile
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  // Prevent password update on this endpoint
  if (req.body.password) {
    throw new ApiError(400, 'This route is not for password updates. Please use /updateMyPassword');
  }  

  // Build update object with only allowed fields
  const updateData = {
    name: name || req.user.name,
    email: email || req.user.email,
    phone: phone || req.user.phone,
    address: address || req.user.address
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,  
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: sanitizeUser(updatedUser)
  });
});

// Delete logged in user (deactivate)
export const deleteMyProfile = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null
  });
});