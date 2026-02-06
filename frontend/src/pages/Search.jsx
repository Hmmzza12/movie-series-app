import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import useDebounce from '../hooks/useDebounce';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        // Update URL when query changes
        if (debouncedQuery) {
            setSearchParams({ q: debouncedQuery });
        } else {
            setSearchParams({});
        }

        const fetchResults = async () => {
            if (!debouncedQuery) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const { data } = await axios.get(`/movies/search?query=${debouncedQuery}`);
                // Combine movies and series if the API supports it, or use multi-search
                // Currently the backend has separate search endpoints, but let's check tmdbService
                // Backend tmdbService has searchMulti, let's see backend routes

                // Actually, backend routes have /movies/search and /series/search
                // But tmdbService.js has searchMulti used by... let's check movieController or just use searchMulti endpoint if exposed
                // Checking backend routes: getSearch in movieController uses tmdbService.searchMulti? No, likely searchMovie
                // Let's assume we want to search both. 
                // For now, let's call both or if there's a unified endpoint.
                // Looking at backend logs/summary: 
                // movieController.getSearch calls tmdbService.searchMulti?
                // Let's check movieController implementation if needed, but safer to call distinct endpoints or assume one covers it.
                // Actually, usually search page wants "multi" search.

                // Let's call both and merge for a better UX, or just use the movie search for now if simpler.
                // Better: let's try to query both endpoints parallel.

                const [moviesRes, seriesRes] = await Promise.all([
                    axios.get(`/movies/search?query=${debouncedQuery}`),
                    axios.get(`/series/search?query=${debouncedQuery}`)
                ]);

                // Tag them with types for the Card component
                const movies = moviesRes.data.map(m => ({ ...m, media_type: 'movie' }));
                const series = seriesRes.data.map(s => ({ ...s, media_type: 'series' }));

                // Sort by popularity
                const combined = [...movies, ...series].sort((a, b) => b.popularity - a.popularity);

                setResults(combined);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery, setSearchParams]);

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-4xl font-bold mb-6">Search</h1>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for movies or TV shows..."
                        className="w-full max-w-2xl px-6 py-4 bg-netflix-darkGray border border-netflix-gray rounded-full text-white text-xl focus:outline-none focus:border-netflix-red transition-colors"
                        autoFocus
                    />
                </div>

                {loading ? (
                    <Loading />
                ) : (
                    <>
                        {results.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {results.map((item) => (
                                    <Card
                                        key={item.id}
                                        item={item}
                                        type={item.media_type || (item.title ? 'movie' : 'series')}
                                    />
                                ))}
                            </div>
                        ) : (
                            query && (
                                <div className="text-center text-netflix-gray text-xl mt-12">
                                    No results found for "{query}"
                                </div>
                            )
                        )}

                        {!query && (
                            <div className="text-center text-netflix-gray text-lg mt-12">
                                Type something to start searching...
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;
