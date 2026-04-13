import AssetAudit from './assetAudit.model.js';

export const logAssetChange = async ({
  asset,
  action,
  changedBy,
  before,
  after
}) => {
  await AssetAudit.create({
    asset,
    action,
    changedBy,
    before,
    after
  });
};