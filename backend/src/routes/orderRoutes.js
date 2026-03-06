import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
  createOrder,
  getOrders,
  getAllOrders,
  getOrder,
  updateOrder,
  cancelOrder,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
// admin-only list
router.get('/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrder);
router.put('/:id', authMiddleware, updateOrder);
router.post('/:id/cancel', authMiddleware, cancelOrder);

export default router;
