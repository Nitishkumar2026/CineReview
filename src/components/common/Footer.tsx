import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <span className="text-lg font-bold">CR</span>
              </div>
              <span className="text-xl font-bold">CineReview</span>
            </div>
            <p className="text-gray-400">
              Your ultimate destination for movie reviews, ratings, and recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/movies" className="block text-gray-400 hover:text-white transition-colors">
                Browse Movies
              </Link>
              <Link to="/trending" className="block text-gray-400 hover:text-white transition-colors">
                Trending
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              <Link to="/movies?genre=Action" className="block text-gray-400 hover:text-white transition-colors">
                Action
              </Link>
              <Link to="/movies?genre=Comedy" className="block text-gray-400 hover:text-white transition-colors">
                Comedy
              </Link>
              <Link to="/movies?genre=Drama" className="block text-gray-400 hover:text-white transition-colors">
                Drama
              </Link>
              <Link to="/movies?genre=Horror" className="block text-gray-400 hover:text-white transition-colors">
                Horror
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 CineReview. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
