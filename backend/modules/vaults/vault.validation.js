import Joi from 'joi';

export const createVaultSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  capacity: Joi.number().required(),
  securityLevel: Joi.string().valid('high', 'ultra')
});

export const assignAssetSchema = Joi.object({
  assetId: Joi.string().required()
});