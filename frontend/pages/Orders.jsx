import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { Package, Calendar, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import * as api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders();
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await api.cancelOrder(orderId);
      fetchOrders();
      alert('Order cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleMarkPaid = async (orderId) => {
    try {
      await api.updateOrder(orderId, { isPaid: true, status: 'processing' });
      fetchOrders();
      alert('Order marked as paid');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };
    return colors[status] || colors.pending;
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Please log in to view your orders" />
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Order History</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Track and manage your orders</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start shopping to create your first order!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              {/* Order Header */}
              <button
                onClick={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
                className="w-full px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {order._id?.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <svg
                      className={`h-5 w-5 text-gray-600 dark:text-gray-400 transform transition-transform ${
                        expandedOrder === order._id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Order Details */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-6 space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Items
                    </h3>
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-12 h-12 object-contain rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {item.product?.title || 'Product'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Shipping Address
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {order.shippingAddress?.address}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {order.shippingAddress?.city}, {order.shippingAddress?.zipCode}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {order.shippingAddress?.country}
                    </p>
                    {order.shippingMethod && (
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        <span className="font-medium">Method:</span> {order.shippingMethod.charAt(0).toUpperCase() + order.shippingMethod.slice(1)}
                        {order.shippingCost != null && (
                          <> (<span>{formatPrice(order.shippingCost)}</span>)</>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Method
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 capitalize font-medium">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}
                      </p>
                      {order.paymentMethod === 'cod' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          You will pay the delivery person when your order arrives
                        </p>
                      )}
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${
                          order.isPaid
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Timeline
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Ordered:</span>{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {order.paidAt && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Paid:</span>{' '}
                          {new Date(order.paidAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatPrice(order.totalPrice - (order.shippingCost || 0))}
                      </span>
                    </div>
                    {order.shippingCost != null && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 dark:text-gray-300">Shipping</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(order.shippingCost)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Tax (10%)</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatPrice((order.totalPrice - (order.shippingCost || 0)) * 0.1)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Total</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Cancel Order or pay for COD */}
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                      {order.paymentMethod === 'cod' && !order.isPaid && (
                        <button
                          onClick={() => handleMarkPaid(order._id)}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          I Paid Offline (Mark as Paid)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
