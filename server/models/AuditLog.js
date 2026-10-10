import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    performedByName: {
      type: String,
      default: 'System',
    },
    targetType: {
      type: String,
      required: true, // e.g. 'Product', 'Order', 'User'
    },
    targetId: {
      type: String,
      default: '',
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
