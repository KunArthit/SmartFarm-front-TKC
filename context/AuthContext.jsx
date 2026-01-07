"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL - Update this to match your backend
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          // Try to verify token with your backend
          const response = await fetch(`${API_BASE_URL}/api/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.valid && data.user) {
              // Format user data to match your backend structure
              const userDataFromAPI = {
                user_id: data.user.user_id,
                username: data.user.username,
                email: data.user.email,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                phone: data.user.phone,
                user_type_id: data.user.user_type_id,
                department_id: data.user.department_id,
                company_name: data.user.company_name || '',
                tax_id: data.user.tax_id || '',
                is_active: data.user.is_active,
                created_at: data.user.created_at,
                updated_at: data.user.updated_at,
                role: data.user.user_type_id === 1 ? 'admin' : 'user',
              };
              
              setUser(userDataFromAPI);
              // Update stored user data
              localStorage.setItem('userData', JSON.stringify(userDataFromAPI));
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('access_token');
              localStorage.removeItem('userData');
              setUser(null);
            }
          } else {
            // If verify endpoint doesn't exist or fails, use stored data as fallback
            console.log('Verify endpoint not available, using stored user data');
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          }
        } catch (verifyError) {
          // If verify endpoint doesn't exist or network error, use stored data
          console.log('Token verification failed, using stored data:', verifyError.message);
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } else {
        // No token or user data, user is not logged in
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Don't clear storage on general errors, only on specific auth failures
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (parseError) {
        // If we can't parse stored data, clear everything
        localStorage.removeItem('access_token');
        localStorage.removeItem('userData');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username, 
          password: password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          setError(data.error);
          return { 
            success: false, 
            error: data.error 
          };
        }

        // Extract user data from your API response
        const userData = {
          user_id: data.user.user_id,
          username: data.user.username,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          phone: data.user.phone,
          user_type_id: data.user.user_type_id,
          department_id: data.user.department_id,
          company_name: data.user.company_name || '',
          tax_id: data.user.tax_id || '',
          is_active: data.user.is_active,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at,
          role: data.user.user_type_id === 1 ? 'admin' : 'user',
          loginTime: new Date().toISOString(),
        };

        // Store user data and token
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('access_token', data.access_token);
        setUser(userData);
        
        return { 
          success: true, 
          user: userData,
          token: data.access_token,
          message: 'Login successful'
        };
      } else {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Login failed with status: ${response.status}`;
        }
        
        setError(errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Network error. Please check your connection.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function using your sign-up endpoint
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          displayName: `${userData.firstName} ${userData.lastName}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if there's an error in the response
        if (data.error) {
          setError(data.error);
          return { 
            success: false, 
            error: data.error 
          };
        }

        // Format user data
        const newUser = {
          user_id: data.user.user_id,
          username: data.user.username,
          email: data.user.email || userData.email,
          firstName: data.user.first_name || userData.firstName,
          lastName: data.user.last_name || userData.lastName,
          phone: data.user.phone || userData.phone || '',
          user_type_id: data.user.user_type_id,
          department_id: data.user.department_id,
          company_name: data.user.company_name || '',
          tax_id: data.user.tax_id || '',
          is_active: data.user.is_active,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at,
          role: data.user.user_type_id === 1 ? 'admin' : 'user',
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem('userData', JSON.stringify(newUser));
        localStorage.setItem('access_token', data.access_token);
        setUser(newUser);
        
        return { 
          success: true, 
          user: newUser,
          token: data.access_token,
          message: 'Registration successful'
        };
      } else {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Registration failed with status: ${response.status}`;
        }
        
        setError(errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Network error. Please try again.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Call logout endpoint
      if (token) {
        try {
          await fetch(`${API_BASE_URL}/api/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (logoutError) {
          console.log('Logout API call failed, continuing with local logout');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('userData');
      localStorage.removeItem('access_token');
      setUser(null);
      setError(null);
    }
  };

  // Update user profile using your backend endpoint
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!user?.user_id) {
        throw new Error('User ID not found');
      }

      // Prepare update data in the format your backend expects
      const updateData = {
        first_name: profileData.firstName || user.firstName,
        last_name: profileData.lastName || user.lastName,
        email: profileData.email || user.email,
        phone: profileData.phone || user.phone,
        company_name: profileData.company_name || user.company_name,
        tax_id: profileData.tax_id || user.tax_id,
      };

      const response = await fetch(`${API_BASE_URL}/api/user/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: updateData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return { 
            success: false, 
            error: data.error 
          };
        }
        
        // Update user data with response
        const updatedUser = { 
          ...user, 
          firstName: data.first_name || user.firstName,
          lastName: data.last_name || user.lastName,
          email: data.email || user.email,
          phone: data.phone || user.phone,
          company_name: data.company_name || user.company_name,
          tax_id: data.tax_id || user.tax_id,
          updated_at: data.updated_at || new Date().toISOString(),
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { 
          success: true, 
          user: updatedUser,
          message: 'Profile updated successfully'
        };
      } else {
        let errorMessage = 'Profile update failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Update failed with status: ${response.status}`;
        }
        
        setError(errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || 'Network error. Please try again.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(`${API_BASE_URL}/api/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newToken = response.headers.get('New-Access-Token');
        
        if (newToken) {
          localStorage.setItem('access_token', newToken);
          return { success: true, token: newToken };
        }
        
        return { success: true };
      } else {
        return { success: false, error: 'Token refresh failed' };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: error.message };
    }
  };

  // Auth context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    isAuthenticated: !!user,
    clearError: () => setError(null),
    // Helper functions to access user data easily
    getUserId: () => user?.user_id,
    getToken: () => localStorage.getItem('access_token'),
    isAdmin: () => user?.user_type_id === 1,
    isUser: () => user?.user_type_id === 2,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};