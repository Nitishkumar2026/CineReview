import React from 'react';
import { motion } from 'framer-motion';
import { Review } from '../../types';
import StarRating from '../common/StarRating';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500"
    >
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {review.user.profilePicture ? (
            <img
              src={review.user.profilePicture}
              alt={review.user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-lg">
                {review.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{review.user.username}</h4>
            <span className="text-sm text-gray-500">{formatDate(review.timestamp)}</span>
          </div>

          <div className="flex items-center mb-3">
            <StarRating rating={review.rating} readonly size="sm" />
            <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {review.reviewText}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
