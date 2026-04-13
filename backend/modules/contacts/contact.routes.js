import express from 'express';
import { submitContact, getContacts } from './contact.controller.js';

const router = express.Router();

router.post('/submit', submitContact);
router.get('/', getContacts); // In a real app, this should be protected

export default router;
