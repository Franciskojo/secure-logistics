import * as VaultService from './vault.service.js';

export const createVault = async (req, res) => {
  try {
    const vault = await VaultService.createVault(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: vault
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getVaults = async (req, res) => {
  try {
    const vaults = await VaultService.getVaults();

    res.json({
      success: true,
      data: vaults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const assignAsset = async (req, res) => {
  try {
    const result = await VaultService.assignAssetToVault(
      req.params.id,
      req.body.assetId,
      req.user.id
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const removeAsset = async (req, res) => {
  try {
    const result = await VaultService.removeAssetFromVault(
      req.params.id,
      req.body.assetId,
      req.user.id
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};