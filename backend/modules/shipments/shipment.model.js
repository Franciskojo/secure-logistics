import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    trackingCode: {
      type: String,
      unique: true
    },

    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset'
      }
    ],

    origin: {
      type: String,
      required: true
    },

    destination: {
      type: String,
      required: true
    },

    currentLocation: {
      type: String
    },

    status: {
      type: String,
      enum: ['pending', 'in_transit', 'arrived', 'completed', 'cancelled'],
      default: 'pending'
    },

    securityLevel: {
      type: String,
      enum: ['high', 'ultra'],
      default: 'high'
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },

    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('Shipment', shipmentSchema);