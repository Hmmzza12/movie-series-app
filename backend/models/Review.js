import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'contentType',
        required: true
    },
    contentType: {
        type: String,
        required: true,
        enum: ['Movie', 'Series']
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true,
        minlength: [10, 'Review must be at least 10 characters'],
        maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    approved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate reviews
reviewSchema.index({ userId: 1, contentId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
