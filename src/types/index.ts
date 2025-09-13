export interface Movie {
  id: string;
  title: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  synopsis: string;
  posterUrl: string;
  trailerUrl?: string;
  averageRating: number;
  totalReviews: number;
  duration: number;
  featured?: boolean;
  trending?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  joinDate: string;
  totalReviews: number;
}

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  reviewText: string;
  timestamp: string;
  user: {
    username: string;
    profilePicture?: string;
  };
}

export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  dateAdded: string;
  movie: Movie;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface MovieFilters {
  genre?: string;
  year?: number;
  minRating?: number;
  search?: string;
}
