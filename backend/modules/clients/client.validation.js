import Joi from 'joi';

export const createClientSchema = Joi.object({
  companyName: Joi.string().required(),
  contactPerson: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  address: Joi.string().allow('', null)
});

export const updateClientSchema = Joi.object({
  companyName: Joi.string(),
  contactPerson: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  country: Joi.string(),
  address: Joi.string()
});