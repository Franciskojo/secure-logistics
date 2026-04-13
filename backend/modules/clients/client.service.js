import Client from './client.model.js';

export const createClient = async (data, adminId) => {
  const existing = await Client.findOne({ email: data.email });

  if (existing) throw new Error('Client already exists');

  return await Client.create({
    ...data,
    createdBy: adminId
  });
};

export const getClients = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };

  const clients = await Client.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Client.countDocuments(filter);

  return {
    data: clients,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getClientById = async (id) => {
  const client = await Client.findOne({ _id: id, isDeleted: false });

  if (!client) throw new Error('Client not found');

  return client;
};

export const updateClient = async (id, data) => {
  const client = await Client.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true, runValidators: true }
  );

  if (!client) throw new Error('Client not found');

  return client;
};

export const deleteClient = async (id, adminId) => {
  const client = await Client.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date()
    },
    { new: true }
  );

  if (!client) throw new Error('Client not found');

  // ⏳ audit hook placeholder
  // logAction("DELETE_CLIENT", adminId, id);

  return client;
};