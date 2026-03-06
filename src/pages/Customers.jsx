import React, { useState } from 'react';

const Customers = () => {
  const [search, setSearch] = useState('');
  
  // Dummy data
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Raja Kumar', email: 'raja@email.com', phone: '9876543210', gst: '33AABCU9603R1ZM' },
    { id: 2, name: 'Priya Sharma', email: 'priya@email.com', phone: '9876543211', gst: '33AABCU9603R2ZN' },
    { id: 3, name: 'Arun Raj', email: 'arun@email.com', phone: '9876543212', gst: '33AABCU9603R3ZP' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', gst: '' });

  const handleDelete = (id) => {
    if (confirm('Are you sure?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', gst: '' });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id ? { ...formData, id: c.id } : c
      ));
    } else {
      setCustomers([...customers, { ...formData, id: customers.length + 1 }]);
    }
    setShowModal(false);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Phone</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">GST No.</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">{customer.name}</td>
                <td className="py-3 px-4 text-gray-800">{customer.email}</td>
                <td className="py-3 px-4 text-gray-800">{customer.phone}</td>
                <td className="py-3 px-4 text-gray-800">{customer.gst}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add Customer'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm mb-2">GST No.</label>
                <input
                  type="text"
                  value={formData.gst}
                  onChange={(e) => setFormData({...formData, gst: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCustomer ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;