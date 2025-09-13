import Fuse from 'fuse.js';
import { Movie, User, Review, WatchlistItem, ApiResponse, PaginatedResponse, MovieFilters } from '../types';
import { generateMockMovies, generateMockUser, generateMockReviews } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockMovies = generateMockMovies(50);
let mockUser = generateMockUser();
let mockWatchlist: WatchlistItem[] = [];
let mockReviews: Review[] = [];

// Populate initial reviews for some movies
mockMovies.slice(0, 10).forEach(movie => {
  const reviews = generateMockReviews(movie.id, Math.floor(Math.random() * 15) + 5);
  mockReviews = [...mockReviews, ...reviews];
});

export const movieApi = {
  // Get all movies with pagination and filtering
  getMovies: async (
    page: number = 1, 
    limit: number = 12, 
    filters?: MovieFilters
  ): Promise<PaginatedResponse<Movie>> => {
    await delay(500);
    
    // Always get a fresh, full list of movies for filtering
    let allMovies = generateMockMovies(50);
    let filteredMovies = [...allMovies];
    
    // Apply fuzzy search if a search term is provided
    if (filters?.search && filters.search.trim().length > 0) {
      const fuseOptions = {
        keys: [
          { name: 'title', weight: 0.6 },
          { name: 'director', weight: 0.2 },
          { name: 'cast', weight: 0.2 },
        ],
        includeScore: true,
        threshold: 0.4, // Lower threshold means more strict matching
        minMatchCharLength: 2,
      };
      
      const fuse = new Fuse(allMovies, fuseOptions);
      const searchResult = fuse.search(filters.search.trim());
      filteredMovies = searchResult.map(result => result.item);
    }
    
    // Apply other filters on the (potentially search-filtered) list
    if (filters?.genre) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genre.includes(filters.genre!)
      );
    }
    
    if (filters?.year) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.releaseYear === filters.year
      );
    }
    
    if (filters?.minRating) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.averageRating >= filters.minRating!
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
    
    return {
      data: paginatedMovies,
      page,
      totalPages: Math.ceil(filteredMovies.length / limit),
      totalItems: filteredMovies.length,
    };
  },

  // Get featured movies
  getFeaturedMovies: async (): Promise<ApiResponse<Movie[]>> => {
    await delay(300);
    const allMovies = generateMockMovies(50);
    return {
      data: allMovies.filter(movie => movie.featured),
    };
  },

  // Get trending movies
  getTrendingMovies: async (): Promise<ApiResponse<Movie[]>> => {
    await delay(300);
    const allMovies = generateMockMovies(50);
    return {
      data: allMovies.filter(movie => movie.trending),
    };
  },

  // Get specific movie
  getMovie: async (id: string): Promise<ApiResponse<Movie>> => {
    await delay(300);
    const allMovies = generateMockMovies(100); // Search in a larger pool
    const movie = allMovies.find(m => m.id === id);
    if (!movie) {
      throw new Error('Movie not found');
    }
    return { data: movie };
  },

  // Get reviews for a movie
  getMovieReviews: async (movieId: string): Promise<ApiResponse<Review[]>> => {
    await delay(300);
    const reviews = mockReviews.filter(review => review.movieId === movieId);
    return { data: reviews };
  },

  // Submit a review
  submitReview: async (movieId: string, rating: number, reviewText: string): Promise<ApiResponse<Review>> => {
    await delay(500);
    const newReview: Review = {
      id: Date.now().toString(),
      userId: mockUser.id,
      movieId,
      rating,
      reviewText,
      timestamp: new Date().toISOString(),
      user: {
        username: mockUser.username,
        profilePicture: mockUser.profilePicture,
      },
    };
    
    mockReviews.unshift(newReview);
    
    // Update movie average rating
    const movieReviews = mockReviews.filter(review => review.movieId === movieId);
    const averageRating = movieReviews.reduce((acc, review) => acc + review.rating, 0) / movieReviews.length;
    
    const allMovies = generateMockMovies(100);
    const movie = allMovies.find(m => m.id === movieId);
    if (movie) {
      movie.averageRating = parseFloat(averageRating.toFixed(1));
      movie.totalReviews = movieReviews.length;
    }
    
    return { data: newReview };
  },
};

export const userApi = {
  // Get user profile
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    await delay(300);
    return { data: mockUser };
  },

  // Get user watchlist
  getWatchlist: async (userId: string): Promise<ApiResponse<WatchlistItem[]>> => {
    await delay(300);
    return { data: mockWatchlist };
  },

  // Add to watchlist
  addToWatchlist: async (userId: string, movieId: string): Promise<ApiResponse<WatchlistItem>> => {
    await delay(300);
    const allMovies = generateMockMovies(100);
    const movie = allMovies.find(m => m.id === movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }
    
    const watchlistItem: WatchlistItem = {
      id: Date.now().toString(),
      userId,
      movieId,
      dateAdded: new new Date().toISOString(),
      movie,
    };
    
    mockWatchlist.push(watchlistItem);
    return { data: watchlistItem };
  },

  // Remove from watchlist
  removeFromWatchlist: async (userId: string, movieId: string): Promise<ApiResponse<boolean>> => {
    await delay(300);
    const index = mockWatchlist.findIndex(item => item.movieId === movieId && item.userId === userId);
    if (index !== -1) {
      mockWatchlist.splice(index, 1);
    }
    return { data: true };
  },

  // Get user reviews
  getUserReviews: async (userId: string): Promise<ApiResponse<Review[]>> => {
    await delay(300);
    const userReviews = mockReviews.filter(review => review.userId === userId);
    return { data: userReviews };
  },
};

export const authApi = {
  // Login
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    await delay(1000);
    // Mock login - always successful
    return { data: mockUser };
  },

  // Register
  register: async (username: string, email: string, password: string): Promise<ApiResponse<User>> => {
    await delay(1000);
    // Mock registration - always successful
    mockUser = { ...mockUser, username, email };
    return { data: mockUser };
  },

  // Logout
  logout: async (): Promise<ApiResponse<boolean>> => {
    await delay(300);
    return { data: true };
  },
};
