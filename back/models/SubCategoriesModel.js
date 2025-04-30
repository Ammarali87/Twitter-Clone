import {Schema ,model} from "mongoose";
import './ReviewModel.js';

// required: [inArray] [true, "Subcategory name is required"],
// trim true !important 
// slug lowercase 
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      minlength: [3, "Subcategory name is too short"],
      maxlength: [50, "Subcategory name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    }, 
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must belong to a category"],
    },
  },
  { timestamps: true }
);
   // not allow two sub in one category
// Add compound unique index for name and category
subCategorySchema.index({ category: 1, name: 1 }, { unique: true });

subCategorySchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Mongoose query middleware
subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id',
  });
  next();
});
// ✅ إنشاء الموديل
const SubCategory = model("SubCategory", subCategorySchema);

export default SubCategory;
