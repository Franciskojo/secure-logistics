import Client from '../clients/client.model.js';
import Asset from '../assets/asset.model.js';
import Shipment from '../shipments/shipment.model.js';
import Vault from '../vaults/vault.model.js';

export const getDashboardStats = async () => {
  const [
    totalClients,
    totalAssets,
    assetsInVault,
    assetsInTransit,
    activeShipments,
    completedShipments,
    totalVaults
  ] = await Promise.all([
    Client.countDocuments({ isDeleted: false }),
    Asset.countDocuments({ isDeleted: false }),
    Asset.countDocuments({ status: 'vaulted', isDeleted: false }),
    Asset.countDocuments({ status: 'in_transit', isDeleted: false }),
    Shipment.countDocuments({ status: 'in_transit', isDeleted: false }),
    Shipment.countDocuments({ status: 'completed', isDeleted: false }),
    Vault.countDocuments({ isDeleted: false })
  ]);

  return {
    totalClients,
    totalAssets,
    assetsInVault,
    assetsInTransit,
    activeShipments,
    completedShipments,
    totalVaults
  };
};