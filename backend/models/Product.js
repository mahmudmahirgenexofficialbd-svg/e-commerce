import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Size", "Color"
  options: [{ type: String, required: true }], // e.g., ["S", "M", "L"]
});

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String },
      },
    ],
    brand: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    wholesalePrice: {
      type: Number,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    variants: [variantSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
