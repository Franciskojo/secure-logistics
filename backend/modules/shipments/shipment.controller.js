import * as ShipmentService from './shipment.service.js';

export const createShipment = async (req, res) => {
  try {
    const shipment = await ShipmentService.createShipment(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const shipment = await ShipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.user.id
    );

    res.json({
      success: true,
      data: shipment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getShipments = async (req, res) => {
  try {
    const shipments = await ShipmentService.getShipments();

    res.json({
      success: true,
      data: shipments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const trackShipment = async (req, res) => {
  try {
    const shipment = await ShipmentService.getShipmentByTrackingCode(req.params.trackingCode);

    res.json({
      success: true,
      data: shipment
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const shipment = await ShipmentService.updateShipmentLocation(
      req.params.id,
      req.body.location,
      req.user.id
    );

    res.json({
      success: true,
      data: shipment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};