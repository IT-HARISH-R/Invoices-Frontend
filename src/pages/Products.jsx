import React, { useState } from 'react';

const Products = () => {
  const [search, setSearch] = useState('');
  
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', price: 45000, hsn: '84713000', gst: 18 },
    { id: 2, name: 'Mouse', price: 500, hsn: '84716000', gst: 12 },
    { id: 3, name: 'Keyboard', price: 1200, hsn: '84716000', gst: 12 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', hsn: '', gst: '' });

  const handleDelete = (id) => {
    if (confirm('Are you sure?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Price (₹)</th>
              <th className="text-left py-3 px-4">HSN Code</th>
              <th className="text-left py-3 px-4">GST (%)</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">₹{product.price}</td>
                <td className="py-3 px-4">{product.hsn}</td>
                <td className="py-3 px-4">{product.gst}%</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                  <button 
                    onClick={() => handleDelete(product.id)}
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
    </div>
  );
};

export default Products;