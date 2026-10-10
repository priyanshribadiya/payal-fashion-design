import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    categoryName: {
      type: String, // Cached for quick rendering & filtering
      required: true,
      index: true,
    },
    images: {
      type: [String],
      validate: [val => val.length > 0, 'At least one product image is required'],
    },
    priceInPaise: {
      type: Number,
      required: [true, 'Price in paise is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountedPriceInPaise: {
      type: Number,
      default: null,
      min: [0, 'Discounted price cannot be negative'],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    colors: {
      type: [String],
      default: [],
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    inventoryQuantity: {
      type: Number,
      required: true,
      min: [0, 'Inventory cannot be negative'],
      default: 0,
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'made_to_order'],
      default: 'in_stock',
      index: true,
    },
    isDemonstrationData: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted INR price e.g. "₹2,850"
productSchema.virtual('priceInINR').get(function () {
  return (this.priceInPaise / 100).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR',
  });
});

// Set virtuals to serialize
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
