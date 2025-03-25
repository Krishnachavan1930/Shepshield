
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a timeout for requests (10 seconds)
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
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Default error message
    let errorMessage = 'Something went wrong. Please try again.';
    
    // No response from server (network error)
    if (!error.response) {
      errorMessage = 'Network error. Please check your connection.';
      toast.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    
    const { status, data } = error.response;
    
    // Get more specific error message if available
    if (data?.message) {
      errorMessage = data.message;
    }
    
    // Handle different status codes
    switch (status) {
      case 401:
        // Handle session expiration or unauthorized access
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        errorMessage = 'Your session has expired. Please login again.';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 422:
        errorMessage = 'Validation error. Please check your input.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        // Use default error message
        break;
    }
    
    // Display error toast unless it's an auth error (we'll handle those separately)
    if (status !== 401) {
      toast.error(errorMessage);
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export const authService = {
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
  
  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      return await api.patch('/auth/update-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },
  
  updateProfile: async (userData: any) => {
    try {
      return await api.patch('/auth/update-me', userData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export const patientService = {
  getAllPatients: async (params = {}) => {
    try {
      return await api.get('/patients', { params });
    } catch (error) {
      console.error('Error getting patients:', error);
      throw error;
    }
  },
  
  getPatientById: async (id: string) => {
    try {
      return await api.get(`/patients/${id}`);
    } catch (error) {
      console.error(`Error getting patient ${id}:`, error);
      throw error;
    }
  },
  
  createPatient: async (patientData: any) => {
    try {
      return await api.post('/patients', patientData);
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },
  
  updatePatient: async (id: string, patientData: any) => {
    try {
      return await api.put(`/patients/${id}`, patientData);
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw error;
    }
  },
  
  deletePatient: async (id: string) => {
    try {
      return await api.delete(`/patients/${id}`);
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  },
  
  getPatientVitals: async (id: string) => {
    try {
      return await api.get(`/patients/${id}/vitals`);
    } catch (error) {
      console.error(`Error getting vitals for patient ${id}:`, error);
      throw error;
    }
  },
  
  addVitalSigns: async (id: string, vitalData: any) => {
    try {
      return await api.post(`/patients/${id}/vitals`, vitalData);
    } catch (error) {
      console.error(`Error adding vitals for patient ${id}:`, error);
      throw error;
    }
  },
  
  getPatientLabs: async (id: string) => {
    try {
      return await api.get(`/patients/${id}/labs`);
    } catch (error) {
      console.error(`Error getting labs for patient ${id}:`, error);
      throw error;
    }
  },
  
  addLabResults: async (id: string, labData: any) => {
    try {
      return await api.post(`/patients/${id}/labs`, labData);
    } catch (error) {
      console.error(`Error adding labs for patient ${id}:`, error);
      throw error;
    }
  }
};

export const analyticsService = {
  getAnalytics: async () => {
    try {
      return await api.get('/analytics');
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  },
  
  getMonthlyData: async () => {
    try {
      return await api.get('/analytics/monthly');
    } catch (error) {
      console.error('Error getting monthly data:', error);
      throw error;
    }
  },
  
  getDepartmentData: async () => {
    try {
      return await api.get('/analytics/departments');
    } catch (error) {
      console.error('Error getting department data:', error);
      throw error;
    }
  },
  
  getDetectionRate: async () => {
    try {
      return await api.get('/analytics/detection-rate');
    } catch (error) {
      console.error('Error getting detection rate:', error);
      throw error;
    }
  },
  
  getPatientOutcomes: async () => {
    try {
      return await api.get('/analytics/outcomes');
    } catch (error) {
      console.error('Error getting patient outcomes:', error);
      throw error;
    }
  },
  
  getRiskDistribution: async () => {
    try {
      return await api.get('/analytics/risk-distribution');
    } catch (error) {
      console.error('Error getting risk distribution:', error);
      throw error;
    }
  }
};

export const doctorService = {
  getAllDoctors: async (params = {}) => {
    try {
      return await api.get('/doctors', { params });
    } catch (error) {
      console.error('Error getting doctors:', error);
      throw error;
    }
  },
  
  getDoctorById: async (id: string) => {
    try {
      return await api.get(`/doctors/${id}`);
    } catch (error) {
      console.error(`Error getting doctor ${id}:`, error);
      throw error;
    }
  },
  
  createDoctor: async (doctorData: any) => {
    try {
      return await api.post('/doctors', doctorData);
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  },
  
  updateDoctor: async (id: string, doctorData: any) => {
    try {
      return await api.put(`/doctors/${id}`, doctorData);
    } catch (error) {
      console.error(`Error updating doctor ${id}:`, error);
      throw error;
    }
  },
  
  deleteDoctor: async (id: string) => {
    try {
      return await api.delete(`/doctors/${id}`);
    } catch (error) {
      console.error(`Error deleting doctor ${id}:`, error);
      throw error;
    }
  }
};

// Export the API instance for direct use if needed
export default api;
