import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menu = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/customers', name: 'Customers', icon: '👥' },
    { path: '/products', name: 'Products', icon: '📦' },
    { path: '/invoices', name: 'Invoices', icon: '📄' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md fixed left-0 top-0 h-screen pt-16">
      <nav className="p-4">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;