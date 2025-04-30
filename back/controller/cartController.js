import Product from '../models/productModel.js';
import Coupon from '../models/couponModel.js';
import Cart from '../models/cartModel.js';
import catchAsync from "../utils/catchAsync.js";
import ApiError from '../utils/ApiError.js';
import {getOne} from "./handlersFactory.js";

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => { 
    totalPrice += item.quantity * item.price; 
  });  
  cart.totalCartPrice = totalPrice; // forgot 
  cart.totalPriceAfterDiscount = undefined; // forgot 
  return totalPrice;
};

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
 
export const addToCart = catchAsync(async (req, res, next) => {
  const { productId, color } = req.body; // forgot  not cart
  
  // 1) Check if product exists 
  //  no need to check if undefind if(!pro||color) return error we use validate
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  // 2) Get Cart for logged user  no need to error !cart we get cart from DB   
  let cart = await Cart.findOne({ user: req.user._id }); // not find/ use {}

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{
        productId,  
        color,
        price: product.price,
        quantity: 1
      }]  
    });      
  } else {
    // Find product in existing cart  
    const productIndex = cart.cartItems.findIndex(
      (item) => item.productId?.toString() ===
       productId && item.color === color
    );   

    if (productIndex > -1) {  // forgot 
      // Update existing item quantity
      cart.cartItems[productIndex].quantity ++;
    } else {
      // Add new item to cart
      cart.cartItems.push({
        name: product.name,   
        productId,   
        color,
        price: product.price,
        quantity: 1
      });
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);  // forgot 
  await cart.save();   // forogt 

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart  // forgo  
  });
});




 
// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User  


       // can user handelFacory 
  export const getCart = getOne(Cart);  //no need to , "Cart"

  // normal fun if whan  numOfCartItems: cart.cartItems.length

//   export const getCart = catchAsync(async (req, res, next) => {
//   const cart = await Cart.findOne({ user: req.user._id });

//   if (!cart) {
//     return next( 
//       new ApiError( 404,`There is no cart for this user id
//          : ${req.user._id}`)
//     );
//   }

//   res.status(200).json({
//     status: 'success',
//     numOfCartItems: cart.cartItems.length,
//     data: cart,
//   });
// });


export const addToGuestCart = catchAsync(async (req, res, next) => {
  const { productId, quantity,color } = req.body;
  // no need to make var cart 
  if (!req.session.guestCart) {
    req.session.guestCart = {
      cartItems: [{
          productId,
          quantity,color,
          addedAt: new Date()}
      ],
      totalPrice: 0
    };

    const existingItem = req.session.guestCart.cartItems.find(
      item => item.productId === productId && item.color === color
    ); 
    if (existingItem) {  // not like mongo cart.cartitem[index].qutn++
      existingItem.quantity += quantity;
    } else {
      req.session.guestCart.cartItems.push({
        productId,
        quantity,
        color,
        addedAt: new Date()
      });
    }
  }
  await req.session.save(); // alwawy must make save to your work like close exell

  res.status(200).json({
    status: 'success',
    data: req.session.guestCart
  });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
// 
export const  removeFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },  
    // _id:req.prams not body caust id will in prams url /:itemId
    {     
      $pull: { cartItems: { _id: req.params.itemId } },
    },    
    { new: true }
  );

  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: 'success deleted',
    message: `Product removed from cart successfully it's id ${req.user._id}`,
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
export const clearCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});         // or update {cartITem:[]}

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
export const updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString()
     === req.params.itemId
  );  // item.productId.toString() === producId &&

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else { 
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User

export const applyCoupon = catchAsync(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(404, 'Coupon is invalid or expired'));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await
   Cart.findOne({ user: req.user._id });

   if (!cart) {
    return next(new ApiError(404, 'No cart found for this user'));
  }

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

    
  res.status(200).json({
    status: 'success',
    message: 'Coupon applied successfully',
    data: {
      totalPriceBeforeDiscount: totalPrice,
      discount: coupon.discount,
      totalPriceAfterDiscount  ,  // optional and next 
       numOfCartItems: cart.cartItems.length,
       prodcuts: cart
    }
  });
});




