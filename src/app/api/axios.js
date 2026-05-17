import axios from 'axios';

// On pointe vers la variable d'environnement, avec 8000 par défaut
const API_URL = import.meta.env.VITE_API_URL || 'http://10.60.26.80:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;