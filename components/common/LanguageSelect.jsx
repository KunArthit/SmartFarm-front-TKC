"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from '@/context/LanguageProvider';
import LogoTH from '../../public/images/country/th.svg';
import LogoEN from '../../public/images/country/us.svg';

const languageOptions = [
  { id: "th", label: "TH", flag: LogoTH },
  { id: "en", label: "EN", flag: LogoEN },
];

export default function LanguageSelect() {
  const { currentLanguageId, changeLanguage } = useLanguage();
  const currentLang = languageOptions.find(lang => lang.id === currentLanguageId) || languageOptions[0];

  const toggleLanguage = () => {
    const nextLang = currentLanguageId === 'th' ? 'en' : 'th';
    changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-toggle-btn d-flex align-items-center gap-2"
      style={{
        background: 'none',
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        transition: 'all 0.2s ease',
        minWidth: '60px',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = '#999';
        e.target.style.backgroundColor = '#f8f9fa';
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = '#ddd';
        e.target.style.backgroundColor = 'transparent';
      }}
    >
      <Image
        src={currentLang.flag}
        alt={currentLang.label}
        width={20}
        height={15}
        style={{
          borderRadius: '2px',
          objectFit: 'cover'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      <span>{currentLang.label}</span>
    </button>
  );
}