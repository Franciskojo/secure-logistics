import * as ClientService from './client.service.js';

export const createClient = async (req, res) => {
  try {
    const client = await ClientService.createClient(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getClients = async (req, res) => {
  try {
    const result = await ClientService.getClients(req.query);

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

export const getClient = async (req, res) => {
  try {
    const client = await ClientService.getClientById(req.params.id);

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const updated = await ClientService.updateClient(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const deleted = await ClientService.deleteClient(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Client soft deleted',
      data: deleted
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};