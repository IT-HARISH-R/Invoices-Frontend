import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCustomers: 0,
      totalProducts: 0,
      totalInvoices: 0,
      totalRevenue: 0
    },
    recentInvoices: []
  });

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardService.getDashboardStats();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Stats cards configuration
  const getStatsCards = () => {
    const { totalCustomers, totalProducts, totalInvoices, totalRevenue } = dashboardData.stats;
    
    return [
      { 
        title: 'Total Customers', 
        value: totalCustomers, 
        icon: '👥', 
        color: 'bg-blue-500' 
      },
      { 
        title: 'Total Products', 
        value: totalProducts, 
        icon: '📦', 
        color: 'bg-green-500' 
      },
      { 
        title: 'Total Invoices', 
        value: totalInvoices, 
        icon: '📄', 
        color: 'bg-purple-500' 
      },
      { 
        title: 'Total Revenue', 
        value: dashboardService.formatCurrency(totalRevenue), 
        icon: '💰', 
        color: 'bg-orange-500' 
      },
    ];
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statsCards = getStatsCards();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
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

        {dashboardData.recentInvoices.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No recent invoices found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-gray-600 font-medium">Invoice #</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Customer</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                    <th className="text-left py-3 text-gray-600 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentInvoices.map((invoice) => (
                    <tr 
                      key={invoice._id} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                    >
                      <td className="py-3 text-gray-800 font-medium">{invoice.invoiceNumber}</td>
                      <td className="py-3 text-gray-800">{invoice.customer?.name || 'N/A'}</td>
                      <td className="py-3 text-gray-600">{dashboardService.formatDate(invoice.createdAt)}</td>
                      <td className="py-3 text-gray-800 font-medium">
                        {dashboardService.formatCurrency(invoice.totalAmount)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;