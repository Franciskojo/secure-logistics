import mongoose from 'mongoose';

const assetEventSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    },

    eventType: String,

    payload: Object,

    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  { timestamps: true }
);

export default mongoose.model('AssetEvent', assetEventSchema);