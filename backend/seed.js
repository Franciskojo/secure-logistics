import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Shipment from './modules/shipments/shipment.model.js';
import Admin from './modules/auth/auth.model.js';
import Client from './modules/clients/client.model.js';
import Asset from './modules/assets/asset.model.js';

dotenv.config();

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected correctly.');

    // 1. Clear everything
    await Shipment.deleteMany({});
    await Admin.deleteMany({});
    await Client.deleteMany({});
    await Asset.deleteMany({});
    console.log('Database cleared for fresh seeding.');

    // 2. Seed Admin
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await Admin.create({
      name: 'SecureLogix Admin',
      email: 'admin@securelogix.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin Seeded: admin@securelogix.com / password123');

    // 3. Seed Clients
    const client1 = await Client.create({
      companyName: 'Swiss Jewelers Ltd',
      contactPerson: 'Klaus Schmidt',
      email: 'klaus@swissjewelers.ch',
      phone: '+41 44 123 45 67',
      country: 'Switzerland',
      address: 'Bahnhofstrasse 1, Zurich',
      createdBy: admin._id
    });

    const client2 = await Client.create({
      companyName: 'Global Gold Traders',
      contactPerson: 'John Doe',
      email: 'john@globalgold.com',
      phone: '+1 212 555 1234',
      country: 'USA',
      address: 'Wall Street 100, New York',
      createdBy: admin._id
    });
    console.log('✅ Clients Seeded.');

    // 4. Seed Assets
    const asset1 = await Asset.create({
      name: 'Blue Diamond 5ct',
      type: 'diamond',
      description: 'Rare blue diamond, impeccable clarity.',
      value: 1200000,
      currency: 'USD',
      client: client1._id,
      securityLevel: 'ultra',
      status: 'stored',
      trackingCode: 'AST-DB-1001',
      createdBy: admin._id
    });

    const asset2 = await Asset.create({
      name: 'Gold Bars 50kg',
      type: 'gold',
      description: 'Standard 99.9% purity gold bullion.',
      value: 3000000,
      currency: 'USD',
      client: client2._id,
      securityLevel: 'high',
      status: 'stored',
      trackingCode: 'AST-AU-2002',
      createdBy: admin._id
    });

    const asset3 = await Asset.create({
      name: 'Monet Landscape Painting',
      type: 'art',
      description: 'Original 19th century oil painting.',
      value: 5000000,
      currency: 'USD',
      client: client1._id,
      securityLevel: 'high',
      status: 'stored',
      trackingCode: 'AST-FA-3003',
      createdBy: admin._id
    });
    console.log('✅ Assets Seeded.');

    // 5. Seed Shipments
    await Shipment.create({
      trackingCode: 'SHP-9990001',
      origin: 'Zurich, Switzerland',
      destination: 'Ghana, West African Sub-Region',
      currentLocation: 'In Transit - Over Atlantic Ocean',
      status: 'in_transit',
      securityLevel: 'ultra',
      assets: [asset1._id],
      createdBy: admin._id
    });

    await Shipment.create({
      trackingCode: 'SHP-9990002',
      origin: 'Dubai, UAE',
      destination: 'London, UK',
      currentLocation: 'London Heathrow Secure Vault',
      status: 'arrived',
      securityLevel: 'high',
      assets: [asset2._id],
      createdBy: admin._id
    });

    await Shipment.create({
      trackingCode: 'SHP-TESTING',
      origin: 'Cape Town, SA',
      destination: 'Paris, France',
      currentLocation: 'Cape Town Gateway Processing',
      status: 'pending',
      securityLevel: 'high',
      assets: [asset3._id],
      createdBy: admin._id
    });
    console.log('✅ Shipments Seeded.');

    console.log('\n------------------------------------------------');
    console.log('LOGIN: admin@securelogix.com / password123');
    console.log('------------------------------------------------\n');

    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedAll();
