import mongoose from 'mongoose';
import crypto from 'crypto';

const otpRecordSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ['registration_email', 'registration_phone', 'password_reset', 'login'],
      index: true,
    },
    hashedOtp: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: [5, 'Maximum OTP verification attempts exceeded'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatic MongoDB TTL deletion upon expiry
    },
  },
  {
    timestamps: true,
  }
);

// Static helper to hash plaintext OTP
otpRecordSchema.statics.hashOtp = function (plaintextOtp) {
  return crypto.createHash('sha256').update(plaintextOtp.toString().trim()).digest('hex');
};

// Method to verify entered OTP against hashed value
otpRecordSchema.methods.verifyOtp = function (plaintextOtp) {
  const hash = crypto.createHash('sha256').update(plaintextOtp.toString().trim()).digest('hex');
  return this.hashedOtp === hash;
};

export const OtpRecord = mongoose.model('OtpRecord', otpRecordSchema);
