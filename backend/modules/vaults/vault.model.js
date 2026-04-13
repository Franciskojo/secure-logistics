import mongoose from 'mongoose';

const vaultSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    capacity: {
      type: Number, // max number of assets
      required: true
    },

    currentLoad: {
      type: Number,
      default: 0
    },

    securityLevel: {
      type: String,
      enum: ['high', 'ultra'],
      default: 'high'
    },

    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset'
      }
    ],

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

export default mongoose.model('Vault', vaultSchema);