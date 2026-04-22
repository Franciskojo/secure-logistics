import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes.js';
import clientRoutes from './modules/clients/client.routes.js';
import assetRoutes from './modules/assets/asset.routes.js';
import shipmentRoutes from './modules/shipments/shipment.routes.js';
import vaultRoutes from './modules/vaults/vault.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import contactRoutes from './modules/contacts/contact.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';


const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://secure-logistics.vercel.app',
    process.env.CLIENT_URL
  ],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/vaults', vaultRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contacts', contactRoutes);


// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API running...' });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);


export default app;