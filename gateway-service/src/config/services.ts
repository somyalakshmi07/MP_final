export const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  catalog: process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002',
  cart: process.env.CART_SERVICE_URL || 'http://cart-service:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://order-service:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005',
};
