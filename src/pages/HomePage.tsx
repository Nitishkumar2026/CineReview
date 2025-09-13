import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Play } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { movieApi } from '../services/api';
import MovieGrid from '../components/movies/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuredResponse, trendingResponse] = await Promise.all([
          movieApi.getFeaturedMovies(),
          movieApi.getTrendingMovies(),
        ]);

        dispatch({ type: 'SET_FEATURED_MOVIES', payload: featuredResponse.data });
        dispatch({ type: 'SET_TRENDING_MOVIES', payload: trendingResponse.data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load movies' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const heroMovie = state.featuredMovies[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%), url(${heroMovie.posterUrl})`
            }}
          />
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 [text-shadow:0_3px_10px_rgba(0,0,0,0.8)]">
                  {heroMovie.title}
                </h1>
                <p className="text-lg lg:text-xl mb-6 text-gray-200">
                  {heroMovie.synopsis.substring(0, 200)}...
                </p>
                
                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">{heroMovie.averageRating}/5</span>
                  </div>
                  <span className="text-gray-300">{heroMovie.releaseYear}</span>
                  <span className="text-gray-300">{heroMovie.duration} min</span>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to={`/movies/${heroMovie.id}`}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>View Details</span>
                  </Link>
                  <Link
                    to="/movies"
                    className="border border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
                  >
                    Browse Movies
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Movies Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Movies</h2>
              <Link
                to="/movies?featured=true"
                className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
              >
                <span>View All</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <MovieGrid 
              movies={state.featuredMovies.slice(0, 4)} 
              loading={loading}
            />
          </motion.div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              </div>
              <Link
                to="/movies?trending=true"
                className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
              >
                <span>View All</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <MovieGrid 
              movies={state.trendingMovies.slice(0, 4)} 
              loading={loading}
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Join the CineReview Community
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover new movies, share your reviews, and connect with fellow movie enthusiasts.
            </p>
            
            {!state.isAuthenticated && (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
              >
                Get Started
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
