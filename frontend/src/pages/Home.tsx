import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const { data, isLoading } = useProducts({ limit: 8, sort: 'createdAt', order: 'desc' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl overflow-hidden mt-8 mb-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-24 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to ShopHub
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop the latest trends and find everything you need.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Star className="w-8 h-8 text-primary-600" />
            <span>Featured Products</span>
          </h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.products?.slice(0, 4).map((product) => (
              <Link
                key={product._id}
                to={`/products/${product.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.featured && (
                    <span className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary-600">₹{product.price.toLocaleString('en-IN')}</p>
                    {product.stock === 0 && (
                      <span className="text-red-600 text-sm font-medium">Out of stock</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <ShoppingBag className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Wide Selection</h3>
          <p className="text-gray-600">Thousands of products to choose from</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <Star className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
          <p className="text-gray-600">Only the best products for you</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-md">
          <ArrowRight className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Quick and reliable shipping</p>
        </div>
      </div>
    </div>
  );
}
