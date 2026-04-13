import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ['diamond', 'gold', 'art', 'other'],
      required: true
    },

    description: {
      type: String
    },

    value: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: 'USD'
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },

    securityLevel: {
      type: String,
      enum: ['standard', 'high', 'ultra'],
      default: 'high'
    },

    status: {
      type: String,
      enum: ['stored', 'in_transit', 'delivered', 'vaulted'],
      default: 'stored'
    },

    locationNote: {
      type: String
    },
    trackingCode: {
  type: String,
  unique: true
},
qrCode: {
  type: String
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },

    // 🔥 SOFT DELETE
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model('Asset', assetSchema);