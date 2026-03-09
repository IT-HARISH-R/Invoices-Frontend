import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/dashboard');
      return response.data; // Returns { stats, recentInvoices }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },

  // Format currency
  formatCurrency: (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Format date
  formatDate: (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  }
};

export default dashboardService;