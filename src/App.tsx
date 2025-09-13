import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { userApi } from './services/api';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';
import WatchlistPage from './pages/WatchlistPage';
import LoginPage from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // Simulate checking for existing auth session
    const checkAuth = async () => {
      // In a real app, you'd check for stored tokens/sessions
      // For demo purposes, we'll auto-login with a demo user
      try {
        // Auto-login for demo purposes
        const user = {
          id: '1',
          username: 'demo_user',
          email: 'demo@cinereview.com',
          profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          joinDate: new Date('2024-01-01').toISOString(),
          totalReviews: 5,
        };
        
        dispatch({ type: 'LOGIN', payload: user });
        
        // Load user's watchlist
        const watchlistResponse = await userApi.getWatchlist(user.id);
        dispatch({ type: 'SET_WATCHLIST', payload: watchlistResponse.data });
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
