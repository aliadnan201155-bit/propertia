import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { APP_CONSTANTS } from "../config/constants";
import useTokenVerification from "../hooks/useTokenVerification";

const AuthContext = createContext();

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);

      if (token) {
        await axios.post(
          `${BACKEND_URL}/api/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data || null;
    } catch (err) {
      console.error("Fetch user error:", err);
      return null;
    }
  };

  const handleAuth = useCallback(
    async (token) => {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const isExpired = tokenData.exp * 1000 < Date.now();

        if (isExpired) {
          return logout();
        }

        const userData = await fetchUserData(token);

        if (!userData) {
          return logout();
        }

        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth handling error:", err);
        logout();
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    const token =
      urlToken || localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);

    if (urlToken) {
      localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, urlToken);

      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }

    if (token) {
      handleAuth(token);
    } else {
      setIsLoading(false);
    }
  }, [handleAuth]);

  // 🔴 LOGIN
  const login = (token, userData) => {
    localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, token);

    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };

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