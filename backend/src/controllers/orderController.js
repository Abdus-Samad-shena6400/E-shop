import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, shippingMethod } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // shipping cost calculation (same logic as frontend)
    const subtotal = cart.totalPrice;
    const calculateShipping = () => {
      if (subtotal > 50) return 0;
      if (shippingMethod === 'standard') return 9.99;
      if (shippingMethod === 'express') return 24.99;
      if (shippingMethod === 'overnight') return 49.99;
      return 0;
    };
    const shippingCost = calculateShipping();

    // Determine initial payment and status
    let isPaid = false;
    let status = 'pending';

    // simulate instant payment for non-COD methods
    if (paymentMethod && paymentMethod !== 'cod') {
      isPaid = true;
      status = 'processing';
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: cart.items,
      totalPrice: cart.totalPrice + shippingCost, // include shipping
      shippingMethod: shippingMethod || 'standard',
      shippingCost,
      shippingAddress,
      paymentMethod,
      isPaid,
      status,
      paidAt: isPaid ? new Date() : undefined,
    });

    // Clear cart after order creation
    await Cart.findByIdAndUpdate(cart._id, { items: [], totalPrice: 0 });

    await order.populate('items.product');

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
      total: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: fetch all orders
export const getAllOrders = async (req, res) => {
  try {
    // ensure only admins can access
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders, total: orders.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { status, isPaid } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    if (status) {
      order.status = status;
      // Auto-mark as paid when status is shipped or delivered (but NOT for COD)
      // COD (Cash on Delivery) should remain pending until customer pays
      if ((status === 'shipped' || status === 'delivered') && order.paymentMethod !== 'cod') {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }
    
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) order.paidAt = new Date();
    }

    await order.save();

    res.status(200).json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending orders' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
