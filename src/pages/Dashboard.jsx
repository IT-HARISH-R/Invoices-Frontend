import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, FileText, DollarSign, PlusCircle } from 'lucide-react';
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
    const stats = dashboardData?.stats || {
      totalCustomers: 0,
      totalProducts: 0,
      totalInvoices: 0,
      totalRevenue: 0
    };

    return [
      {
        title: 'Total Customers',
        value: stats.totalCustomers || 0,
        icon: Users,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
      },
      {
        title: 'Total Products',
        value: stats.totalProducts || 0,
        icon: Package,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600'
      },
      {
        title: 'Total Invoices',
        value: stats.totalInvoices || 0,
        icon: FileText,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600'
      },
      {
        title: 'Total Revenue',
        value: dashboardService.formatCurrency(stats.totalRevenue || 0),
        icon: DollarSign,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600'
      },
    ];
  };

  // Quick actions
  const quickActions = [
    { label: 'New Invoice', icon: FileText, path: '/invoices/create', color: 'bg-blue-600' },
    { label: 'Add Customer', icon: Users, path: '/customers', color: 'bg-green-600' },
    { label: 'Add Product', icon: Package, path: '/products', color: 'bg-purple-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 md:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto space-x-2 w-full sm:w-auto"
          >
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const statsCards = getStatsCards();
  const recentInvoices = dashboardData?.recentInvoices || [];

  return (
    <div className="space-y-4 md:space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 text-xs md:text-sm mt-1">Welcome back! Here's an overview of your business.</p>
        </div>
      </div>

      {/* Quick Actions - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-lg shadow-sm p-3 md:p-4 hover:shadow-md transition flex items-center space-x-3 group border border-gray-100"
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition flex-shrink-0`}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-gray-800 text-sm md:text-base truncate">{action.label}</p>
                <p className="text-xs text-gray-500 hidden sm:block">Click to create</p>
              </div>
              <PlusCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="space-y-1 md:space-y-2 min-w-0">
                  <p className="text-gray-500 text-xs md:text-sm truncate">{stat.title}</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800 truncate">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 md:w-12 md:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
                  <Icon className={`w-4 h-4 md:w-6 md:h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Invoices</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Your latest 5 invoices</p>
          </div>
          <button
            onClick={() => navigate('/invoices/create')}
            className="mt-3 sm:mt-0 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs md:text-sm flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <PlusCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span>New Invoice</span>
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm md:text-base">No recent invoices found</p>
            <button
              onClick={() => navigate('/invoices/create')}
              className="mt-4 text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium"
            >
              Create your first invoice →
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-600 font-medium text-sm">Invoice #</th>
                    <th className="text-left py-3 text-gray-600 font-medium text-sm">Customer</th>
                    <th className="text-left py-3 text-gray-600 font-medium text-sm">Date</th>
                    <th className="text-right py-3 text-gray-600 font-medium text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                    >
                      <td className="py-3 text-gray-800 font-medium">{invoice.invoiceNumber}</td>
                      <td className="py-3 text-gray-800">{invoice.customer?.name || 'N/A'}</td>
                      <td className="py-3 text-gray-600">
                        {dashboardService.formatDate(invoice.createdAt)}
                      </td>
                      <td className="py-3 text-gray-800 font-medium text-right">
                        {dashboardService.formatCurrency(invoice.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice._id}
                  onClick={() => navigate(`/invoices/${invoice._id}`)}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100 active:bg-gray-100 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800 text-sm">{invoice.invoiceNumber}</span>
                    <span className="text-blue-600 font-medium text-sm">
                      {dashboardService.formatCurrency(invoice.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">{invoice.customer?.name || 'N/A'}</span>
                    <span className="text-gray-400 text-xs">
                      {dashboardService.formatDate(invoice.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 md:mt-6 text-center">
              <button
                onClick={() => navigate('/invoices')}
                className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium inline-flex items-center space-x-1"
              >
                <span>View All Invoices</span>
                <span>→</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;