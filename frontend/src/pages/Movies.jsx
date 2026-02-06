import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const { data } = await axios.get('/movies/genres/list');
                setGenres(data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    sortBy,
                    page
                });

                if (selectedGenre) params.append('genre', selectedGenre);
                if (selectedYear) params.append('year', selectedYear);

                const { data } = await axios.get(`/movies/discover?${params}`);
                setMovies(data.results || data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [selectedGenre, selectedYear, sortBy, page]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Movies</h1>

                {/* Filters */}
                <div className="bg-netflix-darkGray p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Genre</label>
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Year</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All Years</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-field"
                        >
                            <option value="popularity.desc">Popularity (High to Low)</option>
                            <option value="popularity.asc">Popularity (Low to High)</option>
                            <option value="vote_average.desc">Rating (High to Low)</option>
                            <option value="vote_average.asc">Rating (Low to High)</option>
                            <option value="release_date.desc">Release Date (Newest)</option>
                            <option value="release_date.asc">Release Date (Oldest)</option>
                        </select>
                    </div>
                </div>

                {/* Movies Grid */}
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {movies.map((movie) => (
                                <Card key={movie.id} item={movie} type="movie" />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="btn-secondary disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="flex items-center px-4">Page {page}</span>
                            <button
                                onClick={() => setPage(page + 1)}
                                className="btn-secondary"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Movies;
