import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Heart, Play, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { movieApi, userApi } from '../services/api';
import { Movie, Review } from '../types';
import StarRating from '../components/common/StarRating';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewCard from '../components/reviews/ReviewCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { handleImageError } from '../utils/imageUtils';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const isInWatchlist = state.watchlist.some(item => item.movieId === id);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [movieResponse, reviewsResponse] = await Promise.all([
          movieApi.getMovie(id),
          movieApi.getMovieReviews(id),
        ]);

        setMovie(movieResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load movie details' });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, dispatch]);

  const handleWatchlistToggle = async () => {
    if (!state.isAuthenticated || !movie) return;

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

  const handleReviewSubmit = async (rating: number, reviewText: string) => {
    if (!movie) return;

    try {
      const response = await movieApi.submitReview(movie.id, rating, reviewText);
      setReviews(prev => [response.data, ...prev]);
      dispatch({ type: 'ADD_REVIEW', payload: response.data });
      
      // Update movie rating in local state
      const newAverageRating = (movie.averageRating * movie.totalReviews + rating) / (movie.totalReviews + 1);
      setMovie(prev => prev ? {
        ...prev,
        averageRating: parseFloat(newAverageRating.toFixed(1)),
        totalReviews: prev.totalReviews + 1
      } : null);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie not found</h1>
          <Link to="/movies" className="text-red-600 hover:text-red-700">
            ← Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%), url(${movie.posterUrl})`
          }}
        />
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <Link 
              to="/movies" 
              className="inline-flex items-center space-x-2 text-white hover:text-gray-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Movies</span>
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-3xl lg:text-5xl font-bold mb-4 [text-shadow:0_3px_10px_rgba(0,0,0,0.8)]">
                    {movie.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <StarRating rating={movie.averageRating} readonly />
                      <span className="text-lg font-semibold">{movie.averageRating}/5</span>
                      <span className="text-gray-300">({movie.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{movie.releaseYear}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{movie.duration} min</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genre.map((genre) => (
                      <span
                        key={genre}
                        className="bg-red-600 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                    {movie.synopsis}
                  </p>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    {movie.trailerUrl && (
                      <a
                        href={movie.trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Play className="w-5 h-5" />
                        <span>Watch Trailer</span>
                      </a>
                    )}
                    
                    {state.isAuthenticated && (
                      <button
                        onClick={handleWatchlistToggle}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                          isInWatchlist
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'border border-white text-white hover:bg-white hover:text-black'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                        <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="hidden lg:block">
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cast & Crew */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-4">Cast & Crew</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Director</h4>
                    <p className="text-gray-900">{movie.director}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Cast</h4>
                    <p className="text-gray-900">{movie.cast.join(', ')}</p>
                  </div>
                </div>
              </motion.div>

              {/* Reviews Form */}
              {state.isAuthenticated && (
                <ReviewForm 
                  movieId={movie.id} 
                  onSubmit={handleReviewSubmit}
                />
              )}

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-2xl font-semibold mb-6">Reviews ({reviews.length})</h3>
                
                {reviewsLoading ? (
                  <LoadingSpinner />
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 mb-4">No reviews yet.</p>
                    {!state.isAuthenticated && (
                      <Link
                        to="/login"
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        Login to write the first review!
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Movie Poster (Mobile) */}
              <div className="lg:hidden">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-lg"
                  onError={handleImageError}
                />
              </div>

              {/* Movie Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold mb-4">Movie Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Release Year:</span>
                    <span className="font-medium">{movie.releaseYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{movie.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating:</span>
                    <span className="font-medium">{movie.averageRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews:</span>
                    <span className="font-medium">{movie.totalReviews}</span>
                  </div>
                </div>
              </motion.div>

              {/* Genres */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((genre) => (
                    <Link
                      key={genre}
                      to={`/movies?genre=${genre}`}
                      className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 px-3 py-1 rounded-full text-sm transition-colors duration-200"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;
