import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaHeart, FaRegHeart, FaStar, FaCalendar } from 'react-icons/fa';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import { getImageUrl } from '../utils/constants';

const ContentDetails = ({ type }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // 1. Fetch content details
                const endpoint = type === 'movie' ? `/movies/tmdb/${id}` : `/series/tmdb/${id}`;
                const { data } = await axios.get(endpoint);
                setContent(data);

                // 2. Check user status (watchlist/favorites)
                if (isAuthenticated && user) {
                    try {
                        const { data: profile } = await axios.get('/users/profile');

                        // Check watchlist
                        const watchlistId = data.id || data.tmdbId;
                        const inWatchlist = profile.watchlist.some(item =>
                            item.contentId.tmdbId === watchlistId || item.contentId.toString() === data._id
                        );
                        setIsInWatchlist(inWatchlist);

                        // Check favorites
                        const inFavorites = profile.favorites.some(item =>
                            item.contentId.tmdbId === watchlistId || item.contentId.toString() === data._id
                        );
                        setIsFavorite(inFavorites);
                    } catch (err) {
                        console.error('Error checking user lists:', err);
                    }
                }
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, type, isAuthenticated, user]);

    const handleWatchlist = async () => {
        if (!isAuthenticated) return navigate('/login');
        if (submitting) return;

        setSubmitting(true);
        try {
            if (isInWatchlist) {
                const { data: profile } = await axios.get('/users/profile');
                const item = profile.watchlist.find(i => i.contentId.tmdbId === (content.id || content.tmdbId));

                if (item) {
                    await axios.delete(`/users/watchlist/${item._id}`);
                    setIsInWatchlist(false);
                }
            } else {
                await axios.post('/users/watchlist', {
                    contentId: content.id || content.tmdbId,
                    contentType: type === 'movie' ? 'Movie' : 'Series'
                });
                setIsInWatchlist(true);
            }
        } catch (error) {
            console.error('Error updating watchlist:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFavorite = async () => {
        if (!isAuthenticated) return navigate('/login');
        if (submitting) return;

        setSubmitting(true);
        try {
            if (isFavorite) {
                const { data: profile } = await axios.get('/users/profile');
                const item = profile.favorites.find(i => i.contentId.tmdbId === (content.id || content.tmdbId));

                if (item) {
                    await axios.delete(`/users/favorites/${item._id}`);
                    setIsFavorite(false);
                }
            } else {
                await axios.post('/users/favorites', {
                    contentId: content.id || content.tmdbId,
                    contentType: type === 'movie' ? 'Movie' : 'Series'
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;
    if (!content) {
        return (
            <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
                <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
            </div>
        );
    }

    // Safe access to properties that might be snake_case or camelCase
    const releaseDate = content.releaseDate || content.release_date || content.firstAirDate || content.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    const voteAverage = content.voteAverage || content.vote_average || 0;
    const title = content.title || content.name;
    const overview = content.overview;
    const backdropPath = content.backdropPath || content.backdrop_path;
    const originalLanguage = content.originalLanguage || content.original_language;
    const posterPath = content.posterPath || content.poster_path;
    const numberOfSeasons = content.numberOfSeasons || content.number_of_seasons;
    const createdBy = content.createdBy || content.created_by;

    const getSourceIcon = (source) => {
        if (source.includes('Internet Movie Database')) return <span className="text-yellow-400 font-bold bg-black/50 px-2 py-1 rounded">IMDb</span>;
        if (source.includes('Rotten Tomatoes')) return <span className="text-red-500 font-bold bg-black/50 px-2 py-1 rounded">RT</span>;
        if (source.includes('Metacritic')) return <span className="text-green-500 font-bold bg-black/50 px-2 py-1 rounded">Metacritic</span>;
        return null;
    };

    return (
        <div className="min-h-screen bg-netflix-black text-white">
            {/* Back Button - Fixed Position */}
            <div className="fixed top-20 left-4 z-40">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-colors flex items-center gap-2 border border-white/10 shadow-lg"
                >
                    ← Back
                </button>
            </div>

            {/* Hero Section */}
            <div
                className="relative h-[85vh] bg-cover bg-center bg-netflix-black"
                style={{ backgroundImage: `url(${getImageUrl(backdropPath, 'original')})` }}
            >
                {/* Lighter gradient to show more background */}
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-black from-10% via-netflix-black/50 via-50% to-transparent">
                    <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-12 gap-8">
                        {/* Poster - Visible on tablet/desktop */}
                        <div className="hidden md:block w-64 lg:w-72 shrink-0 shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <img
                                src={getImageUrl(posterPath)}
                                alt={title}
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Text Contents */}
                        <div className="flex-1 flex flex-col justify-end">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl">{title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-lg mb-6 text-gray-200 drop-shadow-md font-medium">
                                <span className="text-green-400 font-bold flex items-center gap-1">
                                    <FaStar /> {Math.round(voteAverage * 10)}% (TMDB)
                                </span>

                                {/* External Ratings */}
                                {content.ratings?.map((rating, index) => (
                                    <span key={index} className="flex items-center gap-2">
                                        {getSourceIcon(rating.Source)}
                                        <span className="font-semibold text-white">{rating.Value}</span>
                                    </span>
                                ))}

                                <span className="text-gray-300">{year}</span>
                                {content.runtime && <span className="text-gray-300">{Math.floor(content.runtime / 60)}h {content.runtime % 60}m</span>}
                                {numberOfSeasons && <span className="text-gray-300">{numberOfSeasons} Seasons</span>}
                                <span className="border border-gray-400 px-2 py-0.5 text-xs rounded text-gray-300">HD</span>
                            </div>

                            <div className="flex gap-4 mb-6">
                                <button className="btn-primary flex items-center gap-2 px-8 py-3 text-xl font-bold hover:scale-105 transition-transform shadow-lg">
                                    <FaPlay /> Play
                                </button>

                                <button
                                    onClick={handleWatchlist}
                                    disabled={submitting}
                                    className={`flex items-center gap-2 px-8 py-3 text-xl font-bold rounded bg-gray-600/80 hover:bg-gray-600 transition-colors backdrop-blur-sm ${isInWatchlist ? 'text-green-400' : 'text-white'} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isInWatchlist ? <FaCheck /> : <FaPlus />} {isInWatchlist ? 'List' : 'My List'}
                                </button>

                                <button
                                    onClick={handleFavorite}
                                    disabled={submitting}
                                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 border-gray-400 hover:border-white transition-colors bg-black/40 backdrop-blur-sm ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isFavorite ? <FaHeart className="text-red-500" size={24} /> : <FaRegHeart size={24} />}
                                </button>
                            </div>

                            <p className="max-w-3xl text-lg text-gray-200 drop-shadow-md line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                                {overview}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Cast */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {content.cast?.map(person => (
                                    <div key={person.id} className="min-w-[120px] text-center">
                                        <div className="w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-700 hover:border-white transition-colors cursor-pointer">
                                            {person.profilePath ? (
                                                <img
                                                    src={getImageUrl(person.profilePath, 'profile')}
                                                    alt={person.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                                                    <span className="text-xs">{person.name?.[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm font-semibold mt-2">{person.name}</p>
                                        <p className="text-xs text-gray-400">{person.character}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Similar Content */}
                        {content.similar?.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6">More Like This</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {content.similar.slice(0, 6).map(item => (
                                        <Card key={item.id} item={item} type={type} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Details */}
                    <div className="space-y-6 text-gray-400">
                        <div>
                            <span className="block text-white font-medium mb-1">Genres</span>
                            <div className="flex flex-wrap gap-2">
                                {content.genres?.map(g => (
                                    <span key={g.id} className="text-sm border border-gray-700 px-2 py-1 rounded-full cursor-default hover:bg-gray-800 transition-colors">
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {createdBy && (
                            <div>
                                <span className="block text-white font-medium mb-1">Created By</span>
                                <span>{createdBy.map(c => c.name).join(', ')}</span>
                            </div>
                        )}

                        <div>
                            <span className="block text-white font-medium mb-1">Original Language</span>
                            <span className="uppercase">{originalLanguage}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentDetails;
