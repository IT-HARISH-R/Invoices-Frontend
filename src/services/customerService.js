import api from './api';

const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      const response = await api.get('/api/customer');
      return response.data.customers; // Backend returns { customers: [...] }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch customers' };
    }
  },

  // Get single customer
  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/api/customer/${id}`);
      return response.data.customer;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch customer' };
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
        console.log("Create Customer")
      const response = await api.post('/api/customer/create', {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        gstNumber: customerData.gst, // Note: backend uses gstNumber
        // address and company fields optional - modify as needed
        address: customerData.address || '',
        company: customerData.company || null
      });
      console.log(response)
      return response.data; // { message: "Customer created successfully", customer }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create customer' };
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/api/customer/${id}`, {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        gstNumber: customerData.gst,
        address: customerData.address || '',
        company: customerData.company || null
      });
      return response.data; // { message: "Customer updated successfully", customer }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update customer' };
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/api/customer/${id}`);
      return response.data; // { message: "Customer deleted successfully" }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete customer' };
    }
  }
};

export default customerService;