import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API İstek: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API İstek Hatası:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Cevap: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Cevap Hatası:', error);
    if (error.response) {
      console.error('📊 Hata Detayı:', {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config.url
      });
    } else if (error.request) {
      console.error('🌐 Network Hatası:', error.request);
    } else {
      console.error('⚡ İstek Hatası:', error.message);
    }
    return Promise.reject(error);
  }
);

export const locationsAPI = {
  getAll: async () => {
    const response = await api.get('/locations');
    return response.data; 
  },
  
  create: async (locationData) => {
    const response = await api.post('/locations', locationData);
    return response.data; 
  },
  
  delete: async (id) => {
    const response = await api.delete(`/locations/${id}`);
    return response.data; 
  },
  
  update: async (id, locationData) => {
    const response = await api.put(`/locations/${id}`, locationData);
    return response.data; 
  },
};


export default api;