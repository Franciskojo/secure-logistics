import Asset from './asset.model.js';
import { canTransition } from './asset.state.js';
import { generateTrackingCode } from '../../utils/tracking.js';

// ✅ NEW IMPORTS
import { encrypt } from '../../utils/encryption.js';
import { emitEvent } from './asset.event.js';
import { logAssetChange } from './asset.audit.js';


// ========================
// CREATE ASSET
// ========================
export const createAsset = async (data, adminId) => {
  // 🔐 ENCRYPT SENSITIVE DATA
  if (data.locationNote) {
    data.encryptedNote = encrypt(data.locationNote);
    delete data.locationNote;
  }

  // ✅ GENERATE TRACKING CODE FIRST
  const trackingCode = generateTrackingCode();

  const asset = await Asset.create({
    ...data,
    trackingCode,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${trackingCode}`,
    createdBy: adminId
  });

  // 📜 AUDIT
  await logAssetChange({
    asset: asset._id,
    action: 'CREATE_ASSET',
    changedBy: adminId,
    before: null,
    after: asset.toObject()
  });

  // 📡 EVENT
  await emitEvent({
    asset: asset._id,
    eventType: 'ASSET_CREATED',
    payload: asset,
    triggeredBy: adminId
  });

  return asset;
};


// ========================
// GET ASSETS (PAGINATION)
// ========================
export const getAssets = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };

  const assets = await Asset.find(filter)
    .populate('client', 'companyName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Asset.countDocuments(filter);

  return {
    data: assets,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};


// ========================
// GET SINGLE ASSET
// ========================
export const getAssetById = async (id) => {
  const asset = await Asset.findOne({
    _id: id,
    isDeleted: false
  }).populate('client');

  if (!asset) throw new Error('Asset not found');

  return asset;
};


// ========================
// UPDATE ASSET
// ========================
export const updateAsset = async (id, data, adminId) => {
  const asset = await Asset.findById(id);

  if (!asset || asset.isDeleted) throw new Error('Asset not found');

  // 🔁 STATUS RULE ENFORCEMENT
  if (data.status && data.status !== asset.status) {
    const allowed = canTransition(asset.status, data.status);

    if (!allowed) {
      throw new Error(
        `Invalid status transition: ${asset.status} → ${data.status}`
      );
    }
  }

  // 🔐 ENCRYPT IF PROVIDED
  if (data.locationNote) {
    data.encryptedNote = encrypt(data.locationNote);
    delete data.locationNote;
  }

  const before = asset.toObject();

  Object.assign(asset, data);
  await asset.save();

  // 📜 AUDIT
  await logAssetChange({
    asset: asset._id,
    action: 'UPDATE_ASSET',
    changedBy: adminId,
    before,
    after: asset.toObject()
  });

  // 📡 EVENT
  await emitEvent({
    asset: asset._id,
    eventType: 'ASSET_UPDATED',
    payload: data,
    triggeredBy: adminId
  });

  return asset;
};


// ========================
// DELETE (SOFT DELETE)
// ========================
export const deleteAsset = async (id, adminId) => {
  const asset = await Asset.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date()
    },
    { new: true }
  );

  if (!asset) throw new Error('Asset not found');

  // 📜 AUDIT
  await logAssetChange({
    asset: asset._id,
    action: 'DELETE_ASSET',
    changedBy: adminId,
    before: asset.toObject(),
    after: null
  });

  // 📡 EVENT
  await emitEvent({
    asset: asset._id,
    eventType: 'ASSET_DELETED',
    payload: { id },
    triggeredBy: adminId
  });

  return asset;
};