import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { userApi } from '../services/api';
import StarRating from '../components/common/StarRating';
import { handleImageError } from '../utils/imageUtils';

const WatchlistPage: React.FC = () => {
  const { state, dispatch } = useAppContext();

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your watchlist
          </h1>
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoveFromWatchlist = async (itemId: string, movieId: string) => {
    try {
      await userApi.removeFromWatchlist(state.user!.id, movieId);
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: itemId });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500" />
            <span>My Watchlist</span>
          </h1>
          <p className="text-gray-600">
            Movies you want to watch ({state.watchlist.length} items)
          </p>
        </div>

        {state.watchlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.watchlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden group relative"
              >
                <Link to={`/movies/${item.movie.id}`}>
                  <div className="relative">
                    <img
                      src={item.movie.posterUrl}
                      alt={item.movie.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWatchlist(item.id, item.movie.id)}
                  className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 hover:bg-red-600 text-white rounded-full transition-all duration-200"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="p-4">
                  <Link to={`/movies/${item.movie.id}`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {item.movie.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mb-2">
                    <StarRating rating={item.movie.averageRating} readonly size="sm" />
                    <span className="text-sm text-gray-600">
                      {item.movie.averageRating}/5
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>{item.movie.releaseYear}</span>
                    <span>{item.movie.duration} min</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.movie.genre.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                    {item.movie.genre.length > 2 && (
                      <span className="text-gray-500 text-xs px-2 py-1">
                        +{item.movie.genre.length - 2}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    Added {formatDate(item.dateAdded)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 rounded-lg shadow-md text-center"
          >
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your watchlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding movies to your watchlist to keep track of what you want to watch next.
            </p>
            <Link
              to="/movies"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
            >
              Browse Movies
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
