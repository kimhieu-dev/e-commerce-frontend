import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8022',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Tự động gắn Basic Auth Header vào mỗi request nếu đã lưu ở localStorage
axiosInstance.interceptors.request.use((config) => {
  const authHeader = localStorage.getItem('authHeader');
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

export default axiosInstance;