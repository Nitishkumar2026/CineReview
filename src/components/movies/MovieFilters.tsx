import React from 'react';
import { MovieFilters as FilterType } from '../../types';

interface MovieFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const genres = [
  'All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 
  'Sci-Fi', 'Thriller', 'Fantasy', 'Mystery', 'Crime', 'Animation'
];

const years = Array.from({ length: 45 }, (_, i) => 2024 - i);

const MovieFilters: React.FC<MovieFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof FilterType, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <select
            value={filters.genre || 'All'}
            onChange={(e) => handleFilterChange('genre', e.target.value === 'All' ? undefined : e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Release Year
          </label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <select
            value={filters.minRating || ''}
            onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
            <option value="3.0">3.0+ Stars</option>
            <option value="2.5">2.5+ Stars</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => onFiltersChange({})}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;
