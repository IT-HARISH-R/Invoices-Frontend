import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([
    { id: 1, product: '', quantity: 1, price: 0, total: 0 }
  ]);

  const customers = [
    { id: 1, name: 'Raja Kumar' },
    { id: 2, name: 'Priya Sharma' },
    { id: 3, name: 'Arun Raj' },
  ];

  const products = [
    { id: 1, name: 'Laptop', price: 45000 },
    { id: 2, name: 'Mouse', price: 500 },
    { id: 3, name: 'Keyboard', price: 1200 },
  ];

  const addRow = () => {
    setItems([...items, { 
      id: items.length + 1, 
      product: '', 
      quantity: 1, 
      price: 0, 
      total: 0 
    }]);
  };

  const removeRow = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        if (field === 'product') {
          const selectedProduct = products.find(p => p.name === value);
          if (selectedProduct) {
            updated.price = selectedProduct.price;
            updated.total = selectedProduct.price * updated.quantity;
          }
        }
        
        if (field === 'quantity' || field === 'price') {
          updated.total = updated.quantity * updated.price;
        }
        
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + gst;

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call pannanum
    console.log({ customer, items, subtotal, gst, total });
    navigate('/invoices');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Invoice</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Customer Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Select Customer</label>
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a customer...</option>
            {customers.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Products</label>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-2">Product</th>
                  <th className="text-left py-2 px-2">Quantity</th>
                  <th className="text-left py-2 px-2">Price (₹)</th>
                  <th className="text-left py-2 px-2">Total (₹)</th>
                  <th className="text-left py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-2">
                      <select
                        value={item.product}
                        onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        required
                      >
                        <option value="">Select</option>
                        {products.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-20 px-2 py-1 border rounded"
                        required
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                        className="w-24 px-2 py-1 border rounded"
                        readOnly
                      />
                    </td>
                    <td className="py-2 px-2 font-medium">₹{item.total}</td>
                    <td className="py-2 px-2">
                      <button
                        type="button"
                        onClick={() => removeRow(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            type="button"
            onClick={addRow}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Product
          </button>
        </div>

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>GST (18%):</span>
                <span className="font-medium">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold border-t">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;