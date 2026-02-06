import express from 'express';
import {
    getTrendingSeries,
    searchSeries,
    discoverSeries,
    getSeriesByTmdbId,
    getSeries,
    getSeasonDetails,
    addSeries,
    updateSeries,
    deleteSeries,
    getSeriesGenres
} from '../controllers/seriesController.js';
import { protect } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/trending', getTrendingSeries);
router.get('/search', searchSeries);
router.get('/discover', discoverSeries);
router.get('/genres/list', getSeriesGenres);
router.get('/tmdb/:tmdbId', getSeriesByTmdbId);
router.get('/:id', getSeries);
router.get('/:seriesId/seasons/:seasonNumber', getSeasonDetails);

// Admin routes
router.post('/', protect, adminAuth, addSeries);
router.put('/:id', protect, adminAuth, updateSeries);
router.delete('/:id', protect, adminAuth, deleteSeries);

export default router;
