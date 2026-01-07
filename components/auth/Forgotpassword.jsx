"use client";
import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const response = await fetch(`${API_BASE_URL}/users/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset email');
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const response = await fetch(`${API_BASE_URL}/users/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend email');
      }

      console.log('Resent email to:', email);
    } catch (err) {
      console.error('Resend email error:', err);
      setError(err.message || 'Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '16px',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(99, 102, 241, 0.05)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'rgba(34, 197, 94, 0.05)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '80px',
        height: '80px',
        background: 'rgba(168, 85, 247, 0.05)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(-5px) rotate(-3deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes successBounce {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Mobile responsive styles */
        @media (max-width: 640px) {
          .forgot-container {
            padding: 24px !important;
            margin: 8px !important;
            border-radius: 16px !important;
          }
          .back-button {
            padding: 8px !important;
            min-width: 40px !important;
            min-height: 40px !important;
          }
          .main-title {
            font-size: 28px !important;
          }
          .subtitle {
            font-size: 14px !important;
          }
          .email-input {
            padding: 14px !important;
            padding-left: 46px !important;
            font-size: 16px !important;
          }
          .submit-button {
            padding: 14px !important;
            font-size: 16px !important;
            min-height: 48px !important;
          }
        }
        
        @media (max-width: 480px) {
          .forgot-container {
            padding: 20px !important;
          }
          .header-section {
            margin-bottom: 28px !important;
          }
        }
      `}</style>

      <div 
        className="forgot-container"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '48px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          animation: 'slideUp 0.8s ease-out',
          margin: '16px',
          position: 'relative'
        }}>
        
        {!isSuccess ? (
          <>
            {/* Header with back button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <a
                href="/login"
                className="back-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  background: 'rgba(248, 250, 252, 0.9)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  color: '#374151',
                  minWidth: '44px',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.transform = 'translateX(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(248, 250, 252, 0.9)';
                  e.target.style.transform = 'translateX(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <ArrowLeft size={20} />
              </a>
            </div>

            {/* Main content */}
            <div 
              className="header-section"
              style={{
                textAlign: 'center',
                marginBottom: '40px'
              }}>
              
              {/* Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '20px',
                margin: '0 auto 24px',
                animation: 'pulse 2s infinite'
              }}>
                <Mail size={32} color="white" />
              </div>

              <h1 
                className="main-title"
                style={{
                  color: '#111827',
                  margin: '0 0 12px 0',
                  fontSize: '32px',
                  fontWeight: '800'
                }}>
                {t('login.ForgotPassword')}
              </h1>
              
              <p 
                className="subtitle"
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                {t('login.Noworries')}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#dc2626',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontSize: '14px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Email input */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#374151',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {t('login.Emainaddress')}
              </label>
              
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t('login.Enteryouremailaddress')}
                  disabled={loading}
                  autoComplete="email"
                  className="email-input"
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingLeft: '48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: loading ? '#f9fafb' : 'white',
                    boxSizing: 'border-box',
                    outline: 'none',
                    opacity: loading ? 0.7 : 1,
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                
                <Mail 
                  size={20} 
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    pointerEvents: 'none',
                    zIndex: 1
                  }} 
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="submit-button"
              style={{
                width: '100%',
                padding: '16px',
                background: loading || !email 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '52px',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
              onMouseEnter={(e) => {
                if (!loading && email) {
                  e.target.style.transform = 'translateY(-2px)';
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
                  {t('login.Sending')}
                </>
              ) : (
                <>
                  <Mail size={20} />
                  {t('login.SendResetLink')}
                </>
              )}
            </button>

            {/* Back to login link */}
            <div style={{
              textAlign: 'center',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <p style={{
                color: '#6b7280',
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {t('login.RememberedYourPassword')}{' '}
                <a
                  href="/login"
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  {t('login.BacktoLogin')}
                </a>
              </p>
            </div>
          </>
        ) : (
          /* Success state */
          <div style={{
            textAlign: 'center',
            animation: 'successBounce 0.6s ease-out'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              margin: '0 auto 24px'
            }}>
              <CheckCircle size={40} color="white" />
            </div>

            <h2 style={{
              color: '#111827',
              margin: '0 0 16px 0',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              {t('login.CheckYourEmail')}
            </h2>

            <p style={{
              color: '#6b7280',
              fontSize: '16px',
              margin: '0 0 32px 0',
              lineHeight: '1.6'
            }}>
              {t('login.Wevesentapassword')}{' '}
              <span style={{ 
                color: '#374151', 
                fontWeight: '600' 
              }}>
                {email}
              </span>
            </p>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#1e40af',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '32px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <p style={{
                color: '#1e40af',
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {t('login.Didntreceive')}{' '}
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  style={{
                    color: '#3b82f6',
                    background: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {loading ? t('login.Sending') : t('login.resendemail')}
                </button>
              </p>
            </div>

            <a
              href="/login"
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <ArrowLeft size={20} />
              {t('login.BacktoLogin')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;