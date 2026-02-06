import Movie from '../models/Movie.js';
import * as tmdbService from '../services/tmdbService.js';
import { getExternalRatings } from '../services/omdbService.js';

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
export const getTrendingMovies = async (req, res) => {
    try {
        const movies = await tmdbService.getTrending('movie', 'week');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
export const searchMovies = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const results = await tmdbService.searchMulti(query);
        const movies = results.filter(item => item.media_type === 'movie');

        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Discover movies with filters
// @route   GET /api/movies/discover
// @access  Public
export const discoverMovies = async (req, res) => {
    try {
        const filters = {
            genre: req.query.genre,
            year: req.query.year,
            rating: req.query.rating,
            sortBy: req.query.sortBy || 'popularity.desc',
            page: req.query.page || 1
        };

        const results = await tmdbService.discoverMovies(filters);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ...

// @desc    Get movie details by TMDB ID
// @route   GET /api/movies/tmdb/:tmdbId
// @access  Public
export const getMovieByTmdbId = async (req, res) => {
    try {
        const movieDetails = await tmdbService.getMovieDetails(req.params.tmdbId);

        let externalRatings = null;
        if (movieDetails.imdbId) {
            externalRatings = await getExternalRatings(movieDetails.imdbId);
        }

        res.json({
            ...movieDetails,
            ratings: externalRatings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get movie from database
// @route   GET /api/movies/:id
// @access  Public
export const getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add movie to database
// @route   POST /api/movies
// @access  Private/Admin
export const addMovie = async (req, res) => {
    try {
        const { tmdbId } = req.body;

        // Check if movie already exists
        const existingMovie = await Movie.findOne({ tmdbId });
        if (existingMovie) {
            return res.status(400).json({ message: 'Movie already exists in database' });
        }

        // Get movie details from TMDB
        const movieDetails = await tmdbService.getMovieDetails(tmdbId);

        // Create movie in database
        const movie = await Movie.create({
            tmdbId: movieDetails.id,
            title: movieDetails.title,
            overview: movieDetails.overview,
            posterPath: movieDetails.poster_path,
            backdropPath: movieDetails.backdrop_path,
            releaseDate: movieDetails.release_date,
            runtime: movieDetails.runtime,
            genres: movieDetails.genres,
            voteAverage: movieDetails.vote_average,
            voteCount: movieDetails.vote_count,
            cast: movieDetails.cast,
            tagline: movieDetails.tagline,
            createdBy: req.user._id
        });

        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        await movie.deleteOne();
        res.json({ message: 'Movie removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get movie genres
// @route   GET /api/movies/genres/list
// @access  Public
export const getMovieGenres = async (req, res) => {
    try {
        const genres = await tmdbService.getGenres('movie');
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
