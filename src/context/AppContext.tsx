import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Movie, User, Review, WatchlistItem } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  movies: Movie[];
  featuredMovies: Movie[];
  trendingMovies: Movie[];
  watchlist: WatchlistItem[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'SET_FEATURED_MOVIES'; payload: Movie[] }
  | { type: 'SET_TRENDING_MOVIES'; payload: Movie[] }
  | { type: 'SET_WATCHLIST'; payload: WatchlistItem[] }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'ADD_TO_WATCHLIST'; payload: WatchlistItem }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: string }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  movies: [],
  featuredMovies: [],
  trendingMovies: [],
  watchlist: [],
  reviews: [],
  loading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload };
    case 'SET_FEATURED_MOVIES':
      return { ...state, featuredMovies: action.payload };
    case 'SET_TRENDING_MOVIES':
      return { ...state, trendingMovies: action.payload };
    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.payload };
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload };
    case 'ADD_TO_WATCHLIST':
      return { ...state, watchlist: [...state.watchlist, action.payload] };
    case 'REMOVE_FROM_WATCHLIST':
      return { 
        ...state, 
        watchlist: state.watchlist.filter(item => item.id !== action.payload) 
      };
    case 'ADD_REVIEW':
      return { ...state, reviews: [...state.reviews, action.payload] };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, watchlist: [], reviews: [] };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
