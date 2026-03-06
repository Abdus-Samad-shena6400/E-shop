import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/', authMiddleware, getWishlist);
router.post('/add', authMiddleware, addToWishlist);
router.post('/remove', authMiddleware, removeFromWishlist);
router.delete('/clear', authMiddleware, clearWishlist);

export default router;
