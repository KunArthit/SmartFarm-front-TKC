'use client'
import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import React from "react";

export default function page() {
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
                  Privacy Policy
                </h1>
                <div style={{
                  width: '6rem',
                  height: '4px',
                  background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                  margin: '0 auto',
                  borderRadius: '2px'
                }}></div>
              </div>

              {/* Language Switch */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '50px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '0.75rem 1.5rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}>
                <svg
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    marginRight: '0.5rem',
                    color: '#3b82f6'
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <a
                  href="/privacy-policy-th"
                  style={{
                    color: '#2563eb',
                    fontWeight: '600',
                    fontSize: '1.125rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.color = '#2563eb'}
                >
                  ภาษาไทย
                </a>
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
                Last updated: 20 June 2025
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
                  Introduction
                </h2>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  This Privacy Policy explains how Turnkey Communication Services Public Company Limited protects and manages your personal data in accordance with Thailand's Personal Data Protection Act B.E. 2562 (2019).
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
                  {`1. Introduction and Data Controller Information
                      Turnkey Communication Services Public Company Limited is committed to safeguarding your personal data. This policy aims to help you understand our transparent data management practices.

                      Data Controller:
                      • Company Name: Turnkey Communication Services Public Company Limited
                      • Address: 44/44 Soi Vibhavadi Rangsit 60, Yaek 18-1-2, Talad Bang Khen Subdistrict, Lak Si District, Bangkok 10210
                      • Phone: (+66) 0-2401-8222
                      • General Email: privacy@company.com
                      • Data Protection Officer (DPO): dpo@company.com

                      2. Personal Data We Collect
                      We may collect the following types of personal data through your interactions with our E-commerce Website:

                      2.1 Data You Provide Directly:
                      This includes data you voluntarily provide through interactions such as registration, ordering, or contacting us:
                      • Identification Data: e.g., title, full name, date of birth, nationality, ID card number or other identifiers for verification purposes
                      • Contact Information: e.g., email, phone numbers, delivery and billing addresses
                      • Account Information: username, encrypted password, security questions, and settings
                      • Transaction Information: order details, purchase history, encrypted payment data (we do not store full card numbers), payment status, refund information
                      • Communication Data: messages, chat, email, contact forms, reviews, surveys, and social media interactions
                      • Marketing Preferences: newsletter subscriptions, promotion participation, and stated communication preferences

                      2.2 Automatically Collected Data:
                      Collected when you visit or interact with our site to enhance your user experience:
                      • Technical Data: IP address, browser type/version, device info, OS, timezone settings, browser plugins
                      • Usage Data: visited pages, time spent, click data, mouse movement, search terms, viewed/added products
                      • Location Data: general location (city, country) derived from your IP for localized content
                      • Cookies & Tracking Data: cookies, web beacons, and other tools to recognize and track you—see our Cookie Policy for details

                      2.3 Third-Party Data:
                      We may receive your data from third parties to provide or improve our services:
                      • Social Media Platforms: e.g., Google, Facebook—when you link or log in via these services
                      • Payment Processors & Financial Institutions: for payment confirmation and fraud prevention
                      • Marketing & Analytics Partners: for insights into market behavior and service improvements
                      • Public Databases & Government Entities: for identity verification or legal compliance

                      3. Legal Bases for Processing
                      We process your personal data under legal grounds defined by the PDPA:
                      • Consent: For specified purposes, such as newsletters or non-essential cookies
                      • Contract: To fulfill contracts with you (e.g., processing orders, shipping)
                      • Legal Obligation: To comply with laws or official requirements (e.g., tax records, AML laws)
                      • Vital Interests: To protect someone's life or health in emergencies
                      • Public Task: For tasks in the public interest or official authority
                      • Legitimate Interests: For our legitimate business purposes, balanced against your rights

                      4. How We Use Your Personal Data

                      4.1 Service Delivery:
                      • Account creation and management
                      • Processing orders and payments
                      • Customer support
                      • Product/service delivery
                      • Secure transactions and refunds

                      4.2 Business Operations:
                      • Website and service improvements
                      • Research and analytics
                      • Business partner communications
                      • Inventory and supply chain planning
                      • Fraud prevention and risk management

                      4.3 Marketing & Communications:
                      • Sending promotional content (with consent)
                      • Personalized product recommendations
                      • Customer satisfaction research
                      • Loyalty programs and member benefits
                      • Order and security notifications

                      4.4 Legal Compliance:
                      • Legal reporting and tax obligations
                      • Responding to legal processes or authorities
                      • Enforcing rights or contracts
                      • Preventing illegal activities
                      • Data retention under statutory requirements

                      5. Sharing and Disclosure of Data

                      5.1 Service Providers:
                      We use third-party providers for:
                      • IT and infrastructure services
                      • Payment processing
                      • Logistics and shipping
                      • Marketing and analytics
                      • Legal, accounting, and audit services

                      5.2 Business Partners:
                      We may share data for joint purposes or integrated service offerings with:
                      • Joint venture partners
                      • Affiliates and subsidiaries
                      • Authorized resellers or distributors
                      • Strategic business collaborators

                      5.3 Legal Obligations:
                      We may disclose data to:
                      • Government authorities and regulators
                      • Law enforcement agencies
                      • Courts and legal professionals
                      • Any entity as required by law

                      5.4 Business Transfers:
                      In case of mergers, acquisitions, or restructurings, personal data may be transferred to acquiring entities. We will notify you of such changes.

                      6. International Data Transfers
                      Where data must be transferred outside Thailand, we ensure protection by:
                      • Standard Contractual Clauses (SCCs) approved by PDPC
                      • Adequacy Decisions for countries with recognized data protections
                      • Binding Corporate Rules (BCRs) for internal data transfers
                      • Explicit Consent, where applicable
                      • Other safeguards such as encryption or pseudonymization

                      7. Data Retention
                      We retain your data only as long as needed:
                      • Account Data: for the duration of account activity + 1 year post-deletion
                      • Transaction Records: 5 years for tax and accounting purposes
                      • Marketing Data: as long as consent is given
                      • Legal Compliance: per applicable laws (e.g., AML, tax)
                      • Cookies/Technical Data: per our Cookie Policy

                      8. Your Rights under the PDPA
                      You have the following rights:
                      • Access: View or request a copy of your personal data
                      • Data Portability: Receive and transfer your data in a readable format
                      • Objection: Object to processing for legitimate interest or direct marketing
                      • Rectification: Request corrections to inaccurate/incomplete data
                      • Erasure: Request deletion in certain situations (e.g., withdrawal of consent)
                      • Restriction: Limit data use under specific conditions
                      • Withdrawal of Consent: Revoke prior consent at any time (without retroactive effect)
                      • Exercising Rights: Contact us via privacy@company.com. Requests will be addressed within 30 days with identity verification.

                      9. Data Security
                      We apply appropriate technical and organizational measures:
                      • Encryption: SSL/TLS and encryption at rest
                      • Access Control: Role-based and multi-factor authentication
                      • Security Assessments: Regular vulnerability testing
                      • Employee Training: On data protection and security awareness
                      • Incident Response: Plans for breaches
                      • Backup & Recovery: Regular data backups and disaster recovery plans

                      10. Sensitive Personal Data
                      We do not generally collect sensitive data unless:
                      • Necessary for specific services (e.g., health-related product advice)
                      • Required by law
                      • With your explicit consent Additional safeguards will be used where such data is collected.

                      11. Children's Privacy
                      Our services are not directed to children under 13. We do not knowingly collect data from minors. If you believe your child has submitted data without consent, contact dpo@company.com for prompt deletion.

                      12. Cookies and Tracking Technologies
                      We use cookies and similar tools for:
                      • Essential site functionality
                      • Performance analytics
                      • Functional enhancements (e.g., language settings)
                      • Marketing and personalized advertising You can manage preferences via your browser or refer to our Cookie Policy.

                      13. Data Breach Notification
                      If a breach poses a high risk to your rights:
                      • We will notify you promptly, including breach nature and recommended actions
                      • We will report to the PDPC within 72 hours as required by law
                      • A clear response plan is in place to mitigate damage

                      14. Policy Updates
                      We may revise this Policy periodically. If changes significantly affect your rights, we will notify you via:
                      • Website announcements
                      • Email (if provided)
                      • Other appropriate means We encourage regular reviews of this policy.

                      15. Contact Information
                      For questions or rights requests, contact our DPO:
                      • Email: dpo@company.com
                      • Phone: (+66) 0-2401-8222
                      • Address: 44/44 Soi Vibhavadi Rangsit 60, Yaek 18-1-2, Talad Bang Khen, Lak Si, Bangkok 10210
                      • Business Hours: Mon–Fri, 09:00–17:00 (Thailand Time)

                      16. Complaints to the Regulator
                      If you believe your concerns have not been resolved, you may contact the PDPC:
                      • Website: https://www.pdpc.or.th
                      • Email: info@pdpc.or.th
                      • Address: Please refer to PDPC's official website for the latest address

                      17. Governing Law
                      This Privacy Policy is governed by the laws of Thailand, including the Personal Data Protection Act B.E. 2562 and other relevant regulations, as may be amended from time to time.`}
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
                  How to Contact Us to Exercise Your Rights
                </h3>
                
                <p style={{
                  marginBottom: '1.5rem',
                  lineHeight: '1.6',
                  color: '#6b7280',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  You are entitled to exercise your rights under the Personal Data Protection Act (PDPA) through the following means:
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
                      <strong style={{ color: '#3b82f6' }}>📧 Email:</strong> privacy@company.com
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
                      <strong style={{ color: '#3b82f6' }}>📞 Phone:</strong> (+66) 0-2401-8222
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
                    <strong style={{ color: '#3b82f6' }}>📍 Address:</strong> 44/44 Soi Vibhavadi Rangsit 60 Yaek 18-1-2, Talat Bang Khen Subdistrict, Lak Si District, Bangkok 10210
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
                    We will respond to your request within 30 business days from the date we receive a complete request and successfully verify your identity.
                  </p>
                  <p style={{
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    marginBottom: '0',
                    color: '#1f2937',
                    lineHeight: '1.5'
                  }}>
                    If you have any further questions about our Privacy Policy or wish to exercise your rights, please do not hesitate to contact our Data Protection Officer. We are always happy to assist you.
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