import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice } from '../utils/helpers';
import { Package, Calendar, MapPin, CreditCard } from 'lucide-react';

const statusOptions = ['pending','processing','shipped','delivered','cancelled'];

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.isAdmin) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await api.getAllOrders();
      setOrders(res.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.updateOrder(id, { status });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  if (!user || !user.isAdmin) {
    return <ErrorMessage message="Access denied: Admins only" />;
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin - All Orders</h1>
      {error && <ErrorMessage message={error} />}
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-center">
                <p><strong>ID:</strong> {order._id}</p>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p><strong>User:</strong> {order.user?.name}{order.user?.email ? ` (${order.user.email})` : ''}</p>
              <div className="flex items-center gap-4">
                <p>
                  <strong>Payment Method:</strong> <span className="capitalize">{order.paymentMethod}</span>
                  {order.paymentMethod === 'cod' && <span className="text-xs text-gray-500 ml-1">(customer pays on delivery)</span>}
                </p>
                <p>
                  <strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm font-semibold ${order.isPaid ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span>
                </p>
              </div>
              <p><strong>Shipping:</strong> {order.shippingMethod} ({formatPrice(order.shippingCost)})</p>
              <p><strong>Total:</strong> {formatPrice(order.totalPrice)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;