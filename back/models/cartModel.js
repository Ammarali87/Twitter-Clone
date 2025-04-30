import { Schema, model } from 'mongoose';

const cartSchema = new Schema(
  {          // can be {} or one vlaue : String 
    cartItems: [
      {
        name:String,
        productId: {  
          type: Schema.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {  
      type: Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default model('Cart', cartSchema);