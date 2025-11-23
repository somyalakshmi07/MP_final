import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Package, ShoppingCart, DollarSign, Tag } from 'lucide-react';

export default function AdminDashboard() {
  const { data: productsData } = useQuery({
    queryKey: ['admin-products-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/products', { params: { limit: 1 } });
      return response.data;
    },
    retry: false,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/orders');
      return response.data;
    },
    retry: false,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories-stats'],
    queryFn: async () => {
      const response = await api.get('/catalog/categories');
      return response.data;
    },
    retry: false,
  });

  const totalProducts = productsData?.pagination?.total || 0;
  const totalOrders = ordersData?.length || 0;
  const totalRevenue = ordersData
    ?.filter((o: any) => o.paymentStatus === 'Paid')
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 0;
  const totalCategories = categoriesData?.length || 0;

  const recentOrders = ordersData?.slice(0, 5) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-dark-blue" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order: any) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              to="/admin/orders"
              className="text-dark-blue hover:text-light-blue font-medium"
            >
              View all orders →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

