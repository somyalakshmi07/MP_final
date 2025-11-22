import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../hooks/useCart';
import { useCreateOrder, useProcessPayment } from '../hooks/useOrders';
import { useNavigate } from 'react-router-dom';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  cardNumber: z.string().min(16, 'Card number is required'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Invalid expiry date'),
  cvv: z.string().min(3, 'CVV is required'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { data: cart } = useCart();
  const createOrder = useCreateOrder();
  const processPayment = useProcessPayment();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    try {
      // Create order
      const order = await createOrder.mutateAsync({
        shippingAddress: {
          name: data.name,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
      });

      // Process payment
      const payment = await processPayment.mutateAsync({
        orderId: order._id,
        paymentMethod: 'card',
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
        cardholderName: data.cardholderName,
      });

      if (payment.success) {
        navigate(`/order-confirmation/${order._id}`);
      }
    } catch (error) {
      // Error handled by hooks
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    {...register('street')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.street && (
                    <p className="text-sm text-red-600 mt-1">{errors.street.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    {...register('city')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    {...register('zipCode')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    {...register('country')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    {...register('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      {...register('expiryDate')}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-red-600 mt-1">{errors.expiryDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      {...register('cvv')}
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    {errors.cvv && (
                      <p className="text-sm text-red-600 mt-1">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    {...register('cardholderName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.cardholderName && (
                    <p className="text-sm text-red-600 mt-1">{errors.cardholderName.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={createOrder.isPending || processPayment.isPending}
              className="w-full bg-dark-blue text-white px-6 py-3 rounded-lg hover:bg-light-blue transition disabled:opacity-50"
            >
              {createOrder.isPending || processPayment.isPending
                ? 'Processing...'
                : 'Complete Order'}
            </button>
          </form>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.items.map((item: any) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.product?.name || 'Product'} x {item.quantity}
                  </span>
                  <span>
                    ₹{((item.product?.price || item.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t">
              <span>Total</span>
              <span>₹{(cart.total || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

