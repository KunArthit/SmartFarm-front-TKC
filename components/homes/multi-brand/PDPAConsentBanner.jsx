// components/PDPAConsentBanner.jsx
"use client";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

export default function PDPAConsentBanner() {
  const { t } = useTranslation();

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('cookie.accept')}
      declineButtonText={t('cookie.decline')}
      enableDeclineButton
      cookieName="pdpaConsent"
      style={{ 
        background: "rgba(30, 41, 59, 0.95)", // Semi-transparent dark background
        color: "#f1f5f9",
        fontSize: "14px",
        padding: "20px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)"
      }}
      buttonStyle={{ 
        background: "#16a34a", // Green matching the logo
        color: "#ffffff", 
        fontSize: "14px",
        borderRadius: "6px",
        padding: "10px 20px",
        border: "none",
        fontWeight: "500",
        transition: "all 0.2s ease",
        cursor: "pointer"
      }}
      declineButtonStyle={{ 
        background: "transparent", 
        color: "#e2e8f0", 
        fontSize: "14px",
        borderRadius: "6px",
        padding: "10px 20px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        fontWeight: "500",
        marginRight: "10px",
        transition: "all 0.2s ease",
        cursor: "pointer"
      }}
      buttonWrapperClasses="cookie-buttons"
      containerClasses="cookie-container"
    >
      <style jsx global>{`
        .cookie-buttons button:hover {
          transform: translateY(-1px);
        }
        
        .cookie-container button[style*="background: #16a34a"]:hover {
          background: #15803d !important;
        }
        
        .cookie-container button[style*="background: transparent"]:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }
      `}</style>
      
      {t('cookie.description')}
      <br />
      {t('cookie.description2')}{" "}
      <Link 
        href="/privacy-policy" 
        style={{ 
          color: "#ffff", // Lime green matching the theme
          textDecoration: "underline",
          fontWeight: "500"
        }}
      >
        {t('cookie.description3')}
      </Link>
    </CookieConsent>
  );
}