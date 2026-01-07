// utils/auth.js
// Authentication utility functions

export const authUtils = {
  // Get access token from localStorage or cookies
  getToken: () => {
    if (typeof window !== 'undefined') {
      // First try localStorage
      let token = localStorage.getItem('access_token');
      
      // If not found and remember me was used, try cookies
      if (!token) {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
          // Also restore to localStorage for easier access
          localStorage.setItem('access_token', token);
        }
      }
      
      return token;
    }
    return null;
  },

  // Get user data from localStorage
  getUser: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = authUtils.getToken();
    if (!token) return false;
    
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (payload.exp < currentTime) {
        authUtils.logout(); // Auto logout if expired
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      authUtils.logout();
      return false;
    }
  },

  // Logout function
  logout: () => {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('remember_me');
      
      // Clear cookies
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login page
      window.location.href = '/login';
    }
  },

  // Get authorization headers for API calls
  getAuthHeaders: () => {
    const token = authUtils.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  },

  // Make authenticated API calls
  apiCall: async (url, options = {}) => {
    const headers = authUtils.getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      authUtils.logout();
      throw new Error('Session expired. Please login again.');
    }

    return response;
  }
};

// Hook for using auth in React components
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authUtils.isAuthenticated();
      const userData = authUtils.getUser();
      
      setIsAuthenticated(authenticated);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token' && !e.newValue) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    logout: authUtils.logout,
    getToken: authUtils.getToken
  };
};