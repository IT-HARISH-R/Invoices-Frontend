import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Dummy data - API call pannanum
  const stats = [
    { title: 'Total Customers', value: '24', icon: '👥', color: 'bg-blue-500' },
    { title: 'Total Products', value: '45', icon: '📦', color: 'bg-green-500' },
    { title: 'Total Invoices', value: '89', icon: '📄', color: 'bg-purple-500' },
    { title: 'Total Revenue', value: '₹1,24,500', icon: '💰', color: 'bg-orange-500' },
  ];

  const recentInvoices = [
    { id: 1, no: 'INV-001', customer: 'Raja Kumar', date: '2026-03-01', amount: '₹5,200', status: 'Paid' },
    { id: 2, no: 'INV-002', customer: 'Priya Sharma', date: '2026-03-02', amount: '₹3,800', status: 'Unpaid' },
    { id: 3, no: 'INV-003', customer: 'Arun Raj', date: '2026-03-03', amount: '₹7,500', status: 'Paid' },
    { id: 4, no: 'INV-004', customer: 'Meena Devi', date: '2026-03-04', amount: '₹2,100', status: 'Paid' },
    { id: 5, no: 'INV-005', customer: 'Suresh Kumar', date: '2026-03-05', amount: '₹9,300', status: 'Unpaid' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Invoices</h2>
          <button
            onClick={() => navigate('/invoices/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            + New Invoice
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-gray-600 font-medium">Invoice #</th>
                <th className="text-left py-3 text-gray-600 font-medium">Customer</th>
                <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                <th className="text-left py-3 text-gray-600 font-medium">Amount</th>
                <th className="text-left py-3 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-gray-800">{inv.no}</td>
                  <td className="py-3 text-gray-800">{inv.customer}</td>
                  <td className="py-3 text-gray-800">{inv.date}</td>
                  <td className="py-3 text-gray-800">{inv.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      inv.status === 'Paid' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/invoices')}
            className="text-blue-600 hover:underline text-sm"
          >
            View All Invoices →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;