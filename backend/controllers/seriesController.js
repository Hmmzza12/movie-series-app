import Series from '../models/Series.js';
import Season from '../models/Season.js';
import Episode from '../models/Episode.js';
import * as tmdbService from '../services/tmdbService.js';
import { getExternalRatings } from '../services/omdbService.js';

// @desc    Get trending series
// @route   GET /api/series/trending
// @access  Public
export const getTrendingSeries = async (req, res) => {
    try {
        const series = await tmdbService.getTrending('tv', 'week');
        res.json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search series
// @route   GET /api/series/search
// @access  Public
export const searchSeries = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const results = await tmdbService.searchMulti(query);
        const series = results.filter(item => item.media_type === 'tv');

        res.json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Discover series with filters
// @route   GET /api/series/discover
// @access  Public
export const discoverSeries = async (req, res) => {
    try {
        const filters = {
            genre: req.query.genre,
            year: req.query.year,
            rating: req.query.rating,
            sortBy: req.query.sortBy || 'popularity.desc',
            page: req.query.page || 1
        };

        const results = await tmdbService.discoverSeries(filters);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ...

// @desc    Get series details by TMDB ID
// @route   GET /api/series/tmdb/:tmdbId
// @access  Public
export const getSeriesByTmdbId = async (req, res) => {
    try {
        const seriesDetails = await tmdbService.getSeriesDetails(req.params.tmdbId);

        let externalRatings = null;
        if (seriesDetails.imdbId) {
            externalRatings = await getExternalRatings(seriesDetails.imdbId);
        }

        res.json({
            ...seriesDetails,
            ratings: externalRatings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get series from database
// @route   GET /api/series/:id
// @access  Public
export const getSeries = async (req, res) => {
    try {
        const series = await Series.findById(req.params.id).populate('seasons');

        if (!series) {
            return res.status(404).json({ message: 'Series not found' });
        }

        res.json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get season details
// @route   GET /api/series/:seriesId/seasons/:seasonNumber
// @access  Public
export const getSeasonDetails = async (req, res) => {
    try {
        const series = await Series.findById(req.params.seriesId);

        if (!series) {
            return res.status(404).json({ message: 'Series not found' });
        }

        const seasonDetails = await tmdbService.getSeasonDetails(
            series.tmdbId,
            req.params.seasonNumber
        );

        res.json(seasonDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add series to database
// @route   POST /api/series
// @access  Private/Admin
export const addSeries = async (req, res) => {
    try {
        const { tmdbId } = req.body;

        // Check if series already exists
        const existingSeries = await Series.findOne({ tmdbId });
        if (existingSeries) {
            return res.status(400).json({ message: 'Series already exists in database' });
        }

        // Get series details from TMDB
        const seriesDetails = await tmdbService.getSeriesDetails(tmdbId);

        // Create series in database
        const series = await Series.create({
            tmdbId: seriesDetails.id,
            name: seriesDetails.name,
            overview: seriesDetails.overview,
            posterPath: seriesDetails.poster_path,
            backdropPath: seriesDetails.backdrop_path,
            firstAirDate: seriesDetails.first_air_date,
            numberOfSeasons: seriesDetails.number_of_seasons,
            numberOfEpisodes: seriesDetails.number_of_episodes,
            genres: seriesDetails.genres,
            voteAverage: seriesDetails.vote_average,
            voteCount: seriesDetails.vote_count,
            cast: seriesDetails.cast,
            tagline: seriesDetails.tagline,
            createdBy: req.user._id
        });

        res.status(201).json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update series
// @route   PUT /api/series/:id
// @access  Private/Admin
export const updateSeries = async (req, res) => {
    try {
        const series = await Series.findById(req.params.id);

        if (!series) {
            return res.status(404).json({ message: 'Series not found' });
        }

        const updatedSeries = await Series.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedSeries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete series
// @route   DELETE /api/series/:id
// @access  Private/Admin
export const deleteSeries = async (req, res) => {
    try {
        const series = await Series.findById(req.params.id);

        if (!series) {
            return res.status(404).json({ message: 'Series not found' });
        }

        await series.deleteOne();
        res.json({ message: 'Series removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get series genres
// @route   GET /api/series/genres/list
// @access  Public
export const getSeriesGenres = async (req, res) => {
    try {
        const genres = await tmdbService.getGenres('tv');
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
