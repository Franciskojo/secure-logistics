import Shipment from './shipment.model.js';
import Asset from '../assets/asset.model.js';
import { v4 as uuidv4 } from 'uuid';
import { canTransitionShipment } from './shipment.state.js';
import { io } from '../../server.js';

import { logAssetChange } from '../assets/asset.audit.js';
import { emitEvent } from '../assets/asset.event.js';
import { sendShipmentInitiatedNotification, sendShipmentStatusUpdateNotification } from '../notifications/notification.service.js';


// ========================
// CREATE SHIPMENT
// ========================
export const createShipment = async (data, adminId) => {
  const trackingCode = `SHP-${uuidv4().split('-')[0].toUpperCase()}`;

  // 🔍 VALIDATE ASSETS FIRST
  const assets = await Asset.find({
    _id: { $in: data.assets },
    isDeleted: false
  });

  if (assets.length !== data.assets.length) {
    throw new Error('Some assets not found or deleted');
  }

  // ❌ prevent shipping assets already in transit
  const invalid = assets.find(a => a.status === 'in_transit');
  if (invalid) {
    throw new Error(`Asset already in transit: ${invalid._id}`);
  }

  const shipment = await Shipment.create({
    ...data,
    trackingCode,
    currentLocation: data.origin,
    createdBy: adminId
  });

  // 🔁 UPDATE EACH ASSET (IMPORTANT)
  for (const asset of assets) {
    const before = asset.toObject();

    asset.status = 'in_transit';
    await asset.save();

    // 📜 AUDIT
    await logAssetChange({
      asset: asset._id,
      action: 'ASSET_SHIPPED',
      changedBy: adminId,
      before,
      after: asset.toObject()
    });

    // 📡 EVENT (per asset)
    await emitEvent({
      asset: asset._id,
      eventType: 'ASSET_SHIPPED',
      payload: { shipmentId: shipment._id },
      triggeredBy: adminId
    });
  }

  // 📡 GLOBAL EVENT
  await emitEvent({
    asset: null,
    eventType: 'SHIPMENT_CREATED',
    payload: shipment,
    triggeredBy: adminId
  });

  // 🔥 REAL-TIME EMIT
  io.emit('shipmentCreated', shipment);

  // 📧 CLIENT NOTIFICATION
  const clientIds = [...new Set(assets.map(a => a.client.toString()))];
  sendShipmentInitiatedNotification(clientIds, shipment);

  return shipment;
};

// ========================
// UPDATE SHIPMENT STATUS
// ========================
export const updateShipmentStatus = async (id, status, adminId) => {
  const shipment = await Shipment.findById(id).populate('assets');

  if (!shipment || shipment.isDeleted)
    throw new Error('Shipment not found');

  // 🔥 STATE CONTROL
  if (!canTransitionShipment(shipment.status, status)) {
    throw new Error(
      `Invalid transition: ${shipment.status} → ${status}`
    );
  }

  const oldStatus = shipment.status;
  shipment.status = status;

  // 📍 LOCATION LOGIC
  if (status === 'in_transit') {
    shipment.currentLocation = 'In Transit';
  }

  if (status === 'arrived') {
    shipment.currentLocation = shipment.destination;
  }

  await shipment.save();

  // 🔁 HANDLE COMPLETION
  if (status === 'completed') {
    for (const asset of shipment.assets) {
      const before = asset.toObject();

      asset.status = 'stored';
      await asset.save();

      // 📜 AUDIT
      await logAssetChange({
        asset: asset._id,
        action: 'ASSET_DELIVERED',
        changedBy: adminId,
        before,
        after: asset.toObject()
      });

      // 📡 EVENT
      await emitEvent({
        asset: asset._id,
        eventType: 'ASSET_DELIVERED',
        payload: { shipmentId: shipment._id },
        triggeredBy: adminId
      });
    }
  }

  // 📡 SHIPMENT EVENT
  await emitEvent({
    asset: null,
    eventType: 'SHIPMENT_STATUS_UPDATED',
    payload: { id, oldStatus, status },
    triggeredBy: adminId
  });

  // 🔥 REAL-TIME EMIT
  io.emit('shipmentUpdated', {
    id: shipment._id,
    status,
    location: shipment.currentLocation
  });

  // 📧 CLIENT NOTIFICATION
  sendShipmentStatusUpdateNotification(shipment._id, status);

  return shipment;
};

// ========================
// GET SHIPMENTS
// ========================
export const getShipments = async () => {
  return await Shipment.find({ isDeleted: false })
    .populate('assets')
    .sort({ createdAt: -1 });
};

// ========================
// TRACK SHIPMENT BY CODE
// ========================
export const getShipmentByTrackingCode = async (trackingCode) => {
  const shipment = await Shipment.findOne({ trackingCode, isDeleted: false })
    .populate('assets')
    .select('-createdBy -isDeleted -deletedAt');
  
  if (!shipment) {
    throw new Error('Tracking reference not found or invalid');
  }

  return shipment;
};

// ========================
// UPDATE SHIPMENT LOCATION
// ========================
export const updateShipmentLocation = async (id, location, adminId) => {
  const shipment = await Shipment.findById(id);
  if (!shipment || shipment.isDeleted) throw new Error('Shipment not found');

  shipment.currentLocation = location;
  await shipment.save();

  // 🔥 REAL-TIME EMIT
  io.emit('shipmentUpdated', {
    id: shipment._id,
    status: shipment.status,
    location: shipment.currentLocation
  });

  // 📧 CLIENT NOTIFICATION
  sendShipmentStatusUpdateNotification(shipment._id, shipment.status);

  return shipment;
};