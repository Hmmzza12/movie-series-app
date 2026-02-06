import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        default: ''
    },
    posterPath: {
        type: String,
        default: ''
    },
    backdropPath: {
        type: String,
        default: ''
    },
    releaseDate: {
        type: String,
        default: ''
    },
    runtime: {
        type: Number,
        default: 0
    },
    genres: [{
        id: Number,
        name: String
    }],
    voteAverage: {
        type: Number,
        default: 0
    },
    voteCount: {
        type: Number,
        default: 0
    },
    cast: [{
        id: Number,
        name: String,
        character: String,
        profilePath: String
    }],
    tagline: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
