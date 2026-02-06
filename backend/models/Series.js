import mongoose from 'mongoose';

const seriesSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
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
    firstAirDate: {
        type: String,
        default: ''
    },
    numberOfSeasons: {
        type: Number,
        default: 0
    },
    numberOfEpisodes: {
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
    seasons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Series = mongoose.model('Series', seriesSchema);

export default Series;
