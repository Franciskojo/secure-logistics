import AssetEvent from './assetEvent.model.js';

export const emitEvent = async ({
  asset,
  eventType,
  payload,
  triggeredBy
}) => {
  await AssetEvent.create({
    asset,
    eventType,
    payload,
    triggeredBy
  });
};