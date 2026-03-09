import api from './api';

const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('api/products');
      return response.data.products; // Backend returns { products: [...] }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get single product
  getProductById: async (id) => {
    try {
      const response = await api.get(`api/products/${id}`);
      return response.data.product;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('api/products/create', {
        name: productData.name,
        price: productData.price,
        gstRate: productData.gst, // Note: backend uses gstRate
        description: productData.description || '',

      });
      return response.data; // { message: "Product created successfully", product }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`api/products/${id}`, {
        name: productData.name,
        price: productData.price,
        gstRate: productData.gst,
        description: productData.description || '',

      });
      return response.data; // { message: "Product updated successfully", product }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`api/products/${id}`);
      return response.data; // { message: "Product deleted successfully" }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  }
};

export default productService;