import express from 'express';
import * as AssetController from './asset.controller.js';
import protect from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createAssetSchema,
  updateAssetSchema
} from './asset.validation.js';

const router = express.Router();

router.use(protect);

// CREATE
router.post(
  '/',
  validate(createAssetSchema),
  AssetController.createAsset
);

// READ
router.get('/', AssetController.getAssets);
router.get('/:id', AssetController.getAsset);

// UPDATE
router.patch(
  '/:id',
  validate(updateAssetSchema),
  AssetController.updateAsset
);

// DELETE
router.delete('/:id', AssetController.deleteAsset);

export default router;