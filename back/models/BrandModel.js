import { Schema, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Too short brand name'],
      maxlength: [32, 'Too long brand name'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);


// Add virtual populate for reviews
brandSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'brand',
  localField: '_id'
});


const Brand = model('Brand', brandSchema);

export default Brand;