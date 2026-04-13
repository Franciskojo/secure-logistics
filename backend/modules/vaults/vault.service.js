import Vault from './vault.model.js';
import Asset from '../assets/asset.model.js';

import { logAssetChange } from '../assets/asset.audit.js';
import { emitEvent } from '../assets/asset.event.js';


// ========================
// CREATE VAULT
// ========================
export const createVault = async (data, adminId) => {
  return await Vault.create({
    ...data,
    createdBy: adminId
  });
};


// ========================
// GET VAULTS
// ========================
export const getVaults = async () => {
  return await Vault.find({ isDeleted: false })
    .populate('assets')
    .sort({ createdAt: -1 });
};


// ========================
// ASSIGN ASSET TO VAULT
// ========================
export const assignAssetToVault = async (vaultId, assetId, adminId) => {
  const vault = await Vault.findById(vaultId);
  const asset = await Asset.findById(assetId);

  if (!vault || vault.isDeleted) throw new Error('Vault not found');
  if (!asset || asset.isDeleted) throw new Error('Asset not found');

  // 🔥 PREVENT DUPLICATE
  if (vault.assets.includes(assetId)) {
    throw new Error('Asset already in vault');
  }

  // 🔥 CAPACITY CHECK
  if (vault.currentLoad >= vault.capacity) {
    throw new Error('Vault capacity reached');
  }

  // 🔁 UPDATE VAULT
  vault.assets.push(assetId);
  vault.currentLoad += 1;

  await vault.save();

  // 🔁 UPDATE ASSET STATUS
  const before = asset.toObject();

  asset.status = 'vaulted';
  await asset.save();

  // 📜 AUDIT
  await logAssetChange({
    asset: asset._id,
    action: 'ASSET_VAULTED',
    changedBy: adminId,
    before,
    after: asset.toObject()
  });

  // 📡 EVENT
  await emitEvent({
    asset: asset._id,
    eventType: 'ASSET_MOVED_TO_VAULT',
    payload: { vaultId },
    triggeredBy: adminId
  });

  return vault;
};


// ========================
// REMOVE ASSET FROM VAULT
// ========================
export const removeAssetFromVault = async (vaultId, assetId, adminId) => {
  const vault = await Vault.findById(vaultId);
  const asset = await Asset.findById(assetId);

  if (!vault || vault.isDeleted) throw new Error('Vault not found');
  if (!asset || asset.isDeleted) throw new Error('Asset not found');

  // 🔥 CHECK EXISTENCE
  if (!vault.assets.includes(assetId)) {
    throw new Error('Asset not in vault');
  }

  // 🔁 REMOVE
  vault.assets = vault.assets.filter(
    (id) => id.toString() !== assetId
  );

  vault.currentLoad -= 1;

  await vault.save();

  const before = asset.toObject();

  // 🔁 UPDATE STATUS
  asset.status = 'stored';
  await asset.save();

  // 📜 AUDIT
  await logAssetChange({
    asset: asset._id,
    action: 'ASSET_REMOVED_FROM_VAULT',
    changedBy: adminId,
    before,
    after: asset.toObject()
  });

  // 📡 EVENT
  await emitEvent({
    asset: asset._id,
    eventType: 'ASSET_REMOVED_FROM_VAULT',
    payload: { vaultId },
    triggeredBy: adminId
  });

  return vault;
};