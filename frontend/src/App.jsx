import AuthProvider from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Vaults from './pages/Vaults';
import Shipments from './pages/Shipments';
import WaybillPage from './pages/WaybillPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Layout>
                  <Assets />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vaults"
            element={
              <ProtectedRoute>
                <Layout>
                  <Vaults />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/shipments"
            element={
              <ProtectedRoute>
                <Layout>
                  <Shipments />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/waybill/:trackingCode"
            element={
              <ProtectedRoute>
                <WaybillPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}