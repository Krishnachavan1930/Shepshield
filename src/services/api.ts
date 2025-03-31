import axios from "axios";

const API_URL = "http://localhost:5454";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/api/auth/login", {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return api.post("/auth/auth/logout");
  },
  getCurrentUser: async () => {
    return api.get("/auth/auth/me");
  },
};

export const patientService = {
  getAllPatients: async () => {
    return api.get("/patients/api/patients");
  },
  getPatientById: async (id: number) => {
    return api.get(`/patients/api/patients/${id}`);
  },
  createPatient: async (patientData: any) => {
    return api.post("/patients/api/patients", patientData);
  },
  updatePatient: async (id: number, patientData: any) => {
    return api.put(`/patients/api/patients/${id}`, patientData);
  },
  deletePatient: async (id: number) => {
    return api.delete(`/patients/api/patients/${id}`);
  },
  getPatientProgress: async (id: number) => {
    return api.get(`/patients/api/patients/${id}/progress`);
  },
  getPatientLab: async (id: number) => {
    return api.get(`/patients/api/patients/${id}/labs`);
  },
  getPatientVitals: async (id: number) => {
    return api.get(`/patients/api/patients/${id}/vitals`);
  },
};

export const analyticsService = {
  getAnalytics: async () => {
    return api.get("/patients/api/analytics");
  },
  getMonthlyData: async () => {
    return api.get("/patients/api/analytics/monthly");
  },
  getDepartmentData: async () => {
    return api.get("/patients/api/analytics/departments");
  },
  getDetectionRate: async () => {
    return api.get("/patients/api/analytics/detection-rate");
  },
  getPatientOutcomes: async () => {
    return api.get("/patients/api/analytics/outcomes");
  },
};

export const reportService = {
  generateReport: async (id: number) => {
    return api.get(`/reports/api/id/report/${id}`);
  },
  manualFineTune: async () => {
    return api.get("/reports/LLM/fine_tune");
  },
};

export default api;
