import express from 'express';
import * as VaultController from './vault.controller.js';
import protect from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createVaultSchema,
  assignAssetSchema
} from './vault.validation.js';

const router = express.Router();

router.use(protect);

// CREATE
router.post('/', validate(createVaultSchema), VaultController.createVault);

// READ
router.get('/', VaultController.getVaults);

// ASSIGN
router.post(
  '/:id/assign',
  validate(assignAssetSchema),
  VaultController.assignAsset
);

// REMOVE
router.post(
  '/:id/remove',
  validate(assignAssetSchema),
  VaultController.removeAsset
);

export default router;