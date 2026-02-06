import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
    seriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series',
        required: true
    },
    seasonNumber: {
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
    posterPath: {
        type: String,
        default: ''
    },
    airDate: {
        type: String,
        default: ''
    },
    episodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Episode'
    }]
}, {
    timestamps: true
});

const Season = mongoose.model('Season', seasonSchema);

export default Season;
