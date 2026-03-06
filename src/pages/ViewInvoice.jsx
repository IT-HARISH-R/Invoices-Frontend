import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data - API call pannanum
  const invoice = {
    no: 'INV-001',
    date: '2026-03-01',
    customer: {
      name: 'Raja Kumar',
      email: 'raja@email.com',
      phone: '9876543210',
      gst: '33AABCU9603R1ZM'
    },
    items: [
      { product: 'Laptop', qty: 1, price: 45000, total: 45000 },
      { product: 'Mouse', qty: 2, price: 500, total: 1000 },
    ],
    subtotal: 46000,
    gst: 8280,
    total: 54280
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoice #{invoice.no}</h1>
        <div className="space-x-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🖨️ Print / PDF
          </button>
          <button
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>

      {/* Invoice Content - Print Friendly */}
      <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Company Name</h2>
            <p className="text-gray-600">123 Business Street</p>
            <p className="text-gray-600">GST: 33ABCDE1234F1Z5</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-gray-800">INVOICE</h3>
            <p className="text-gray-600">#{invoice.no}</p>
            <p className="text-gray-600">Date: {invoice.date}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Bill To:</h4>
          <p className="text-gray-800">{invoice.customer.name}</p>
          <p className="text-gray-600">{invoice.customer.email}</p>
          <p className="text-gray-600">{invoice.customer.phone}</p>
          <p className="text-gray-600">GST: {invoice.customer.gst}</p>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2">Product</th>
              <th className="text-right py-3 px-2">Qty</th>
              <th className="text-right py-3 px-2">Price (₹)</th>
              <th className="text-right py-3 px-2">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-3 px-2">{item.product}</td>
                <td className="text-right py-3 px-2">{item.qty}</td>
                <td className="text-right py-3 px-2">₹{item.price}</td>
                <td className="text-right py-3 px-2">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>GST (18%):</span>
              <span>₹{invoice.gst}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold border-t">
              <span>Total:</span>
              <span>₹{invoice.total}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Total in words: Rupees {invoice.total} only
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>Thank you for your business!</p>
          <p className="text-sm">This is a computer generated invoice</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;