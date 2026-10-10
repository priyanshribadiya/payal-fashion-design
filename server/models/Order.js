import mongoose from 'mongoose';

const orderItemSnapshotSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    priceInPaise: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      default: 'Standard',
    },
    color: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderAddressSnapshotSchema = new mongoose.Schema(
  {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [orderItemSnapshotSchema],
    shippingAddress: orderAddressSnapshotSchema,

    subtotalInPaise: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingChargeInPaise: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountInPaise: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmountInPaise: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        'pending_payment',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refund_pending',
        'refunded',
      ],
      default: 'pending_payment',
      index: true,
    },

    paymentMethod: {
      type: String,
      default: 'razorpay',
    },
    razorpayOrderId: {
      type: String,
      index: true,
      sparse: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
      sparse: true,
    },

    trackingNumber: {
      type: String,
      default: '',
    },
    courierName: {
      type: String,
      default: '',
    },
    customerNotes: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted INR Total
orderSchema.virtual('totalAmountINR').get(function () {
  return (this.totalAmountInPaise / 100).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR',
  });
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

export const Order = mongoose.model('Order', orderSchema);
