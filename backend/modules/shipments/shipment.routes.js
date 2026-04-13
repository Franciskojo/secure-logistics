import express from 'express';
import * as ShipmentController from './shipment.controller.js';
import protect from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/track/:trackingCode', ShipmentController.trackShipment);

router.use(protect);

router.post('/', ShipmentController.createShipment);
router.get('/', ShipmentController.getShipments);
router.patch('/:id/status', ShipmentController.updateStatus);
router.patch('/:id/location', ShipmentController.updateLocation);

export default router;