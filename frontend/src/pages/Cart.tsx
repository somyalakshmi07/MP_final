import { useCart, useUpdateCartItem, useRemoveFromCart } from '../hooks/useCart';
import { useWishlistStore } from '../store/wishlistStore';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cart() {
  const { data: cart, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistStore();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="text-dark-blue hover:text-light-blue font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  const totalAmount = cart?.total || 0;

  const handleAddToWishlist = (item: any) => {
    if (isInWishlist(item.productId)) {
      removeFromWishlist(item.productId);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(item.productId, item.product);
      toast.success('Added to wishlist');
    }
  };

  const handleQuantityChange = (productId: string, currentQty: number, change: number) => {
    const newQty = Math.max(1, currentQty + change);
    updateCartItem.mutate({ productId, quantity: newQty });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow divide-y">
            {cart.items.map((item: any) => {
              const itemPrice = item.product?.price || item.price || 0;
              const itemTotal = itemPrice * item.quantity;
              const inWishlist = isInWishlist(item.productId);
              
              return (
                <div key={item.productId} className="p-6 flex gap-4">
                  <Link to={`/products/${item.product?.slug || item.productId}`} className="flex-shrink-0">
                    <img
                      src={item.product?.image || 'https://via.placeholder.com/120'}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product?.slug || item.productId}`}>
                      <h3 className="font-semibold text-black mb-1 hover:text-dark-blue">
                        {item.product?.name || 'Product'}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-dark-blue mb-3">
                      ₹{itemPrice.toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                          disabled={item.quantity <= 1 || updateCartItem.isPending}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = Math.max(1, parseInt(e.target.value) || 1);
                            updateCartItem.mutate({ productId: item.productId, quantity: qty });
                          }}
                          className="w-16 px-2 py-2 border-0 text-center focus:outline-none focus:ring-0"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                          disabled={updateCartItem.isPending}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddToWishlist(item)}
                          className={`p-2 rounded hover:bg-gray-100 transition ${
                            inWishlist ? 'text-red-600' : 'text-gray-600'
                          }`}
                          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => removeFromCart.mutate(item.productId)}
                          disabled={removeFromCart.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Item total: <span className="font-semibold">₹{itemTotal.toLocaleString('en-IN')}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items ({totalItems})</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-dark-blue">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-dark-blue text-white text-center px-6 py-3 rounded-lg hover:bg-light-blue transition font-medium"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="block w-full text-center px-6 py-3 mt-3 text-black hover:text-dark-blue transition font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

