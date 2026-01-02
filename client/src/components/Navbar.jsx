import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">
              Incident Manager
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/incidents">Incidents</NavLink>
                <NotificationCenter />
                
                <div className="ml-4 flex items-center gap-3">
                  <div className="text-sm text-gray-700">
                    {user?.name}
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/incidents" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  Incidents
                </Link>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="px-3 py-2 text-sm text-gray-600">{user?.name}</div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

