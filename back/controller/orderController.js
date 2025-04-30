import Order from '../models/OrderModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/catchAsync.js';
import { getAll, getOne, createOne,
  updateOne, deleteOne } from './handlersFactory.js';

  

// db.mycollection.updateOne({name: "John"}, {$set: {age: 31}})
// show dbs
// // or
// show databases
// use mydatabase

// check   db
// show collections


// Create new order

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || !items.length) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  const orderData = {
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
  };

  const order = await Order.create(orderData);

  // ✅ نجيب السعر من المنتج
  await order.populate('items.product', 'title price');

  let totalPrice = 0;

  order.items.forEach(item => { 
      // nested object pirce not in same level like quantitiy 
    totalPrice += item.quantity *  item.product.price;
  });

  order.totalPrice = totalPrice;
  order.totalAmount = order.items.length;

  await order.save();

  res.status(201).json({
    status: 'success',
    data: {
      order,
      totalPrice,
    },
  });
});





export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
    status: 'pending'
  });   
  //   //or 
  //     // const order = await Order.findByIdAndUpdate(
  //     // {req.params.id}, not req.user._id
  //     // {status: req.body.status},
  //     // {new :true , runValidators:true}

  if (!order) {
    return next(new ApiError(404, 'Order not found or cannot be cancelled'));
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order has been cancelled successfully',
    data: order
  });
});
 
// Update order status (admin only)

// لو انت ما بعتش shippingAddress،
//  هيروح يعملها undefined وبالتالي ممكن يمسح العنوان القديم
//  بالغلط 😓

// Update order status and address (admin only) and shippingAddress
export const updateOrder = asyncHandler(async (req, res) => {
  // Get order ID and data from the request
  const { status, shippingAddress } = req.body;

  // Build the update data dynamically
  const updateData = {};
  if (status) {
    updateData.status = status;
  }
  if (shippingAddress) {
    updateData.shippingAddress = shippingAddress;
  }

  // Find and update the order
  const order = await Order.findByIdAndUpdate(
    req.params.id ,
     updateData, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json({
    status: 'success',
    data: order,
  });
});


// export const updateOrder = asyncHandler(async (req, res) => {
//   const order = await Order.findByIdAndUpdate(
//     req.params.id,
//     { status: req.body.status },
//     { new: true, runValidators: true }
//   );

//   if (!order) {
//     throw new ApiError(404, 'Order not found');
//   }

//   res.status(200).json({
//     status: 'success',
//     data: order
//   });
// });





// Get all orders (admin only)
  //  @des route  {{BaseURL}}orders/my-order
// export const getMyOrder = getOne(Order, { path: 'items.product', select: 'title price' });
export const getAllOrders = getAll(Order,{path:"user",select:"name email"});
 
//  await Order.findOne({ _id: ObjectId("id_here") })

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product', 'title price');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders,
  });
});


// export const getMyOrder = asyncHandler(async (req, res, next) => {
//   const order = await Order.findOne({
//     _id: req.params.id,
//     user: req.user._id
//   }).populate('items.product', 'title price');

//   if (!order) {
//     return next(new ApiError(404, 'Order not found or not authorized'));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: order
//   });
// });

