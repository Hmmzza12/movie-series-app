import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
    seasonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        required: true
    },
    tmdbId: {
        type: Number,
        required: true
    },
    episodeNumber: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        default: ''
    },
    stillPath: {
        type: String,
        default: ''
    },
    airDate: {
        type: String,
        default: ''
    },
    runtime: {
        type: Number,
        default: 0
    },
    voteAverage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;
