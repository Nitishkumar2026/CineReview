import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Calendar } from 'lucide-react';
import { Movie } from '../../types';
import StarRating from '../common/StarRating';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { userApi } from '../../services/api';
import { handleImageError } from '../../utils/imageUtils';

interface MovieCardProps {
  movie: Movie;
  showAddToWatchlist?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, showAddToWatchlist = true }) => {
  const { state, dispatch } = useAppContext();

  const isInWatchlist = state.watchlist.some(item => item.movieId === movie.id);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!state.isAuthenticated) {
      return;
    }

    try {
      if (isInWatchlist) {
        await userApi.removeFromWatchlist(state.user!.id, movie.id);
        const watchlistItem = state.watchlist.find(item => item.movieId === movie.id);
        if (watchlistItem) {
          dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: watchlistItem.id });
        }
      } else {
        const response = await userApi.addToWatchlist(state.user!.id, movie.id);
        dispatch({ type: 'ADD_TO_WATCHLIST', payload: response.data });
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <Link to={`/movies/${movie.id}`}>
        <div className="relative">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          
          {/* Watchlist Button */}
          {showAddToWatchlist && state.isAuthenticated && (
            <button
              onClick={handleWatchlistToggle}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                isInWatchlist
                  ? 'bg-red-600 text-white'
                  : 'bg-black bg-opacity-50 text-white hover:bg-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Featured/Trending Badge */}
          {movie.featured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
          {movie.trending && !movie.featured && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Trending
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <StarRating rating={movie.averageRating} readonly size="sm" />
            <span className="text-sm text-gray-600">
              {movie.averageRating}/5 ({movie.totalReviews})
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="mr-3">{movie.releaseYear}</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{movie.duration} min</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {genre}
              </span>
            ))}
            {movie.genre.length > 2 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{movie.genre.length - 2} more
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {movie.synopsis}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
