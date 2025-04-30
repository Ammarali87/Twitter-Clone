import asyncHandler from 'express-async-handler';
import logger from '../config/logger.js';
import { User } from '../models/userModel.js'; // Fixed import with .js extension

// no update for address

  export const addAddress = asyncHandler(async (req, res, next) => {
  logger.info('try Adding new address', { 
    userId: req.user._id,
    address: req.body 
  });
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  logger.info('Address added successfully', { userId: user._id });
  res.status(200).json({
    status: 'success',
    message: 'Address added successfully.',
    data: user
  });
});


// export const removeAddress = asyncHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $pull: { addresses: { _id: req.params.addressId } },
//     },    
//     { new: true }
//   );

//   if (!user || !user.addresses) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'User or address not found'
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     message: 'Address removed successfully.',
//     data: user
//   });
// });

export const removeAddress = asyncHandler(async (req, res, next) => {
  // First get the user with their addresses
  const user =
   await User.findById(req.user._id);
  
  if (!user) {  // optional check for user existence
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  // Check if address exists
  //  before trying to remove it
  const addressExists =
   user.addresses.some(
    address => address._id.toString()
     === req.params.addressId
  );

  if (!addressExists) {
    return res.status(404).json({
      status: 'error',
      message: 'Address not found'
    });
  }

  // If address exists, proceed with removal
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },    
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Address removed successfully.',
    data: user
  });
});


export const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
  
    res.status(200).json({
      status: 'success',
      results: user.addresses?.length || 0,
      data: user.addresses || []
    });  
  });










// import asyncHandler from 'express-async-handler';
// import { findByIdAndUpdate, findById } from '../models/userModel';

// //   same as wishlist 
// // return relust {ok:1 }   not return full objec   
// // findbyIdandIpdate  designed to update by _id field


// // @desc    Add address to user addresses list
// // @route   POST /api/v1/addresses
// // @access  Protected/User

// import logger from '../config/winston.js';
// import { User } from '../models/userModel.js';


// export const addAddress = asyncHandler(async (req, res, next) => {
//   // $addToSet => add address object to user addresses array if address not exist
//   logger.info('try Adding new address', { 
//     userId: req.user._id,
//     address: req.body 
//   });
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $addToSet: { addresses: req.body },
//     },
//     { new: true }
//   );
 
//   logger.info('Address added successfully', { userId: user._id });
//   res.status(200).json({
//     status: 'success',
//     message: 'Address added successfully.',
//     data: user.addresses,
//   });
// });


// // export const addAddress = asyncHandler(async (req, res, next) => {
// //   // $addToSet => add address object to user addresses  array if address not exist
// //   logger.info('try Adding new address', { 
// //     userId: req.user._id,
// //     address: req.body 
// //   });
// //   const user = await findByIdAndUpdate(
// //     req.user._id,
// //     { // $addToSet not push to prevent duclate add
// //       $addToSet: { addresses: req.body },
// //     },
// //     { new: true }
// //   );
 
// //    // can add try catch  
// //    logger.info('Address added successfully', { userId: user._id });
// //   res.status(200).json({
// //     status: 'success',
// //     message: 'Address added successfully.',
// //     data: user.addresses,
// //   });
// // });


// // @desc    Remove address from user addresses list
// // @route   DELETE /api/v1/addresses/:addressId
// // @access  Protected/User

//    // use findByidandupdata
// export const removeAddress = asyncHandler(async (req, res, next) => {
//   // $pull => remove address object from user addresses array if addressId exist
//   const user = await findByIdAndUpdate(
//     req.user._id,
//     {
//       $pull: { addresses: { _id: req.params.addressId } },
//     },    
//     { new: true }
//   );

//   res.status(200).json({
//     status: 'success',
//     message: 'Address removed successfully.',
//     data: user.addresses,
//   });
// });



// // findById short hand word with , id ._id 
// // findOne work with all query like name email 



// // @desc    Get logged user addresses list
// // @route   GET /api/v1/addresses
// // @access  Protected/User

// export const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
//   const user = await 
//   findById(req.user._id).populate('addresses');
//    // popluta to get full details of address 
//   res.status(200).json({
//     status: 'success',
//     results: user.addresses.length,
//     data: user.addresses,
//   });  
// });