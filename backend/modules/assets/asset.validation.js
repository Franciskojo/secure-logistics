import Joi from 'joi';

export const createAssetSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('diamond', 'gold', 'art', 'other').required(),
  description: Joi.string().allow('', null),
  value: Joi.number().required(),
  currency: Joi.string().default('USD'),
  client: Joi.string().required(),
  securityLevel: Joi.string().valid('standard', 'high', 'ultra'),
  locationNote: Joi.string().allow('', null)
});

export const updateAssetSchema = Joi.object({
  name: Joi.string(),
  type: Joi.string().valid('diamond', 'gold', 'art', 'other'),
  description: Joi.string(),
  value: Joi.number(),
  currency: Joi.string(),
  client: Joi.string(),
  securityLevel: Joi.string().valid('standard', 'high', 'ultra'),
  status: Joi.string().valid('stored', 'in_transit', 'delivered', 'vaulted'),
  locationNote: Joi.string()
});