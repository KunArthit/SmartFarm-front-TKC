"use client";
import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, Check, UserCircle, Building2, AlertTriangle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../public/images/logo/FarmSuk-TM.png';
import Image from 'next/image';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    taxId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(true);
  const [userType, setUserType] = useState(null);
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (userType === 2 && !formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!acceptTerms) {
      errors.terms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // อัพเดต handleChange เพื่อตรวจสอบ email
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
  
  if (validationErrors[name]) {
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }
  
  if (error) setError('');

  // ตรวจสอบ email แบบ real-time (ใช้ debounce เพื่อไม่ให้เรียก API บ่อยเกินไป)
  if (name === 'email') {
    clearTimeout(window.emailCheckTimeout);
    window.emailCheckTimeout = setTimeout(() => {
      checkEmailAvailability(value);
    }, 1000); // รอ 1 วินาทีหลังจากผู้ใช้หยุดพิมพ์
  }
};

  // Register Form - Updated handleSubmit with better error handling
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setError('');

  try {
    // ตรวจสอบ email ก่อนส่งข้อมูล
    const checkEmailResponse = await fetch(`${apiEndpoint}/users/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email }),
    });

    if (checkEmailResponse.ok) {
      const checkResult = await checkEmailResponse.json();
      if (checkResult.exists) {
        setError('This email address is already registered. Please use a different email or try signing in.');
        setLoading(false);
        return;
      }
    }

    // Prepare the API payload
    const apiPayload = {
      username: formData.email, // Using email as username
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      user_type_id: userType || 3, // Default to person_customer if not selected
      department_id: 1,
      company_name: userType === 2 ? formData.companyName : "",
      tax_id: userType === 2 ? formData.taxId : "",
      is_active: 1
    };

    // Make API call
    const response = await fetch(`${apiEndpoint}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 400) {
        const errorData = await response.json();
        // ตรวจสอบข้อความ error ที่เฉพาะเจาะจง
        if (errorData.message?.includes('email already exists') || 
            errorData.message?.includes('Email') ||
            errorData.message?.includes('อีเมล')) {
          throw new Error('This email address is already registered. Please use a different email or try signing in.');
        } else if (errorData.message?.includes('username already exists') || 
                   errorData.message?.includes('Username')) {
          throw new Error('This username is already taken. Please choose a different one.');
        } else {
          throw new Error(errorData.message || 'Registration failed. Please check your input.');
        }
      } else if (response.status === 409) {
        throw new Error('An account with this email already exists. Please try signing in instead.');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }

    // const result = await response.json();
    // console.log('Registration successful:', result);

    // Show success message (optional)
    // setError(''); // Clear any previous errors
    // You could show a success toast here

    // Redirect to login page on success
    window.location.href = '/login';

  } catch (err) {
    console.error('Registration error:', err);
    setError(err.message || 'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

// เพิ่มฟังก์ชันตรวจสอบ email แบบ real-time (optional)
const checkEmailAvailability = async (email) => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return; // Don't check invalid emails
  }

  try {
    const response = await fetch(`${apiEndpoint}/users/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.exists) {
        setValidationErrors(prev => ({
          ...prev,
          email: t('auth.This email is already registered')
        }));
      } else {
        // Clear email error if it was about duplication
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors.email === 'This email is already registered') {
            delete newErrors.email;
          }
          return newErrors;
        });
      }
    }
  } catch (error) {
    console.error('Email check error:', error);
    // Don't show error to user for this check, just log it
  }
};

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { score: 0, text: '', color: '#e5e7eb' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const levels = [
      { text: t('login.VeryStrong'), color: '#ef4444' },
      { text: t('login.Weak'), color: '#f97316' },
      { text: t('login.Fair'), color: '#eab308' },
      { text: t('login.Good'), color: '#22c55e' },
      { text: t('login.Strong'), color: '#16a34a' }
    ];

    return { score, ...levels[score] || levels[0] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="mobile-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '12px',
      marginTop: '2rem',
      paddingBottom: 'max(env(safe-area-inset-bottom), 40px)',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Background elements - Hidden on small screens */}
      {mounted && !isMobile && (
        <>
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: '120px',
            height: '120px',
            background: 'rgba(34, 197, 94, 0.05)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite',
            display: isMobile ? 'none' : 'block'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: '100px',
            height: '100px',
            background: 'rgba(59, 130, 246, 0.05)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite reverse',
            display: isMobile ? 'none' : 'block'
          }} />
        </>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        /* Mobile-specific styles */
        @media (max-width: 640px) {
          .mobile-container {
            padding-bottom: env(safe-area-inset-bottom, 20px) !important;
            margin-bottom: 20px !important;
          }
          .form-container {
            padding: 24px !important;
            margin: 8px 8px 40px 8px !important;
            border-radius: 16px !important;
          }
          .name-fields {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .header-title {
            font-size: 24px !important;
          }
          .header-subtitle {
            font-size: 14px !important;
          }
          .logo-container {
            margin-bottom: 12px !important;
          }
          .logo-image {
            height: 48px !important;
          }
          .input-field {
            padding: 14px 14px 14px 44px !important;
            font-size: 16px !important;
          }
          .input-icon {
            left: 14px !important;
          }
          .password-toggle {
            right: 14px !important;
          }
          .submit-button {
            padding: 14px !important;
            font-size: 16px !important;
          }
          .footer-section {
            margin-bottom: env(safe-area-inset-bottom, 20px) !important;
            padding-bottom: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .form-container {
            padding: 20px !important;
            margin: 4px 4px 60px 4px !important;
          }
          .input-field {
            padding: 12px 12px 12px 40px !important;
          }
          .input-icon {
            left: 12px !important;
          }
          .password-toggle {
            right: 12px !important;
          }
          .footer-section {
            margin-bottom: env(safe-area-inset-bottom, 30px) !important;
            padding-bottom: 30px !important;
          }
        }
      `}</style>

      <div className="form-container" style={{
        background: 'white',
        borderRadius: '20px',
        padding: '48px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        animation: 'fadeIn 0.6s ease-out',
        margin: '0'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div className="logo-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Image 
              className="logo-image"
              src={logo}
              alt="FarmSuk-TM Logo"
              style={{
                height: '60px',
                width: 'auto',
                objectFit: 'contain'
              }}
              onError={(e) => {
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
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '12px',
                fontSize: '20px'
              }}>
                <User size={24} color="white" />
              </div>
              <h1 style={{
                color: '#1e293b',
                margin: 0,
                fontSize: '24px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e293b 0%, #22c55e 40%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>FarmSuk-TM</h1>
            </div>
          </div>
          <h2 className="header-title" style={{
            color: '#1e293b',
            margin: 0,
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '8px'
          }}>{t('login.CreateAccount')}</h2>
          <p className="header-subtitle" style={{
            color: '#64748b',
            fontSize: '16px',
            margin: 0
          }}>{t('login.JoinFarmSuk')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '14px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {/* Name Fields */}
          <div className="name-fields" style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#374151',
                fontWeight: 500,
                fontSize: '14px'
              }}>{t('login.FirstName')} *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} className="input-icon" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t('login.FirstName')}
                  disabled={loading}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: `2px solid ${validationErrors.firstName ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: loading ? '#f9fafb' : 'white',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    if (!loading && !validationErrors.firstName) {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = validationErrors.firstName ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {validationErrors.firstName && (
                <span style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'block'
                }}>{validationErrors.firstName}</span>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#374151',
                fontWeight: 500,
                fontSize: '14px'
              }}>{t('login.LastName')}</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('login.LastName')}
                disabled={loading}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  background: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box',
                  outline: 'none'
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
            </div>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              color: '#374151',
              fontWeight: 500,
              fontSize: '14px'
            }}>{t('login.EmailAddress')} *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} className="input-icon" style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('login.YourEmail')}
                disabled={loading}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: `2px solid ${validationErrors.email ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  background: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!loading && !validationErrors.email) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = validationErrors.email ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {validationErrors.email && (
              <span style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>{validationErrors.email}</span>
            )}
          </div>

          {/* Phone Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              color: '#374151',
              fontWeight: 500,
              fontSize: '14px'
            }}>{t('login.PhoneNumber')}</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} className="input-icon" style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+66 XX XXX XXXX"
                disabled={loading}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  background: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box',
                  outline: 'none'
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
            </div>
          </div>

          {/* Company Name Field - Only show for company customers */}
          {userType === 2 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#374151',
                fontWeight: 500,
                fontSize: '14px'
              }}>{t('login.CompanyName')} *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} className="input-icon" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder={t('login.Entercompanyname')}
                  disabled={loading}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: `2px solid ${validationErrors.companyName ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: loading ? '#f9fafb' : 'white',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    if (!loading && !validationErrors.companyName) {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = validationErrors.companyName ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {validationErrors.companyName && (
                <span style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'block'
                }}>{validationErrors.companyName}</span>
              )}
            </div>
          )}

          {/* Tax ID Field - Only show for company customers */}
          {userType === 2 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#374151',
                fontWeight: 500,
                fontSize: '14px'
              }}>{t('login.TaxID')}</label>
              <div style={{ position: 'relative' }}>
                <FileText size={18} className="input-icon" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  placeholder={t('login.Entertaxid')}
                  disabled={loading}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    border: `2px solid ${validationErrors.taxId ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    background: loading ? '#f9fafb' : 'white',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    if (!loading && !validationErrors.taxId) {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = validationErrors.taxId ? '#ef4444' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {validationErrors.taxId && (
                <span style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'block'
                }}>{validationErrors.taxId}</span>
              )}
            </div>
          )}

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              color: '#374151',
              fontWeight: 500,
              fontSize: '14px'
            }}>{t('login.Password')} *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} className="input-icon" style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                zIndex: 1
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('login.CreatePassword')}
                disabled={loading}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 48px',
                  border: `2px solid ${validationErrors.password ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  background: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!loading && !validationErrors.password) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = validationErrors.password ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => !loading && setShowPassword(!showPassword)}
                disabled={loading}
                className="password-toggle"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  minWidth: '28px',
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {t('login.Passwordstrength')}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: passwordStrength.color,
                    fontWeight: 500
                  }}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    height: '100%',
                    background: passwordStrength.color,
                    transition: 'all 0.3s ease'
                  }} />
                </div>
              </div>
            )}
            
            {validationErrors.password && (
              <span style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>{validationErrors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              color: '#374151',
              fontWeight: 500,
              fontSize: '14px'
            }}>{t('login.ConfirmPassword')} *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} className="input-icon" style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('login.ConfirmPassword')}
                disabled={loading}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 48px',
                  border: `2px solid ${validationErrors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  background: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!loading && !validationErrors.confirmPassword) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = validationErrors.confirmPassword ? '#ef4444' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => !loading && setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="password-toggle"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  minWidth: '28px',
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>{validationErrors.confirmPassword}</span>
            )}
          </div>

          {/* Terms Checkbox */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#374151',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <div style={{ position: 'relative', marginTop: '2px', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => !loading && setAcceptTerms(e.target.checked)}
                  disabled={loading}
                  style={{
                    width: '18px',
                    height: '18px',
                    margin: 0
                  }}
                />
                {acceptTerms && (
                  <Check size={14} style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    color: '#22c55e',
                    pointerEvents: 'none'
                  }} />
                )}
              </div>
              <span>
                {t('login.Iagree')}{' '}
                <a href="/privacy-policy" style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: 500
                }}>
                  {t('login.TermsofService')}
                </a>
                {' '}{t('login.and')}{' '}
                <a href="/privacy-policy" style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: 500
                }}>
                  {t('login.PrivacyPolicy')}
                </a>
              </span>
            </label>
            {validationErrors.terms && (
              <span style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '4px',
                display: 'block'
              }}>{validationErrors.terms}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
            style={{
              width: '100%',
              padding: '16px',
              background: loading 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '50px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(34, 197, 94, 0.3)';
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
                {t('login.CreatingAccount')}
              </>
            ) : (
              t('login.CreateAccount')
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="footer-section" style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '14px'
          }}>
              {t('login.Already')}{' '}
            <a href="/login" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              {t('login.SigninHere')}
            </a>
          </p>
        </div>
      </div>

      {/* User Type Selection Modal */}
      {showUserTypeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '16px',
                fontSize: '28px',
                marginBottom: '16px'
              }}>
                <UserCircle size={32} color="white" />
              </div>
              <h3 style={{
                color: '#1e293b',
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '8px'
              }}>{t('login.ChooseAccountType')}</h3>
              <p style={{
                color: '#64748b',
                fontSize: '16px',
                margin: 0
              }}>{t('login.Selectthetype')}</p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Personal Customer Option */}
              <button
                onClick={() => {
                  setUserType(3);
                  setShowUserTypeModal(false);
                }}
                style={{
                  width: '100%',
                  padding: '20px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: '#f0f9ff',
                  borderRadius: '12px',
                  fontSize: '20px'
                }}>
                  <User size={24} color="#3b82f6" />
                </div>
                <div>
                  <h4 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>{t('login.PersonalCustomer')}</h4>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#64748b'
                  }}>{t('login.Indvidual')}</p>
                </div>
              </button>

              {/* Company Customer Option */}
              <button
                onClick={() => {
                  setUserType(2);
                  setShowUserTypeModal(false);
                }}
                style={{
                  width: '100%',
                  padding: '20px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: '#fef3c7',
                  borderRadius: '12px',
                  fontSize: '20px'
                }}>
                  <Building2 size={24} color="#f59e0b" />
                </div>
                <div>
                  <h4 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>{t('login.CompanyCustomer')}</h4>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#64748b'
                  }}>{t('login.Business')}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;