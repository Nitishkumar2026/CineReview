import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, LogOut, Menu, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <span className="text-xl font-bold">CR</span>
            </div>
            <span className="text-xl font-bold hidden sm:block">CineReview</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="hover:text-red-400 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className="hover:text-red-400 transition-colors duration-200"
            >
              Movies
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search movies, directors, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {state.isAuthenticated ? (
              <>
                <Link 
                  to="/watchlist" 
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  title="Watchlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link 
                  to="/profile" 
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-800"
          >
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </form>

            <nav className="space-y-2">
              <Link 
                to="/" 
                className="block py-2 hover:text-red-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className="block py-2 hover:text-red-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              
              {state.isAuthenticated ? (
                <>
                  <Link 
                    to="/watchlist" 
                    className="block py-2 hover:text-red-400 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Watchlist
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block py-2 hover:text-red-400 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 hover:text-red-400 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block py-2 text-red-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
