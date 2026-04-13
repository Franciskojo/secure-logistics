import express from 'express';
import * as ClientController from './client.controller.js';
import protect from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createClientSchema,
  updateClientSchema
} from './client.validation.js';

const router = express.Router();

router.use(protect);

// CREATE
router.post(
  '/',
  validate(createClientSchema),
  ClientController.createClient
);

// READ
router.get('/', ClientController.getClients);
router.get('/:id', ClientController.getClient);

// UPDATE
router.patch(
  '/:id',
  validate(updateClientSchema),
  ClientController.updateClient
);

// DELETE (SOFT DELETE)
router.delete('/:id', ClientController.deleteClient);

export default router;