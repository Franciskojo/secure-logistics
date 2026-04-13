import mongoose from 'mongoose';

const assetAuditSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true
    },

    action: {
      type: String,
      required: true
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },

    before: Object,
    after: Object
  },
  { timestamps: true }
);

export default mongoose.model('AssetAudit', assetAuditSchema);