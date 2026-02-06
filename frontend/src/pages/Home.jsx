import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { Link } from 'react-router-dom';

const Home = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingSeries, setTrendingSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const [moviesRes, seriesRes] = await Promise.all([
                    axios.get('/movies/trending'),
                    axios.get('/series/trending')
                ]);

                setTrendingMovies(moviesRes.data.slice(0, 12));
                setTrendingSeries(seriesRes.data.slice(0, 12));
            } catch (error) {
                console.error('Error fetching trending:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-gradient-to-r from-netflix-red to-red-900 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">
                        Discover Movies & TV Shows
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-200">
                        Explore trending content, save your favorites, and track your watchlist
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/movies" className="btn-primary text-lg px-8 py-3">
                            Browse Movies
                        </Link>
                        <Link to="/series" className="btn-secondary text-lg px-8 py-3">
                            Browse Series
                        </Link>
                    </div>
                </div>
            </div>

            {/* Trending Movies */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Trending Movies</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {trendingMovies.map((movie) => (
                            <Card key={movie.id} item={movie} type="movie" />
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <Link to="/movies" className="btn-secondary">
                            View All Movies
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trending Series */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Trending TV Series</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {trendingSeries.map((series) => (
                            <Card key={series.id} item={series} type="series" />
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <Link to="/series" className="btn-secondary">
                            View All Series
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
