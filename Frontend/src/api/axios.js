import axios from 'axios';

const baseURL = import.meta.env.DEV ? '' : 'http://172.20.10.7:8080';

const api = axios.create({
  baseURL,
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    // token logic can be added here later
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

export default api;
