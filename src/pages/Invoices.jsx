import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const invoices = [
    { id: 1, no: 'INV-001', customer: 'Raja Kumar', date: '2026-03-01', amount: 5200, status: 'Paid' },
    { id: 2, no: 'INV-002', customer: 'Priya Sharma', date: '2026-03-02', amount: 3800, status: 'Unpaid' },
    { id: 3, no: 'INV-003', customer: 'Arun Raj', date: '2026-03-03', amount: 7500, status: 'Paid' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <button
          onClick={() => navigate('/invoices/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Create Invoice
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by invoice # or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">Invoice #</th>
              <th className="text-left py-3 px-4">Customer</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{inv.no}</td>
                <td className="py-3 px-4">{inv.customer}</td>
                <td className="py-3 px-4">{inv.date}</td>
                <td className="py-3 px-4">₹{inv.amount}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    inv.status === 'Paid' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => navigate(`/invoices/${inv.id}`)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    View
                  </button>
                  <button className="text-green-600 hover:text-green-800 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;