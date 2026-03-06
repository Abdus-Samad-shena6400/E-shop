import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { CreditCard, Truck, MapPin, AlertCircle, Lock, CheckCircle, RefreshCw, Shield } from 'lucide-react';
import * as api from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    country: user?.country || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [cardInfo, setCardInfo] = useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode || !shippingInfo.country) {
      setError('Please fill in all shipping information');
      return;
    }
    // payment-specific validation
    if (paymentMethod === 'card') {
      const { cardNumber, expiryDate, cvv } = cardInfo;
      if (!cardNumber || !expiryDate || !cvv) {
        setError('Please fill in complete card information');
        return;
      }
    }
    if (paymentMethod === 'paypal') {
      if (!paypalEmail) {
        setError('Please enter your PayPal email');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await api.createOrder(shippingInfo, paymentMethod, shippingMethod);
      
      if (response.order) {
        // Clear cart after successful order
        clearCart();
        // Clear cart after successful order
        clearCart();
        // Redirect to orders page with order ID
        navigate('/orders');
        alert(`Order placed successfully! Order ID: ${response.order._id}\nShipping Method: ${shippingMethod.charAt(0).toUpperCase() + shippingMethod.slice(1)}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Please log in to proceed with checkout" />
        <button
          onClick={() => navigate('/login')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Your cart is empty" />
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  
  // Shipping cost calculation based on method
  const getShippingCost = () => {
    if (subtotal > 50) return 0;
    if (shippingMethod === 'standard') return 9.99;
    if (shippingMethod === 'express') return 24.99;
    if (shippingMethod === 'overnight') return 49.99;
    return 0;
  };

  const shipping = getShippingCost();
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Checkout</h1>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                  placeholder="123 Main St"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                  placeholder="New York"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  required
                  placeholder="10001"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  required
                  placeholder="United States"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Shipping Method</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="standard"
                  checked={shippingMethod === 'standard'}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Standard Shipping</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">5-7 business days</p>
                </div>
                <span className="text-blue-600 font-semibold">{subtotal > 50 ? 'Free' : '$9.99'}</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="express"
                  checked={shippingMethod === 'express'}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Express Shipping</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">2-3 business days</p>
                </div>
                <span className="text-blue-600 font-semibold">{subtotal > 50 ? '$15' : '$24.99'}</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="overnight"
                  checked={shippingMethod === 'overnight'}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Overnight Shipping</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Next business day</p>
                </div>
                <span className="text-blue-600 font-semibold">{subtotal > 50 ? '$40' : '$49.99'}</span>
              </label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Payment Method</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>💳 Credit/Debit Card</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>🅿️ PayPal</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>📦 Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Mock payment details fields */}
          {paymentMethod === 'card' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Card Details (mock)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={cardInfo.cardNumber}
                  required
                  onChange={(e) => setCardInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardInfo.expiryDate}
                  required
                  onChange={(e) => setCardInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={cardInfo.cvv}
                  required
                  onChange={(e) => setCardInfo(prev => ({ ...prev, cvv: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}
          {paymentMethod === 'paypal' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">PayPal Email (mock)</h3>
              <input
                type="email"
                name="paypalEmail"
                placeholder="name@example.com"
                value={paypalEmail}
                required
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}
          {paymentMethod === 'paypal' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">PayPal Email (mock)</h3>
              <input
                type="email"
                name="paypalEmail"
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          {/* Secure Payment Information */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Lock className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Secure Payment Processing</h3>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    256-bit SSL Encryption for all transactions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Payment data is PCI DSS compliant
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Your payment information is never stored on our servers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verified by industry security standards
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Policy */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <RefreshCw className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">30-Day Return Policy</h3>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>🔄 Free returns for items within 30 days of purchase</li>
                  <li>✅ Products must be in original condition with packaging</li>
                  <li>🚚 Free return shipping for defective items</li>
                  <li>💰 Full refund within 5-7 business days of return</li>
                  <li>📞 Contact support for return authorization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Order Summary</h2>
            </div>
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id || item._id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain bg-gray-50 dark:bg-gray-700 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-900 dark:text-gray-100">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-gray-100">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-gray-100">
                <span>Tax (10%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-xl font-semibold text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 text-lg font-semibold"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>

          <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p>Your order will be processed securely. You can track your order from your dashboard.</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;