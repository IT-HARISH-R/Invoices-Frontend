import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;