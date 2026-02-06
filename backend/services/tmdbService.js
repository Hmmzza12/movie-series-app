import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Create axios instance with default config
const tmdbAxios = axios.create({
    baseURL: TMDB_BASE_URL
});

// Add a request interceptor to inject the API key
tmdbAxios.interceptors.request.use((config) => {
    const apiKey = process.env.TMDB_API_KEY;
    if (apiKey) {
        config.params = config.params || {};
        config.params.api_key = apiKey;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// Get trending movies or series
export const getTrending = async (mediaType = 'movie', timeWindow = 'week') => {
    try {
        const response = await tmdbAxios.get(`/trending/${mediaType}/${timeWindow}`);
        return response.data.results;
    } catch (error) {
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};

// Search for movies and series
export const searchMulti = async (query) => {
    try {
        const response = await tmdbAxios.get('/search/multi', {
            params: { query }
        });
        return response.data.results;
    } catch (error) {
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};

// Get movie details with credits, similar, and external IDs
export const getMovieDetails = async (movieId) => {
    try {
        const [details, credits, similar, externalIds] = await Promise.all([
            tmdbAxios.get(`/movie/${movieId}`),
            tmdbAxios.get(`/movie/${movieId}/credits`),
            tmdbAxios.get(`/movie/${movieId}/recommendations`),
            tmdbAxios.get(`/movie/${movieId}/external_ids`)
        ]);

        return {
            ...details.data,
            cast: credits.data.cast.slice(0, 10).map(actor => ({
                id: actor.id,
                name: actor.name,
                character: actor.character,
                profilePath: actor.profile_path
            })),
            similar: similar.data.results.slice(0, 12),
            imdbId: externalIds.data.imdb_id
        };
    } catch (error) {
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};

// Get series details with credits, similar, and external IDs
export const getSeriesDetails = async (seriesId) => {
    try {
        const [details, credits, similar, externalIds] = await Promise.all([
            tmdbAxios.get(`/tv/${seriesId}`),
            tmdbAxios.get(`/tv/${seriesId}/credits`),
            tmdbAxios.get(`/tv/${seriesId}/recommendations`),
            tmdbAxios.get(`/tv/${seriesId}/external_ids`)
        ]);

        return {
            ...details.data,
            cast: credits.data.cast.slice(0, 10).map(actor => ({
                id: actor.id,
                name: actor.name,
                character: actor.character,
                profilePath: actor.profile_path
            })),
            similar: similar.data.results.slice(0, 12),
            imdbId: externalIds.data.imdb_id
        };
    } catch (error) {
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};

// Get season details with episodes
export const getSeasonDetails = async (seriesId, seasonNumber) => {
    try {
        const response = await tmdbAxios.get(`/tv/${seriesId}/season/${seasonNumber}`);
        return response.data;
    } catch (error) {
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};

// Discover movies with filters
export const discoverMovies = async (filters = {}) => {
    try {
        const params = {};

        if (filters.genre) params.with_genres = filters.genre;
        if (filters.year) params.primary_release_year = filters.year;
        if (filters.sortBy) params.sort_by = filters.sortBy;
        if (filters.rating) params['vote_average.gte'] = filters.rating;
        if (filters.page) params.page = filters.page;

        const response = await tmdbAxios.get('/discover/movie', { params });
        return response.data;
    } catch (error) {
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};

// Discover TV series with filters
export const discoverSeries = async (filters = {}) => {
    try {
        const params = {};

        if (filters.genre) params.with_genres = filters.genre;
        if (filters.year) params.first_air_date_year = filters.year;
        if (filters.sortBy) params.sort_by = filters.sortBy;
        if (filters.rating) params['vote_average.gte'] = filters.rating;
        if (filters.page) params.page = filters.page;

        const response = await tmdbAxios.get('/discover/tv', { params });
        return response.data;
    } catch (error) {
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};

// Get genre list
export const getGenres = async (mediaType = 'movie') => {
    try {
        const endpoint = mediaType === 'movie' ? '/genre/movie/list' : '/genre/tv/list';
        const response = await tmdbAxios.get(endpoint);
        return response.data.genres;
    } catch (error) {
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};
