import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Filter invoices based on search
  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <button
          onClick={() => navigate('/invoices/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Create Invoice
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by invoice # or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading invoices...</p>
        </div>
      ) : (
        /* Invoices Table */
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Invoice #</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {invoice.customer?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {invoiceService.formatDate(invoice.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      ₹{invoice.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        title="View Invoice"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(invoice._id)}
                        className="text-green-600 hover:text-green-800 mr-3"
                        title="Download PDF"
                      >
                        PDF
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Invoices;