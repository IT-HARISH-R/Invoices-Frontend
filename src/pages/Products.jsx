import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Package, DollarSign, Percent, FileText, Building } from 'lucide-react';
import productService from '../services/productService';

const Products = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    gst: 18,
    description: '',
    company: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      gst: product.gstRate || 18,
      description: product.description || '',
      company: product.company?._id || ''
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      gst: 18,
      description: '',
      company: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData);
      } else {
        await productService.createProduct(formData);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
    } finally {
      setModalLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.price?.toString().includes(search)
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:w-[60vw] lg:w-[70vw] xl:w-[78vw]  2xl:w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Products</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your product catalog
          </p>
        </div>
        
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full lg:w-2/3 xl:w-1/2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search products by name, description or price..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12 sm:py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-3 text-sm sm:text-base text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Name</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Description</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Price</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">GST</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="border-t hover:bg-gray-50 transition">
                        <td className="py-4 px-4 lg:px-6 text-gray-800 font-medium text-sm lg:text-base">
                          {product.name}
                        </td>
                        <td className="py-4 px-4 lg:px-6 text-gray-600 text-sm lg:text-base max-w-xs truncate">
                          {product.description || '-'}
                        </td>
                        <td className="py-4 px-4 lg:px-6 text-gray-800 font-medium text-sm lg:text-base">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="py-4 px-4 lg:px-6 text-gray-800 text-sm lg:text-base">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {product.gstRate}%
                          </span>
                        </td>
                        <td className="py-4 px-4 lg:px-6">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="inline-flex items-center gap-1 px-2 lg:px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition text-xs lg:text-sm"
                              title="Edit product"
                            >
                              <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span className="hidden lg:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="inline-flex items-center gap-1 px-2 lg:px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition text-xs lg:text-sm"
                              title="Delete product"
                            >
                              <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span className="hidden lg:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-base">No products found</p>
                <button
                  onClick={handleAdd}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add your first product</span>
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">ID: {product._id.slice(-6)}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {product.gstRate}% GST
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {product.description && (
                      <div className="flex items-start text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2 text-gray-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{product.description}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span className="font-semibold text-gray-800">{formatCurrency(product.price)}</span>
                    </div>

                    {product.company && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        <span>{product.company.name || 'Company'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium inline-flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium inline-flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {filteredProducts.length > 0 && (
            <div className="text-sm lg:text-base text-gray-500 mt-4">
              Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
              <span className="font-medium">{products.length}</span> products
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl p-5 sm:p-6 lg:p-8 w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 lg:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 lg:space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    placeholder="Enter product name"
                    required
                    disabled={modalLoading}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    placeholder="Enter product description"
                    rows="3"
                    disabled={modalLoading}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-8 pr-3 py-2.5 lg:pl-10 lg:pr-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                      placeholder="0.00"
                      required
                      disabled={modalLoading}
                    />
                  </div>
                </div>

                {/* GST Rate */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">
                    GST Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    required
                    disabled={modalLoading}
                  >
                    <option value={0}>0% (No GST)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 lg:mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 lg:px-6 lg:py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm lg:text-base font-medium w-full sm:w-auto"
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className={`px-4 py-2.5 lg:px-6 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base font-medium w-full sm:w-auto ${
                    modalLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {modalLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {editingProduct ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;