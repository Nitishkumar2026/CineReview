import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';

interface ReviewFormProps {
  movieId: string;
  onSubmit: (rating: number, reviewText: string) => Promise<void>;
  loading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onSubmit, loading = false }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || reviewText.trim().length < 10) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, reviewText.trim());
      setRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-2">
            <StarRating 
              rating={rating} 
              onRatingChange={setRating} 
              size="lg"
            />
            <span className="text-gray-600 ml-2">
              {rating > 0 ? `${rating}/5 stars` : 'Select a rating'}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review * (minimum 10 characters)
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            minLength={10}
            required
          />
          <div className="text-sm text-gray-500 mt-1">
            {reviewText.length}/1000 characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={rating === 0 || reviewText.trim().length < 10 || isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
            rating > 0 && reviewText.trim().length >= 10 && !isSubmitting
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
