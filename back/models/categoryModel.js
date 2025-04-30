import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String , 
    required:false
  },
}, { timestamps: true }); 


// categorySchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next(); //  very hard to rember next()
// });  

const Category = mongoose.models.Category 
|| mongoose.model('Category', categorySchema);

export default Category;



