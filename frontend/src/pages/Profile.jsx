import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import useAuth from '../hooks/useAuth';

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('watchlist');
    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // Fetch fresh user data to ensure we have latest list
                const { data } = await axios.get('/auth/me');

                let items = [];
                if (activeTab === 'watchlist') {
                    items = data.watchlist;
                } else {
                    items = data.favorites;
                }

                // Transform items to match Card component expectation
                // formattedItems = [{ ...contentData, media_type: 'movie'|'tv' }]
                // The backend populates contentId, but checking the structure:
                // contentId is the DB object. But we browsed via TMDB.
                // If the user added a movie, the backend 'add' controller likely created it in DB first?
                // Let's check userController logic.

                const formatted = items.map(item => ({
                    ...item.contentId,
                    media_type: item.contentType === 'Movie' ? 'movie' : 'tv'
                })).filter(item => item && (item.title || item.name)); // Filter nulls

                setListData(formatted);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [activeTab]);

    if (!user) return <Loading />;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    {/* Profile Header */}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-netflix-red">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.username}&background=E50914&color=fff&size=128`}
                            alt={user.username}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
                        <p className="text-gray-400 mb-4">{user.email}</p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <span className="bg-netflix-darkGray px-4 py-1 rounded-full text-sm border border-gray-700">
                                Member since {new Date(user.createdAt || Date.now()).getFullYear()}
                            </span>
                            {user.role === 'admin' && (
                                <span className="bg-red-900/50 text-red-200 px-4 py-1 rounded-full text-sm border border-red-900">
                                    Admin
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-800 mb-8">
                    <button
                        onClick={() => setActiveTab('watchlist')}
                        className={`pb-4 text-xl font-bold transition-colors relative ${activeTab === 'watchlist' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        My List
                        {activeTab === 'watchlist' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-netflix-red rounded-t-full" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`pb-4 text-xl font-bold transition-colors relative ${activeTab === 'favorites' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Favorites
                        {activeTab === 'favorites' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-netflix-red rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* content */}
                {loading ? (
                    <Loading />
                ) : listData.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {listData.map((item) => (
                            <Card key={item._id || item.id} item={item} type={item.media_type || 'movie'} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-netflix-darkGray/30 rounded-lg border border-dashed border-gray-800">
                        <h3 className="text-2xl font-bold text-gray-500 mb-2">
                            Your {activeTab === 'watchlist' ? 'List' : 'Favorites'} is Empty
                        </h3>
                        <p className="text-gray-600">
                            Go explore movies and series to add them here!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
