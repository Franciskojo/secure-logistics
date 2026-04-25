import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://secure-logistics.onrender.com/api';
const api = axios.create({
  baseURL: baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`
});


// 🔥 attach token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;