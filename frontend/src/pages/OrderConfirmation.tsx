import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useOrder(orderId || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-blue"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link to="/orders" className="text-dark-blue hover:text-light-blue">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-green-100 text-lg">Thank you for your purchase</p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{order._id.slice(-8).toUpperCase()}</h2>
              <p className="text-gray-600">
                Order placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Package className="w-6 h-6 text-dark-blue mr-2" />
                  <h3 className="font-semibold text-gray-900">Order Status</h3>
                </div>
                <p className={`text-lg font-bold ${
                  order.status === 'Completed' ? 'text-green-600' :
                  order.status === 'Cancelled' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {order.status}
                </p>
              </div>

              {/* Payment Status */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-6 h-6 text-dark-blue mr-2" />
                  <h3 className="font-semibold text-gray-900">Payment Status</h3>
                </div>
                <p className={`text-lg font-bold ${
                  order.paymentStatus === 'Paid' ? 'text-green-600' :
                  order.paymentStatus === 'Failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {order.paymentStatus}
                </p>
                {order.paymentId && (
                  <p className="text-sm text-gray-600 mt-2">Transaction: {order.paymentId}</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-dark-blue mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Shipping Address</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-dark-blue">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/orders"
                className="flex-1 bg-dark-blue text-white px-6 py-3 rounded-lg hover:bg-light-blue transition text-center font-semibold"
              >
                View All Orders
              </Link>
              <Link
                to="/products"
                className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition text-center font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

