export const API_URL = import.meta.env.VITE_API_URL;
export const TMDB_IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export const IMAGE_SIZES = {
    poster: '/w500',
    backdrop: '/original',
    profile: '/w185',
    still: '/w300'
};

export const getImageUrl = (path, size = 'poster') => {
    if (!path) return 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image';
    return `${TMDB_IMAGE_BASE}${IMAGE_SIZES[size]}${path}`;
};
