import express from 'express';
import {
    getProfile,
    updateProfile,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    updateProgress
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All user routes are protected
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:id', protect, removeFromWatchlist);
router.post('/favorites', protect, addToFavorites);
router.delete('/favorites/:id', protect, removeFromFavorites);
router.post('/progress', protect, updateProgress);

export default router;
