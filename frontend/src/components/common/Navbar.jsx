import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaSearch, FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { MdMovie, MdTv, MdDashboard } from 'react-icons/md';
import { useState } from 'react';

const Navbar = () => {
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    return (
        <nav className="bg-netflix-black border-b border-netflix-darkGray sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-netflix-red text-2xl font-bold">
                            MovieCatalog
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex ml-10 space-x-4">
                            <Link to="/" className="flex items-center gap-2 text-white hover:text-netflix-gray px-3 py-2">
                                <FaHome /> Home
                            </Link>
                            <Link to="/movies" className="flex items-center gap-2 text-white hover:text-netflix-gray px-3 py-2">
                                <MdMovie /> Movies
                            </Link>
                            <Link to="/series" className="flex items-center gap-2 text-white hover:text-netflix-gray px-3 py-2">
                                <MdTv /> Series
                            </Link>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon */}
                        <button
                            onClick={() => navigate('/search')}
                            className="text-white hover:text-netflix-gray"
                        >
                            <FaSearch size={20} />
                        </button>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 text-white hover:text-netflix-gray"
                                >
                                    <FaUser /> {user?.username}
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-netflix-darkGray rounded-md shadow-lg py-1">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-white hover:bg-netflix-gray"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/watchlist"
                                            className="block px-4 py-2 text-white hover:bg-netflix-gray"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Watchlist
                                        </Link>
                                        <Link
                                            to="/favorites"
                                            className="block px-4 py-2 text-white hover:bg-netflix-gray"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Favorites
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-white hover:bg-netflix-gray"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <MdDashboard className="inline mr-2" />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-white hover:bg-netflix-gray flex items-center gap-2"
                                        >
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="btn-secondary text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden text-white"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {showMobileMenu && (
                <div className="md:hidden bg-netflix-darkGray">
                    <Link to="/" className="block px-4 py-2 text-white hover:bg-netflix-gray">
                        Home
                    </Link>
                    <Link to="/movies" className="block px-4 py-2 text-white hover:bg-netflix-gray">
                        Movies
                    </Link>
                    <Link to="/series" className="block px-4 py-2 text-white hover:bg-netflix-gray">
                        Series
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
