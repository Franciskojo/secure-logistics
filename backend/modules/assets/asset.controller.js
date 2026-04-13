import * as AssetService from './asset.service.js';

export const createAsset = async (req, res) => {
  try {
    const asset = await AssetService.createAsset(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: asset
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAssets = async (req, res) => {
  try {
    const result = await AssetService.getAssets(req.query);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAsset = async (req, res) => {
  try {
    const asset = await AssetService.getAssetById(req.params.id);

    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const asset = await AssetService.updateAsset(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const asset = await AssetService.deleteAsset(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Asset soft deleted',
      data: asset
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};