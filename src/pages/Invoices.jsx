import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, Download, Eye, Calendar, User, DollarSign, File, AlertCircle } from 'lucide-react';
import invoiceService from '../services/invoiceService';

const Invoices = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      await invoiceService.downloadInvoicePDF(id);
    } catch (err) {
      alert(err.message || 'Failed to download PDF');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter invoices based on search
  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Invoices</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage and track all your invoices
          </p>
        </div>
        
        <button
          onClick={() => navigate('/invoices/create')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full lg:w-2/3 xl:w-1/2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search by invoice number or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12 sm:py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-3 text-sm sm:text-base text-gray-600">Loading invoices...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Invoice #</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Customer</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Date</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Amount</th>
                    <th className="text-left py-4 px-4 lg:px-6 text-gray-600 font-semibold text-xs lg:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice._id} className="border-t hover:bg-gray-50 transition">
                        <td className="py-4 px-4 lg:px-6">
                          <span className="font-medium text-gray-800 text-sm lg:text-base">
                            {invoice.invoiceNumber}
                          </span>
                        </td>
                        <td className="py-4 px-4 lg:px-6 text-gray-600 text-sm lg:text-base">
                          {invoice.customer?.name || 'N/A'}
                        </td>
                        <td className="py-4 px-4 lg:px-6 text-gray-600 text-sm lg:text-base">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="py-4 px-4 lg:px-6">
                          <span className="font-semibold text-gray-800 text-sm lg:text-base">
                            {formatCurrency(invoice.totalAmount)}
                          </span>
                        </td>
                        <td className="py-4 px-4 lg:px-6">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <button
                              onClick={() => navigate(`/invoices/${invoice._id}`)}
                              className="inline-flex items-center gap-1 px-2 lg:px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition text-xs lg:text-sm"
                              title="View Invoice"
                            >
                              <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span className="hidden lg:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(invoice._id)}
                              className="inline-flex items-center gap-1 px-2 lg:px-3 py-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition text-xs lg:text-sm"
                              title="Download PDF"
                            >
                              <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span className="hidden lg:inline">PDF</span>
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
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-base">No invoices found</p>
                <button
                  onClick={() => navigate('/invoices/create')}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create your first invoice</span>
                </button>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div key={invoice._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base">{invoice.invoiceNumber}</h3>
                      <p className="text-xs text-gray-500 mt-1">ID: {invoice._id.slice(-6)}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Invoice
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {invoice.customer?.name && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        <span className="truncate">{invoice.customer.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span>{formatDate(invoice.createdAt)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span className="font-semibold text-gray-800">{formatCurrency(invoice.totalAmount)}</span>
                    </div>

                    {invoice.status && (
                      <div className="flex items-center text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium inline-flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(invoice._id)}
                      className="flex-1 py-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium inline-flex items-center justify-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {filteredInvoices.length > 0 && (
            <div className="text-sm lg:text-base text-gray-500 mt-4">
              Showing <span className="font-medium">{filteredInvoices.length}</span> of{' '}
              <span className="font-medium">{invoices.length}</span> invoices
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Invoices;