import express from 'express';
import {
    createReview,
    getReviewsForContent,
    updateReview,
    deleteReview,
    getUserReviews
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { reviewValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/:contentId', getReviewsForContent);

// Protected routes
router.post('/', protect, reviewValidation, validate, createReview);
router.get('/user/me', protect, getUserReviews);
router.put('/:id', protect, reviewValidation, validate, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
