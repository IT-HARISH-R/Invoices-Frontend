import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../services/invoiceService';
import customerService from '../services/customerService';
import productService from '../services/productService';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data from backend
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form states
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([
    {
      id: 1,
      product: '',
      productId: '',
      quantity: 1,
      price: 0,
      gstRate: 0, // Add GST rate per product
      taxableValue: 0, // Price * quantity
      cgst: 0, // (taxableValue * gstRate/2) / 100
      sgst: 0, // (taxableValue * gstRate/2) / 100
      total: 0 // taxableValue + cgst + sgst
    }
  ]);
  console.log(items)
  // Fetch customers and products on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersData, productsData] = await Promise.all([
        customerService.getAllCustomers(),
        productService.getAllProducts()
      ]);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    setItems([...items, {
      id: items.length + 1,
      product: '',
      productId: '',
      quantity: 1,
      price: 0,
      gstRate: 0,
      taxableValue: 0,
      cgst: 0,
      sgst: 0,
      total: 0
    }]);
  };

  const removeRow = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calculateItemTotals = (item) => {
    const taxableValue = item.price * item.quantity;
    const cgst = (taxableValue * (item.gstRate / 2)) / 100;
    const sgst = (taxableValue * (item.gstRate / 2)) / 100;
    const total = taxableValue + cgst + sgst;

    return {
      ...item,
      taxableValue,
      cgst,
      sgst,
      total
    };
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        let updated = { ...item, [field]: value };

        if (field === 'product') {
          // Find selected product from products list
          const selectedProduct = products.find(p => p._id === value);
          if (selectedProduct) {
            updated = {
              ...updated,
              productId: selectedProduct._id,
              product: selectedProduct.name,
              price: selectedProduct.price,
              gstRate: selectedProduct.gstRate 
            };
          }
        }

        // Recalculate totals whenever price, quantity, or gstRate changes
        return calculateItemTotals(updated);
      }
      return item;
    }));
  };

  const calculateSummary = () => {
    const totalTaxableValue = items.reduce((sum, item) => sum + (item.taxableValue || 0), 0);
    const totalCGST = items.reduce((sum, item) => sum + (item.cgst || 0), 0);
    const totalSGST = items.reduce((sum, item) => sum + (item.sgst || 0), 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);

    return { totalTaxableValue, totalCGST, totalSGST, totalAmount };
  };

  const { totalTaxableValue, totalCGST, totalSGST, totalAmount } = calculateSummary();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }

    if (items.some(item => !item.productId)) {
      setError('Please select products for all rows');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format data for backend - Note: Backend calculates GST from subtotal
      // If backend uses fixed 18%, it will override item GST rates
      const invoiceData = {
        // company: "67d0c0d6f2a1b2c3d4e5f6a7", // You need to get this from context/localStorage
        customer: selectedCustomer,
        items: items.map(item => ({
          product: item.productId,
          quantity: item.quantity
        }))
      };

      const response = await invoiceService.createInvoice(invoiceData);

      // Show success message
      alert('Invoice created successfully!');

      // Navigate to invoices list
      navigate('/invoices');

    } catch (err) {
      setError(err.message || 'Failed to create invoice');
      console.error('Error creating invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Invoice</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Customer Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Customer <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          >
            <option value="">Choose a customer...</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>
                {customer.name} - {customer.email}
              </option>
            ))}
          </select>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Products <span className="text-red-500">*</span>
          </label>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-2">Product</th>
                  <th className="text-left py-2 px-2">Quantity</th>
                  <th className="text-left py-2 px-2">Price (₹)</th>
                  <th className="text-left py-2 px-2">GST (%)</th>
                  <th className="text-left py-2 px-2">Taxable</th>
                  <th className="text-left py-2 px-2">CGST</th>
                  <th className="text-left py-2 px-2">SGST</th>
                  <th className="text-left py-2 px-2">Total (₹)</th>
                  <th className="text-left py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-2 px-2">
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                        disabled={loading}
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name} - ₹{product.price} (GST: {product.gstRate || 18}%)
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={item.price}
                        className="w-24 px-2 py-1 border rounded bg-gray-50"
                        readOnly
                        disabled
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={item.gstRate}
                        onChange={(e) => updateItem(item.id, 'gstRate', Number(e.target.value))}
                        className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="0"
                        max="28"
                        step="0.1"
                        disabled={loading}
                      />
                    </td>
                    <td className="py-2 px-2 font-medium">₹{item.taxableValue.toFixed(2)}</td>
                    <td className="py-2 px-2 text-green-600">₹{item.cgst.toFixed(2)}</td>
                    <td className="py-2 px-2 text-green-600">₹{item.sgst.toFixed(2)}</td>
                    <td className="py-2 px-2 font-bold">₹{item.total.toFixed(2)}</td>
                    <td className="py-2 px-2">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(item.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addRow}
            disabled={loading}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
          >
            + Add Product
          </button>
        </div>

        {/* Summary Totals */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-80">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Total Taxable Value:</span>
                <span className="font-medium">₹{totalTaxableValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Total CGST:</span>
                <span className="font-medium text-green-600">₹{totalCGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Total SGST:</span>
                <span className="font-medium text-green-600">₹{totalSGST.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 bg-blue-50 rounded-lg px-2">
                <span className="text-gray-700 font-medium">Total GST (CGST+SGST):</span>
                <span className="font-bold text-blue-600">₹{(totalCGST + totalSGST).toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 text-lg font-bold border-t">
                <span>Invoice Total:</span>
                <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Save Invoice'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;