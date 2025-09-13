import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRatingChange,
  readonly = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;
        const isHalfFilled = starNumber - 0.5 <= rating && starNumber > rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(starNumber)}
            disabled={readonly}
            className={`relative ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform duration-150`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled || isHalfFilled
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
            {isHalfFilled && (
              <Star
                className={`${sizeClasses[size]} absolute top-0 left-0 text-yellow-400 fill-current`}
                style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
