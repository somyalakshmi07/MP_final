import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">Products</h2>
          <p className="text-gray-600">Manage products and inventory</p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">Orders</h2>
          <p className="text-gray-600">View and manage orders</p>
        </Link>
        <Link
          to="/admin/categories"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          <p className="text-gray-600">Manage product categories</p>
        </Link>
      </div>
    </div>
  );
}

