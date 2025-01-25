import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleAnalytics = () => navigate('/analytics');
  const handleBMI = () => navigate('/bmi');
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const handleTracker = () => navigate('/tracker');
  const handleProfile = () => navigate('/profile');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-white font-bold text-2xl hover:text-gray-200 transition duration-300"
          >
            NutriAI
          </Link>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleAnalytics}
                  className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
                >
                  My Analytics
                </button>
                <button 
                  onClick={handleTracker}
                  className="bg-pink-500 text-white hover:bg-pink-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
                >
                  Tracker & AI
                </button>
                <button 
                  onClick={handleProfile}
                  className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
                >
                  My Profile
                </button>
                <button 
                  onClick={handleBMI}
                  className="bg-[#2b9cff] text-white hover:bg-[#815eff] px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
                >
                  Check BMI
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Links */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col items-start space-y-2 p-4 bg-indigo-700 text-white rounded-lg shadow-md">
              {token ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="w-full text-left hover:bg-indigo-500 px-4 py-2 rounded-md transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleAnalytics();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition duration-300"
                  >
                    My Analytics
                  </button>
                  <button 
                    onClick={() => {
                      handleTracker();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md transition duration-300"
                  >
                    Tracker & AI
                  </button>
                  <button 
                    onClick={() => {
                      handleProfile();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition duration-300"
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="w-full text-left hover:bg-indigo-500 px-4 py-2 rounded-md transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="w-full text-left hover:bg-indigo-500 px-4 py-2 rounded-md transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
