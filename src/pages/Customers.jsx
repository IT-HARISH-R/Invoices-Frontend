import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, User, Mail, Phone, MapPin, Building, FileText } from 'lucide-react';
import customerService from '../services/customerService';

const Customers = () => {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gst: '',
    address: '',
    company: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.deleteCustomer(id);
      fetchCustomers();
    } catch (err) {
      alert(err.message || 'Failed to delete customer');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      gst: customer.gstNumber || '',
      address: customer.address || '',
      company: customer.company?._id || ''
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      gst: '',
      address: '',
      company: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer._id, formData);
      } else {
        await customerService.createCustomer(formData);
      }

      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      alert(err.message || `Failed to ${editingCustomer ? 'update' : 'create'} customer`);
    } finally {
      setModalLoading(false);
    }
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="space-y-4 md:w-[60vw] lg:w-[70vw] xl:w-[78vw]  2xl:w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your customer database
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full lg:w-2/3 xl:w-1/2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search customers by name, email or phone..."
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
          <p className="mt-3 text-sm sm:text-base text-gray-600">Loading customers...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Now properly responsive */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold lg:text-sm">Name</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold  lg:text-sm">Email</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold lg:text-sm">Phone</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold lg:text-sm">GST No.</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold lg:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="border-t hover:bg-gray-50 transition">
                        <td className="py-4 px-4 lg:px-6 text-gray-800 font-medium text-sm lg:text-base">{customer.name}</td>
                        <td className="py-4 px-4 lg:px-6 text-gray-600 text-sm lg:text-base">{customer.email}</td>
                        <td className="py-4 px-4 lg:px-6 text-gray-600 text-sm lg:text-base">{customer.phone || '-'}</td>
                        <td className="py-4 px-4 lg:px-6 text-gray-600 text-sm lg:text-base">{customer.gstNumber || '-'}</td>
                        <td className="py-4 px-4 lg:px-6">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <button
                              onClick={() => handleEdit(customer)}
                              className="inline-flex items-center gap-1 px-2 lg:px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition text-xs lg:text-sm"
                              title="Edit customer"
                            >
                              <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span className="hidden lg:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(customer._id)}
                              className="inline-flex items-center gap-1 px-2 lg:px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition text-xs lg:text-sm"
                              title="Delete customer"
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

          {/* Mobile Card View (visible on mobile) */}
          <div className="md:hidden space-y-3">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-base">No customers found</p>
                <button
                  onClick={handleAdd}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add your first customer</span>
                </button>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base">{customer.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">ID: {customer._id.slice(-6)}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Customer
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {customer.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.gstNumber && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        <span>GST: {customer.gstNumber}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{customer.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium inline-flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
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

          {/* Summary - Now responsive */}
          {filteredCustomers.length > 0 && (
            <div className="text-sm lg:text-base text-gray-500 mt-4">
              Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
              <span className="font-medium">{customers.length}</span> customers
            </div>
          )}
        </>
      )}

      {/* Modal - Fully Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl p-5 sm:p-6 lg:p-8 w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 lg:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Form Fields with better desktop spacing */}
              <div className="space-y-4 lg:space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    placeholder="Enter customer name"
                    required
                    disabled={modalLoading}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    placeholder="customer@example.com"
                    required
                    disabled={modalLoading}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    placeholder="+91 98765 43210"
                    disabled={modalLoading}
                  />
                </div>

                {/* GST Field */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">GST Number</label>
                  <input
                    type="text"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    placeholder="22AAAAA0000A1Z5"
                    disabled={modalLoading}
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-gray-700 text-sm lg:text-base font-medium mb-1.5">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    placeholder="Enter full address"
                    rows="3"
                    disabled={modalLoading}
                  />
                </div>
              </div>

              {/* Modal Footer - Better desktop layout */}
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
                  className={`px-4 py-2.5 lg:px-6 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base font-medium w-full sm:w-auto ${modalLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {modalLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {editingCustomer ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    editingCustomer ? 'Update Customer' : 'Add Customer'
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

export default Customers;