import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { APP_CONSTANTS } from '../config/constants';
import useTokenVerification from '../hooks/useTokenVerification';

const AuthContext = createContext();

// Get backend URL from environment or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
      if (token) {
        // Call backend to blacklist token
        await axios.post(`${BACKEND_URL}/api/users/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API fails
    }
    
    // Perform local logout
    localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.IS_ADMIN_KEY);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
      const isAdmin = localStorage.getItem(APP_CONSTANTS.IS_ADMIN_KEY);
      
      if (token && isAdmin === 'true') {
        // Verify token expiration
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const isExpired = tokenData.exp * 1000 < Date.now();
        
        if (!isExpired) {
          setIsAuthenticated(true);
          
          // Fetch full user data from backend
          const userData = await fetchUserData(token);
          if (userData) {
            setUser(userData);
          } else {
            // Fallback to token data if API call fails
            setUser({ 
              email: tokenData.email || 'Admin',
              name: tokenData.name || 'Admin',
              role: 'admin',
              id: tokenData.id
            });
          }
        } else {
          // Token expired, clear storage
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Check for token in URL parameter (from frontend redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      const processTokenAndFetchUser = async () => {
        try {
          // Validate token structure
          const tokenData = JSON.parse(atob(urlToken.split('.')[1]));
          const isExpired = tokenData.exp * 1000 < Date.now();
          
          if (!isExpired) {
            // Store token and set authenticated state
            localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, urlToken);
            localStorage.setItem(APP_CONSTANTS.IS_ADMIN_KEY, 'true');
            setIsAuthenticated(true);
            
            // Fetch full user data from backend
            const userData = await fetchUserData(urlToken);
            if (userData) {
              setUser(userData);
            } else {
              // Fallback to token data if API call fails
              setUser({
                email: tokenData.email || 'Admin',
                name: tokenData.name || 'Admin',
                role: 'admin',
                id: tokenData.id
              });
            }
            
            // Clean up URL without reloading page
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.toString());
          }
        } catch (error) {
          console.error('Error processing URL token:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      processTokenAndFetchUser();
    } else {
      // No URL token, check normal auth status
      checkAuthStatus();
    }
  }, [checkAuthStatus]);

  const login = (token, userData) => {
    localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, token);
    localStorage.setItem(APP_CONSTANTS.IS_ADMIN_KEY, 'true');
    setIsAuthenticated(true);
    setUser(userData);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus
  };

  // Initialize token verification polling for cross-app logout sync
  // Checks every 400 milliseconds if token is still valid
  useTokenVerification(logout, 1000);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
