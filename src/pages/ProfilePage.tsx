import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Star, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { userApi } from '../services/api';
import { Review } from '../types';
import ReviewCard from '../components/reviews/ReviewCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { handleImageError } from '../utils/imageUtils';

const ProfilePage: React.FC = () => {
  const { state } = useAppContext();
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reviews' | 'watchlist'>('reviews');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!state.user) return;

      try {
        setLoading(true);
        const reviewsResponse = await userApi.getUserReviews(state.user.id);
        setUserReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [state.user]);

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your profile
          </h1>
        </div>
      </div>
    );
  }

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
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {state.user.profilePicture ? (
                <img
                  src={state.user.profilePicture}
                  alt={state.user.username}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-600" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {state.user.username}
              </h1>
              <p className="text-gray-600 mb-4">{state.user.email}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Joined {formatDate(state.user.joinDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    {userReviews.length} Reviews
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">
                    {state.watchlist.length} Watchlist Items
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Reviews ({userReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'watchlist'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Watchlist ({state.watchlist.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'reviews' ? (
              <div>
                {userReviews.length > 0 ? (
                  <div className="space-y-6">
                    {userReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600">
                      Start watching movies and share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {state.watchlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {state.watchlist.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <img
                          src={item.movie.posterUrl}
                          alt={item.movie.title}
                          className="w-full h-64 object-cover"
                          onError={handleImageError}
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {item.movie.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Added {formatDate(item.dateAdded)}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">
                                {item.movie.averageRating}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {item.movie.releaseYear}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your watchlist is empty
                    </h3>
                    <p className="text-gray-600">
                      Add movies to your watchlist to keep track of what you want to watch!
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
