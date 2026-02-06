import express from 'express';
import {
    getStats,
    getPendingReviews,
    approveReview,
    deleteReview,
    getAllUsers,
    deleteUser
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminAuth);

router.get('/stats', getStats);
router.get('/reviews/pending', getPendingReviews);
router.put('/reviews/:id/approve', approveReview);
router.delete('/reviews/:id', deleteReview);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
