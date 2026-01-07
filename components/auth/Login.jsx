"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../public/images/logo/FarmSuk-TM.png'; 
import Image from 'next/image';

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { t } = useTranslation();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/smart-farm-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const result = await response.json();
      // console.log('Login response:', result);

      // Handle error responses
      if (!response.ok) {
        let errorMessage;
        
        if (result.error === "ddddddddd") {
          errorMessage = "Incorrect password. Please check your password and try again.";
        } else if (result.error === "Invalid username" || result.error === "User not found") {
          errorMessage = "Username not found. Please check your username.";
        } else if (result.error === "Account locked" || result.error === "Account disabled") {
          errorMessage = "Your account has been locked. Please contact administrator.";
        } else if (result.error === "Too many attempts") {
          errorMessage = "Too many login attempts. Please try again later.";
        } else if (response.status === 401) {
          errorMessage = "Invalid username or password. Please try again.";
        } else if (response.status === 403) {
          errorMessage = "Account access denied. Please contact administrator.";
        } else if (response.status === 404) {
          errorMessage = "Login service not found. Please contact support.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = result.message || result.error || 'Login failed. Please try again.';
        }
        
        setError(errorMessage);
        return; // Exit early on error
      }

      // Handle successful response
      if (!result.access_token) {
        setError(result.message || result.error || 'Login failed. No access token received.');
        return; // Exit early if no token
      }

      // Login successful - store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', result.access_token);
        
        // Only store user data if it exists
        if (result.user) {
          localStorage.setItem('user_data', JSON.stringify(result.user));
        }
        
        // Handle remember me functionality
        if (rememberMe) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);
          document.cookie = `access_token=${result.access_token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
          localStorage.setItem('remember_me', 'true');
        }
      }
      
      // console.log('Login successful:', result);
      // console.log('User data:', result.user);
      
      // Redirect to dashboard or home page
      router.push('/');
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle network and other errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.message) {
        // This will catch any thrown errors from JSON parsing or other issues
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Subtle background elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(99, 102, 241, 0.05)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(34, 197, 94, 0.05)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '48px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Image 
              src={logo}
              alt="FarmSuk-TM Logo"
              style={{
                height: '80px',
                width: 'auto',
                objectFit: 'contain'
              }}
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '14px',
                fontSize: '24px'
              }}>
                🌿
              </div>
              <h1 style={{
                color: '#1e293b',
                margin: 0,
                fontSize: '32px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e293b 0%, #22c55e 40%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>FarmSuk-TM</h1>
            </div>
          </div>
          <p style={{
            color: '#64748b',
            fontSize: '14px',
            margin: 0
          }}>Turnkey Communication Services Public Company Limited</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              border: '1px solid #fecaca',
              animation: 'shake 0.5s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Username Field */}
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="username" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: 500,
              fontSize: '14px'
            }}>{t('login.Email')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={t('login.Enteryouremail')}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: `2px solid ${error && error.toLowerCase().includes('username') ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '12px',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                background: loading ? '#f9fafb' : 'white',
                boxSizing: 'border-box',
                outline: 'none',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error && error.toLowerCase().includes('username') ? '#ef4444' : '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: 500,
              fontSize: '14px'
            }}>{t('login.Password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('login.Enteryourpassword')}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  paddingRight: '50px',
                  border: `2px solid ${error && error.toLowerCase().includes('password') ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  background: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box',
                  outline: 'none',
                  opacity: loading ? 0.7 : 1
                }}
                onFocus={(e) => {
                  if (!loading) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error && error.toLowerCase().includes('password') ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => !loading && setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  color: '#6b7280',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#374151',
              fontSize: '14px',
              opacity: loading ? 0.5 : 1
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => !loading && setRememberMe(e.target.checked)}
                disabled={loading}
                style={{
                  width: '16px',
                  height: '16px'
                }}
              />
              {t('login.Rememberme')}
            </label>
            <Link href="/forgot-password" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? 'none' : 'auto'
            }}>
              {t('login.ForgotPassword')}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.username || !formData.password}
            style={{
              width: '100%',
              padding: '16px',
              background: loading || !formData.username || !formData.password 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading || !formData.username || !formData.password ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading && formData.username && formData.password) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                {t('login.Signingin')}
              </>
            ) : (
              t('login.Signin')
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '14px'
          }}>
            {t('login.NeedFarmSukaccess')}{' '}
            <Link href="/register-acc" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              {t('login.SignUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;