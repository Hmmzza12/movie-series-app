import Review from '../models/Review.js';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { contentId, contentType, rating, reviewText } = req.body;

        // Check if user already reviewed this content
        const existingReview = await Review.findOne({
            userId: req.user._id,
            contentId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this content' });
        }

        const review = await Review.create({
            userId: req.user._id,
            contentId,
            contentType,
            rating,
            reviewText
        });

        const populatedReview = await Review.findById(review._id).populate('userId', 'username');

        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for content
// @route   GET /api/reviews/:contentId
// @access  Public
export const getReviewsForContent = async (req, res) => {
    try {
        const reviews = await Review.find({
            contentId: req.params.contentId,
            approved: true
        })
            .populate('userId', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns this review
        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        review.rating = req.body.rating || review.rating;
        review.reviewText = req.body.reviewText || review.reviewText;
        review.approved = false; // Reset approval status

        const updatedReview = await review.save();

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns this review
        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();

        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user/me
// @access  Private
export const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user._id })
            .populate('contentId')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
