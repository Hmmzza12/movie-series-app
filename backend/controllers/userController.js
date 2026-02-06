import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Series from '../models/Series.js';
import * as tmdbService from '../services/tmdbService.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('watchlist.contentId')
            .populate('favorites.contentId');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePicture: updatedUser.profilePicture
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add to watchlist
// @route   POST /api/users/watchlist
// @access  Private
export const addToWatchlist = async (req, res) => {
    try {
        const { contentId, contentType } = req.body; // contentId here is likely the TMDB ID from frontend
        const user = await User.findById(req.user._id);

        let dbContent;
        const Model = contentType === 'Movie' ? Movie : Series;

        // 1. Check if content exists in our DB by TMDB ID
        dbContent = await Model.findOne({ tmdbId: contentId });

        // 2. If not, fetch from TMDB and create it
        if (!dbContent) {
            try {
                const details = contentType === 'Movie'
                    ? await tmdbService.getMovieDetails(contentId)
                    : await tmdbService.getSeriesDetails(contentId);

                const newContentData = {
                    tmdbId: details.id,
                    overview: details.overview,
                    posterPath: details.poster_path,
                    backdropPath: details.backdrop_path,
                    voteAverage: details.vote_average,
                    voteCount: details.vote_count,
                    cast: details.cast,
                    genres: details.genres,
                };

                if (contentType === 'Movie') {
                    newContentData.title = details.title;
                    newContentData.releaseDate = details.release_date;
                    newContentData.runtime = details.runtime;
                    newContentData.tagline = details.tagline;
                } else {
                    newContentData.name = details.name;
                    newContentData.firstAirDate = details.first_air_date;
                    newContentData.numberOfSeasons = details.number_of_seasons;
                    newContentData.numberOfEpisodes = details.number_of_episodes;
                }

                dbContent = await Model.create(newContentData);
            } catch (tmdbError) {
                return res.status(404).json({ message: 'Content not found in TMDB' });
            }
        }

        // 3. Add the MongoDB _id to watchlist
        const exists = user.watchlist.some(
            item => item.contentId.toString() === dbContent._id.toString()
        );

        if (exists) {
            return res.status(400).json({ message: 'Already in watchlist' });
        }

        user.watchlist.push({ contentId: dbContent._id, contentType });
        await user.save();

        res.json({ message: 'Added to watchlist', watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove from watchlist
// @route   DELETE /api/users/watchlist/:id
// @access  Private
export const removeFromWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.watchlist = user.watchlist.filter(
            item => item._id.toString() !== req.params.id
        );

        await user.save();

        res.json({ message: 'Removed from watchlist', watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add to favorites
// @route   POST /api/users/favorites
// @access  Private
export const addToFavorites = async (req, res) => {
    try {
        const { contentId, contentType } = req.body;
        const user = await User.findById(req.user._id);

        let dbContent;
        const Model = contentType === 'Movie' ? Movie : Series;

        // 1. Check if content exists in our DB by TMDB ID
        dbContent = await Model.findOne({ tmdbId: contentId });

        // 2. If not, fetch from TMDB and create it
        if (!dbContent) {
            try {
                const details = contentType === 'Movie'
                    ? await tmdbService.getMovieDetails(contentId)
                    : await tmdbService.getSeriesDetails(contentId);

                const newContentData = {
                    tmdbId: details.id,
                    overview: details.overview,
                    posterPath: details.poster_path,
                    backdropPath: details.backdrop_path,
                    voteAverage: details.vote_average,
                    voteCount: details.vote_count,
                    cast: details.cast,
                    genres: details.genres,
                };

                if (contentType === 'Movie') {
                    newContentData.title = details.title;
                    newContentData.releaseDate = details.release_date;
                    newContentData.runtime = details.runtime;
                    newContentData.tagline = details.tagline;
                } else {
                    newContentData.name = details.name;
                    newContentData.firstAirDate = details.first_air_date;
                    newContentData.numberOfSeasons = details.number_of_seasons;
                    newContentData.numberOfEpisodes = details.number_of_episodes;
                }

                dbContent = await Model.create(newContentData);
            } catch (tmdbError) {
                return res.status(404).json({ message: 'Content not found in TMDB' });
            }
        }

        // 3. Add the MongoDB _id to favorites
        const exists = user.favorites.some(
            item => item.contentId.toString() === dbContent._id.toString()
        );

        if (exists) {
            return res.status(400).json({ message: 'Already in favorites' });
        }

        user.favorites.push({ contentId: dbContent._id, contentType });
        await user.save();

        res.json({ message: 'Added to favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove from favorites
// @route   DELETE /api/users/favorites/:id
// @access  Private
export const removeFromFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.favorites = user.favorites.filter(
            item => item._id.toString() !== req.params.id
        );

        await user.save();

        res.json({ message: 'Removed from favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update watch progress
// @route   POST /api/users/progress
// @access  Private
export const updateProgress = async (req, res) => {
    try {
        const { contentId, progress } = req.body;
        const user = await User.findById(req.user._id);

        const watchlistItem = user.watchlist.find(
            item => item.contentId.toString() === contentId
        );

        if (watchlistItem) {
            watchlistItem.progress = progress;
            await user.save();
            res.json({ message: 'Progress updated', watchlist: user.watchlist });
        } else {
            res.status(404).json({ message: 'Content not in watchlist' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
