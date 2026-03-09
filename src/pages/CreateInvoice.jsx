import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  User, 
  Package, 
  IndianRupee, 
  Percent,
  AlertCircle,
  Calculator
} from 'lucide-react';
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
      gstRate: 0,
      taxableValue: 0,
      cgst: 0,
      sgst: 0,
      total: 0
    }
  ]);

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
          const selectedProduct = products.find(p => p._id === value);
          if (selectedProduct) {
            updated = {
              ...updated,
              productId: selectedProduct._id,
              product: selectedProduct.name,
              price: selectedProduct.price,
              gstRate: selectedProduct.gstRate || 18
            };
          }
        }

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
      const invoiceData = {
        customer: selectedCustomer,
        items: items.map(item => ({
          product: item.productId,
          quantity: item.quantity
        }))
      };

      await invoiceService.createInvoice(invoiceData);
      alert('Invoice created successfully!');
      navigate('/invoices');
    } catch (err) {
      setError(err.message || 'Failed to create invoice');
      console.error('Error creating invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading && customers.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-sm sm:text-base text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:w-[60vw] lg:w-[70vw] xl:w-[78vw]  2xl:w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Create New Invoice</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Fill in the details to generate a new invoice
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => navigate('/invoices')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        {/* Customer Selection */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Select Customer <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base appearance-none bg-white"
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
        </div>

        {/* Items Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-gray-700 font-medium text-sm sm:text-base">
              Products <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addRow}
              disabled={loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs sm:text-sm disabled:opacity-50"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">Product</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">Qty</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">Price (₹)</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">GST%</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">Taxable</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">CGST</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">SGST</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs">Total</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-semibold text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                        className="w-48 px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
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
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-20 px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={item.price}
                          className="w-24 pl-6 pr-2 py-1.5 border border-gray-300 rounded bg-gray-50 text-sm"
                          readOnly
                          disabled
                        />
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="relative">
                        <input
                          type="number"
                          value={item.gstRate}
                          className="w-20 px-2 py-1.5 border border-gray-300 rounded bg-gray-50 text-sm"
                          readOnly
                          disabled
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 font-medium text-sm">{formatCurrency(item.taxableValue)}</td>
                    <td className="py-2 px-3 text-green-600 text-sm">{formatCurrency(item.cgst)}</td>
                    <td className="py-2 px-3 text-green-600 text-sm">{formatCurrency(item.sgst)}</td>
                    <td className="py-2 px-3 font-bold text-sm">{formatCurrency(item.total)}</td>
                    <td className="py-2 px-3">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(item.id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition"
                          disabled={loading}
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-2 text-gray-600 font-semibold text-xs">Product</th>
                  <th className="text-left py-2 px-2 text-gray-600 font-semibold text-xs">Qty</th>
                  <th className="text-left py-2 px-2 text-gray-600 font-semibold text-xs">Price</th>
                  <th className="text-left py-2 px-2 text-gray-600 font-semibold text-xs">GST%</th>
                  <th className="text-left py-2 px-2 text-gray-600 font-semibold text-xs">Taxable</th>
                  <th className="text-left py-2 px-2 text-gray-600 font-semibold text-xs">Total</th>
                  <th className="text-left py-2 px-2 text-gray-600 font-semibold text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-2">
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                        className="w-40 px-2 py-1 border border-gray-300 rounded text-sm"
                        required
                        disabled={loading}
                      >
                        <option value="">Select</option>
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name}
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
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        required
                      />
                    </td>
                    <td className="py-2 px-2 text-sm">{formatCurrency(item.price)}</td>
                    <td className="py-2 px-2 text-sm">{item.gstRate}%</td>
                    <td className="py-2 px-2 text-sm">{formatCurrency(item.taxableValue)}</td>
                    <td className="py-2 px-2 font-bold text-sm">{formatCurrency(item.total)}</td>
                    <td className="py-2 px-2">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-700">Item #{index + 1}</h4>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product._id} value={product._id}>
                          {product.name} - ₹{product.price} (GST: {product.gstRate || 18}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price</label>
                      <input
                        type="text"
                        value={formatCurrency(item.price)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">GST Rate</label>
                      <input
                        type="text"
                        value={`${item.gstRate}%`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Taxable</label>
                      <input
                        type="text"
                        value={formatCurrency(item.taxableValue)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm font-medium"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">CGST</label>
                      <input
                        type="text"
                        value={formatCurrency(item.cgst)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-green-50 text-green-700 text-sm"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">SGST</label>
                      <input
                        type="text"
                        value={formatCurrency(item.sgst)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-green-50 text-green-700 text-sm"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Item Total:</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(item.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Product</span>
            </button>
          </div>
        </div>

        {/* Summary Totals */}
        <div className="border-t pt-4 sm:pt-6">
          <div className="flex justify-end">
            <div className="w-full sm:w-96 space-y-2">
              <div className="flex justify-between py-2 text-sm sm:text-base">
                <span className="text-gray-600">Total Taxable Value:</span>
                <span className="font-medium">{formatCurrency(totalTaxableValue)}</span>
              </div>
              
              <div className="flex justify-between py-2 text-sm sm:text-base">
                <span className="text-gray-600">Total CGST:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalCGST)}</span>
              </div>
              
              <div className="flex justify-between py-2 text-sm sm:text-base">
                <span className="text-gray-600">Total SGST:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalSGST)}</span>
              </div>

              <div className="flex justify-between py-2 bg-blue-50 rounded-lg px-3">
                <span className="text-gray-700 font-medium text-sm sm:text-base">Total GST:</span>
                <span className="font-bold text-blue-600">{formatCurrency(totalCGST + totalSGST)}</span>
              </div>

              <div className="flex justify-between py-3 text-base sm:text-lg font-bold border-t">
                <span>Invoice Total:</span>
                <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-4 py-2.5 sm:px-6 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium w-full sm:w-auto"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base font-medium w-full sm:w-auto ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Save Invoice</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;