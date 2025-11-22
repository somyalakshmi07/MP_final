import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCart } from '../hooks/useCart';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cartItemCount = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-white shadow-sm border-b border-light-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-dark-blue">
                  ShopHub
                </span>
              </Link>
              <div className="hidden md:ml-8 md:flex md:space-x-6">
                <Link
                  to="/products"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-black hover:text-dark-blue transition"
                >
                  Products
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart icon - always visible (works for both authenticated and guest users) */}
              <Link
                to="/cart"
                className="relative text-sm text-black hover:text-dark-blue font-medium flex items-center space-x-1"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-dark-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              {isAuthenticated() ? (
                <>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="text-sm text-black hover:text-dark-blue font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="text-sm text-black hover:text-dark-blue font-medium"
                  >
                    Orders
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-black">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-black hover:text-dark-blue font-medium flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-black hover:text-dark-blue font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-light-blue transition font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-black hover:text-dark-blue"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/products"
                className="block px-3 py-2 text-base font-medium text-black hover:text-dark-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {/* Cart - always visible */}
              <Link
                to="/cart"
                className="block px-3 py-2 text-base font-medium text-black hover:text-dark-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
              {isAuthenticated() && (
                <>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base font-medium text-black hover:text-dark-blue"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-base font-medium text-black hover:text-dark-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <div className="px-3 py-2 text-base font-medium text-black">
                    {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated() && (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-black hover:text-dark-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-black hover:text-dark-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">ShopHub</h3>
              <p className="text-black/70 text-sm">
                Your one-stop shop for all your needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/products" className="text-black/70 hover:text-dark-blue">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="text-black/70 hover:text-dark-blue">
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Contact</h3>
              <p className="text-black/70 text-sm">
                support@shophub.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-black/60">
            © 2024 ShopHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
