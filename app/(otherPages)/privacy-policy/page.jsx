'use client'
import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import React from "react";
import { useTranslation } from "react-i18next";

export default function page() {
  const { t } = useTranslation();

  return (
    <>
      <Header7 />
      <Nav />
      {/* page-title */}
      <div className="tf-page-title style-2" style={{
          background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #f0f4ff 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container-full">
            <div style={{
              position: 'relative',
              zIndex: 10,
              padding: '0.5rem 1rem',
              textAlign: 'center'
            }}>
              {/* Main Heading */}
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '1rem',
                  letterSpacing: '-0.025em'
                }}>
                  {t('privacypolicy.PrivacyPolicy')}
                </h1>
                <div style={{
                  width: '6rem',
                  height: '4px',
                  background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                  margin: '0 auto',
                  borderRadius: '2px'
                }}></div>
              </div>
              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                top: '2.5rem',
                left: '2.5rem',
                width: '5rem',
                height: '5rem',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                opacity: 0.3,
                animation: 'pulse 2s infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '2.5rem',
                right: '2.5rem',
                width: '4rem',
                height: '4rem',
                backgroundColor: '#e0e7ff',
                borderRadius: '50%',
                opacity: 0.3,
                animation: 'pulse 2s infinite 1s'
              }}></div>
            </div>
          </div>
        </div>

      {/* Enhanced main content */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="tf-main-area-page">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              
              {/* Last updated badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '2rem',
                border: '1px solid #7dd3fc'
              }}>
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {t('privacypolicy.date')}
              </div>

              {/* Introduction card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem'
                  }}>
                    <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {t('privacypolicy.introduction')}
                </h2>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                {t('privacypolicy.title1')}
                </p>
              </div>

              {/* Main content with enhanced styling */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  whiteSpace: 'pre-line', 
                  lineHeight: '1.8', 
                  fontSize: '15px',
                  color: '#374151'
                }}>
                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point1')}</li>
                    <li className="mb-3">{t('privacypolicy.content1.1')}</li>
                    <li className="mt-3">{t('privacypolicy.content1.1.1')}</li>
                    <li>{t('privacypolicy.content1.2')}</li>
                    <li>{t('privacypolicy.content1.3')}</li>
                    <li>{t('privacypolicy.content1.4')}</li>
                    <li>{t('privacypolicy.content1.5')}</li>
                    <li className="mb-3">{t('privacypolicy.content1.6')}</li>
                  </ul>
                  
                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point2')}</li>
                    <li className="mb-3">{t('privacypolicy.content2.0')}</li>
                    <li>{t('privacypolicy.content2.1')}</li>
                    <li> {t('privacypolicy.content2.1.1')}</li>
                    <li>{t('privacypolicy.content2.1.2')}</li>
                    <li>{t('privacypolicy.content2.1.3')}</li>
                    <li>{t('privacypolicy.content2.1.4')}</li>
                    <li>{t('privacypolicy.content2.1.5')}</li>
                    <li>{t('privacypolicy.content2.1.6')}</li>
                    <li className="mb-3">{t('privacypolicy.content2.1.7')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point2.2')}</li>
                    <li>{t('privacypolicy.content2.2.1')}</li>
                    <li>{t('privacypolicy.content2.2.2')}</li>
                    <li>{t('privacypolicy.content2.2.3')}</li>
                    <li>{t('privacypolicy.content2.2.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content2.2.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point2.3')}</li>
                    <li>{t('privacypolicy.content2.3.1')}</li>
                    <li>{t('privacypolicy.content2.3.2')}</li>
                    <li>{t('privacypolicy.content2.3.3')}</li>
                    <li>{t('privacypolicy.content2.3.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content2.3.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point3')}</li>
                    <li>{t('privacypolicy.content3.1')}</li>
                    <li>{t('privacypolicy.content3.2')}</li>
                    <li>{t('privacypolicy.content3.3')}</li>
                    <li>{t('privacypolicy.content3.4')}</li>
                    <li>{t('privacypolicy.content3.5')}</li>
                    <li>{t('privacypolicy.content3.6')}</li>
                    <li className="mb-3">{t('privacypolicy.content3.7')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point4')}</li>
                    <li className="mb-3">{t('privacypolicy.content4.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point4.1')}</li>
                    <li>{t('privacypolicy.content4.1.1')}</li>
                    <li>{t('privacypolicy.content4.1.2')}</li>
                    <li>{t('privacypolicy.content4.1.3')}</li>
                    <li>{t('privacypolicy.content4.1.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content4.1.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point4.2')}</li>
                    <li>{t('privacypolicy.content4.2.1')}</li>
                    <li>{t('privacypolicy.content4.2.2')}</li>
                    <li>{t('privacypolicy.content4.2.3')}</li>
                    <li>{t('privacypolicy.content4.2.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content4.2.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point4.3')}</li>
                    <li>{t('privacypolicy.content4.3.1')}</li>
                    <li>{t('privacypolicy.content4.3.2')}</li>
                    <li>{t('privacypolicy.content4.3.3')}</li>
                    <li>{t('privacypolicy.content4.3.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content4.3.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point4.4')}</li>
                    <li>{t('privacypolicy.content4.4.1')}</li>
                    <li>{t('privacypolicy.content4.4.2')}</li>
                    <li>{t('privacypolicy.content4.4.3')}</li>
                    <li>{t('privacypolicy.content4.4.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content4.4.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point5')}</li>
                    <li className="mb-3">{t('privacypolicy.content5.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point5.1')}</li>
                    <li>{t('privacypolicy.content5.1.1')}</li>
                    <li>{t('privacypolicy.content5.1.2')}</li>
                    <li>{t('privacypolicy.content5.1.3')}</li>
                    <li>{t('privacypolicy.content5.1.4')}</li>
                    <li>{t('privacypolicy.content5.1.5')}</li>
                    <li className="mb-3">{t('privacypolicy.content5.1.6')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point5.2')}</li>
                    <li>{t('privacypolicy.content5.2.1')}</li>
                    <li>{t('privacypolicy.content5.2.2')}</li>
                    <li>{t('privacypolicy.content5.2.3')}</li>
                    <li>{t('privacypolicy.content5.2.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content5.2.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point5.3')}</li>
                    <li>{t('privacypolicy.content5.3.1')}</li>
                    <li>{t('privacypolicy.content5.3.2')}</li>
                    <li>{t('privacypolicy.content5.3.3')}</li>
                    <li>{t('privacypolicy.content5.3.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content5.3.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point5.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content5.4.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point6')}</li>
                    <li>{t('privacypolicy.content6.1')}</li>
                    <li>{t('privacypolicy.content6.2')}</li>
                    <li>{t('privacypolicy.content6.3')}</li>
                    <li>{t('privacypolicy.content6.4')}</li>
                    <li>{t('privacypolicy.content6.5')}</li>
                    <li className="mb-3">{t('privacypolicy.content6.6')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point7')}</li>
                    <li>{t('privacypolicy.content7.1')}</li>
                    <li>{t('privacypolicy.content7.2')}</li>
                    <li>{t('privacypolicy.content7.3')}</li>
                    <li>{t('privacypolicy.content7.4')}</li>
                    <li>{t('privacypolicy.content7.5')}</li>
                    <li className="mb-3">{t('privacypolicy.content7.6')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8.1')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.1.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8.2')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.2.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8.3')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.3.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.4.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8.5')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.5.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8.6')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.6.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8.7')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.7.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point8.8')}</li>
                    <li className="mb-3">{t('privacypolicy.content8.8.1')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point9')}</li>
                    <li>{t('privacypolicy.content9.1')}</li>
                    <li>{t('privacypolicy.content9.2')}</li>
                    <li>{t('privacypolicy.content9.3')}</li>
                    <li>{t('privacypolicy.content9.4')}</li>
                    <li>{t('privacypolicy.content9.5')}</li>
                    <li>{t('privacypolicy.content9.6')}</li>
                    <li className="mb-3">{t('privacypolicy.content9.7')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point10')}</li>
                    <li>{t('privacypolicy.content10.1')}</li>
                    <li>{t('privacypolicy.content10.2')}</li>
                    <li>{t('privacypolicy.content10.3')}</li>
                    <li>{t('privacypolicy.content10.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content10.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point11')}</li>
                    <li>{t('privacypolicy.content11.1')}</li>
                    <li className="mb-3">{t('privacypolicy.content11.2')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point12')}</li>
                    <li>{t('privacypolicy.content12.1')}</li>
                    <li>{t('privacypolicy.content12.2')}</li>
                    <li>{t('privacypolicy.content12.3')}</li>
                    <li>{t('privacypolicy.content12.4')}</li>
                    <li>{t('privacypolicy.content12.5')}</li>
                    <li>{t('privacypolicy.content12.6')}</li>
                    <li>{t('privacypolicy.content12.7')}</li>
                    <li className="mb-3">{t('privacypolicy.content12.8')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point13')}</li>
                    <li>{t('privacypolicy.content13.1')}</li>
                    <li>{t('privacypolicy.content13.2')}</li>
                    <li>{t('privacypolicy.content13.3')}</li>
                    <li>{t('privacypolicy.content13.4')}</li>
                    <li className="mb-3">{t('privacypolicy.content13.5')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point14')}</li>
                    <li>{t('privacypolicy.content14.1')}</li>
                    <li>{t('privacypolicy.content14.2')}</li>
                    <li>{t('privacypolicy.content14.3')}</li>
                    <li>{t('privacypolicy.content14.4')}</li>
                    <li>{t('privacypolicy.content14.5')}</li>
                    <li className="mb-3">{t('privacypolicy.content14.6')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point15')}</li>
                    <li>{t('privacypolicy.content15.1')}</li>
                    <li>{t('privacypolicy.content15.2')}</li>
                    <li>{t('privacypolicy.content15.3')}</li>
                    <li>{t('privacypolicy.content15.4')}</li>
                    <li>{t('privacypolicy.content15.5')}</li>
                    <li>{t('privacypolicy.content15.6')}</li>
                    <li className="mb-3">{t('privacypolicy.content15.7')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point16')}</li>
                    <li>{t('privacypolicy.content16.1')}</li>
                    <li>{t('privacypolicy.content16.2')}</li>
                    <li>{t('privacypolicy.content16.3')}</li>
                    <li>{t('privacypolicy.content16.4')}</li>
                    <li>{t('privacypolicy.content16.5')}</li>
                    <li className="mb-3">{t('privacypolicy.content16.6')}</li>
                  </ul>

                  <ul className="list-disc pl-6">
                    <li>{t('privacypolicy.point17')}</li>
                    <li className="mb-3">{t('privacypolicy.content17.1')}</li>
                  </ul>

                  </div>
              </div>

              {/* Enhanced contact section */}
              <div style={{
                marginTop: '2rem',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: 'clamp(1rem, 4vw, 2rem)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  color: '#1f2937'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    marginBottom: '0.5rem',
                    flexShrink: 0
                  }}>
                    <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  {t('privacypolicy.howtocontectus')}
                </h3>
                
                <p style={{
                  marginBottom: '1.5rem',
                  lineHeight: '1.6',
                  color: '#6b7280',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  {t('privacypolicy.youareentitled')}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    color: '#1f2937'
                  }}>
                    <div style={{ 
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                      wordBreak: 'break-word'
                    }}>
                      <strong style={{ color: '#3b82f6' }}>{t('privacypolicy.email')}</strong> privacy@company.com
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    color: '#1f2937'
                  }}>
                    <div style={{ 
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                      wordBreak: 'break-word'
                    }}>
                      <strong style={{ color: '#3b82f6' }}>{t('privacypolicy.phone')}</strong> (+66) 0-2401-8222
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.5rem',
                  color: '#1f2937'
                }}>
                  <div style={{ 
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    wordBreak: 'break-word'
                  }}>
                    <strong style={{ color: '#3b82f6' }}>{t('privacypolicy.address')}</strong> {t('privacypolicy.address2')}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#eff6ff',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #bfdbfe'
                }}>
                  <p style={{
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    marginBottom: '0.5rem',
                    color: '#1f2937',
                    lineHeight: '1.5'
                  }}>
                    {t('privacypolicy.wewillrespond')}
                  </p>
                  <p style={{
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    marginBottom: '0',
                    color: '#1f2937',
                    lineHeight: '1.5'
                  }}>
                  {t('privacypolicy.ifyouhave')}                  
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <Footer1 />
    </>
  );
}