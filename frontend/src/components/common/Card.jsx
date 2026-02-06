import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/constants';
import { FaStar } from 'react-icons/fa';

const Card = ({ item, type }) => {
    const title = type === 'movie' ? item.title : item.name;
    const date = type === 'movie' ? item.release_date : item.first_air_date;
    const year = date ? new Date(date).getFullYear() : 'N/A';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

    return (
        <Link
            to={`/${type}/${item.id || item._id || item.tmdbId}`}
            className="group relative card-hover cursor-pointer"
        >
            <div className="relative overflow-hidden rounded-lg">
                <img
                    src={getImageUrl(item.poster_path || item.posterPath, 'poster')}
                    alt={title}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-netflix-gray">{year}</span>
                            <span className="flex items-center gap-1 text-yellow-400">
                                <FaStar /> {rating}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Card;
