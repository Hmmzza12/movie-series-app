import express from 'express';
import {
    getTrendingMovies,
    searchMovies,
    discoverMovies,
    getMovieByTmdbId,
    getMovie,
    addMovie,
    updateMovie,
    deleteMovie,
    getMovieGenres
} from '../controllers/movieController.js';
import { protect } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/trending', getTrendingMovies);
router.get('/search', searchMovies);
router.get('/discover', discoverMovies);
router.get('/genres/list', getMovieGenres);
router.get('/tmdb/:tmdbId', getMovieByTmdbId);
router.get('/:id', getMovie);

// Admin routes
router.post('/', protect, adminAuth, addMovie);
router.put('/:id', protect, adminAuth, updateMovie);
router.delete('/:id', protect, adminAuth, deleteMovie);

export default router;
