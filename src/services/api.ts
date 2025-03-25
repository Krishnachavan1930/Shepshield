
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/auth/logout');
  },
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
};

export const patientService = {
  getAllPatients: async () => {
    return api.get('/patients');
  },
  getPatientById: async (id: number) => {
    return api.get(`/patients/${id}`);
  },
  createPatient: async (patientData: any) => {
    return api.post('/patients', patientData);
  },
  updatePatient: async (id: number, patientData: any) => {
    return api.put(`/patients/${id}`, patientData);
  },
  deletePatient: async (id: number) => {
    return api.delete(`/patients/${id}`);
  },
};

export const analyticsService = {
  getAnalytics: async () => {
    return api.get('/analytics');
  },
  getMonthlyData: async () => {
    return api.get('/analytics/monthly');
  },
  getDepartmentData: async () => {
    return api.get('/analytics/departments');
  },
  getDetectionRate: async () => {
    return api.get('/analytics/detection-rate');
  },
  getPatientOutcomes: async () => {
    return api.get('/analytics/outcomes');
  },
};

export default api;
