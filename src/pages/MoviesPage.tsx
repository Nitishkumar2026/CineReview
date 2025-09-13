import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { movieApi } from '../services/api';
import { MovieFilters as FilterType } from '../types';
import MovieGrid from '../components/movies/MovieGrid';
import MovieFilters from '../components/movies/MovieFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MoviesPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterType>({});

  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters: FilterType = {};
    
    if (searchParams.get('search')) {
      initialFilters.search = searchParams.get('search')!;
    }
    if (searchParams.get('genre')) {
      initialFilters.genre = searchParams.get('genre')!;
    }
    if (searchParams.get('year')) {
      initialFilters.year = parseInt(searchParams.get('year')!);
    }
    if (searchParams.get('minRating')) {
      initialFilters.minRating = parseFloat(searchParams.get('minRating')!);
    }
    
    setFilters(initialFilters);
  }, [searchParams]);

  // Fetch movies when filters or page changes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieApi.getMovies(currentPage, 12, filters);
        dispatch({ type: 'SET_MOVIES', payload: response.data });
        setTotalPages(response.totalPages);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load movies' });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters, currentPage, dispatch]);

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.genre) params.set('genre', newFilters.genre);
    if (newFilters.year) params.set('year', newFilters.year.toString());
    if (newFilters.minRating) params.set('minRating', newFilters.minRating.toString());
    
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Movies</h1>
          <p className="text-gray-600">
            Discover and explore our collection of movies
          </p>
        </div>

        {/* Filters */}
        <MovieFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Movies Grid */}
        {!loading && (
          <>
            <MovieGrid movies={state.movies} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && state.movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No movies found matching your criteria.
            </p>
            <button
              onClick={() => handleFiltersChange({})}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
