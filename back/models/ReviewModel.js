import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating']
  },
  comment: {
    type: String,
    required: [true, 'Review must have a comment'],
    trim: true,
    maxLength: [500, 'Review comment cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ product: 1, user: 1 },
   { unique: true }); 
   // User can review a product only once

// Middleware
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name avatar'
  });
  next();
});

export default mongoose.model('Review', reviewSchema);





// import { Schema, model } from 'mongoose';

// const reviewSchema = new Schema({
//   user: {
//     type: Schema.ObjectId,
//     ref: 'User',
//     required: [true, 'Review must belong to a user']
//   },
//   product: {
//     type: Schema.ObjectId,
//     ref: 'Product',
//     required: [true, 'Review must belong to a product']
//   },
//   rating: {
//     type: Number,
//     min: 1,
//     max: 5,
//     required: [true, 'Review must have a rating']
//   },
//   comment: {
//     type: String,
//     required: [true, 'Review must have a comment']
//   }
// }, {
//   timestamps: true
// });

// export default model('Review', reviewSchema);