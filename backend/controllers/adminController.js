import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Series from '../models/Series.js';
import Review from '../models/Review.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
    try {
        const [usersCount, moviesCount, seriesCount, reviewsCount, pendingReviewsCount] = await Promise.all([
            User.countDocuments(),
            Movie.countDocuments(),
            Series.countDocuments(),
            Review.countDocuments(),
            Review.countDocuments({ approved: false })
        ]);

        res.json({
            users: usersCount,
            movies: moviesCount,
            series: seriesCount,
            reviews: reviewsCount,
            pendingReviews: pendingReviewsCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending reviews
// @route   GET /api/admin/reviews/pending
// @access  Private/Admin
export const getPendingReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ approved: false })
            .populate('userId', 'username email')
            .populate('contentId')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve review
// @route   PUT /api/admin/reviews/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.approved = true;
        await review.save();

        res.json({ message: 'Review approved', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete review (admin)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.deleteOne();

        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        await user.deleteOne();

        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
