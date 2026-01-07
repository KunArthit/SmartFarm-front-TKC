"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import Logo from '../../public/images/logo/FarmSuk-TM.png';


export default function Footer1({ bgColor = "" }) {
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-moblie");

    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");

      parent.classList.toggle("open");
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []); // Empty dependency array means this will run only once on mount

  const { t } = useTranslation();

  const iconStyle = {
    width: '16px',
    height: '16px',
    fill: 'currentColor'
  };

  const socialButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease'
  };

  const headingStyle = {
    color: '#0099FF',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px'
  };

  const linkStyle = {
    color: '',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    transition: 'color 0.3s ease'
  };

  return (
    <footer id="footer" className={`footer md-pb-70 ${bgColor}`}>
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <div className="footer-logo">
                    <Link href={`/`}>
                      <Image
                        alt="image"
                        src={Logo}
                        width={143}
                        height={21}
                      />
                    </Link>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                    <svg style={{ ...iconStyle, color: '#0099FF', marginTop: '4px', flexShrink: 0 }} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p style={{ margin: 0, lineHeight: '1.5' }}>
                      {t("footer.address1")}<br />
                      {t("footer.address2")}<br />
                      {t("footer.address3")}
                    </p>
                  </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <svg style={{ ...iconStyle, color: '#0099FF' }} viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <p style={{ margin: 0 }}>
                    {t("footer.email")}: <a href="mailto:tkc@tsi.com" style={{ color: '#0099FF', textDecoration: 'none' }}>tkc@tsi.com</a>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg style={{ ...iconStyle, color: '#0099FF' }} viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <p style={{ margin: 0 }}>
                    {t("footer.phone")}: <a href="tel:+66024018222" style={{ color: '#0099FF', textDecoration: 'none' }}>(66) 024018222</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
              <div className="footer-heading footer-heading-desktop">
              <h6 style={headingStyle}>{t("footer.myaccount")}</h6>
              </div>
                <ul className="footer-menu-list tf-collapse-content">
                <li>
                    <Link href="/wishlist" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {t("footer.mywishlist")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-account-orders" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 15a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      {t("footer.orderhistory")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-account" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      {t("footer.dashboard")}
                    </Link>
                  </li>
                </ul>

                {/* Social Media */}
                <div style={{ marginTop: '24px' }}>
                  <h6 style={{ ...headingStyle, marginBottom: '16px' }}>{t("footer.followus")}</h6>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a
                      href="https://www.facebook.com/TurnkeyCommunicationServices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ ...socialButtonStyle, backgroundColor: '#1877f2' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#166fe5'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#1877f2'}
                    >
                      <svg style={{ ...iconStyle, color: 'white' }} viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* About Us Section */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
              <div className="footer-heading footer-heading-desktop">
                  <h6 style={headingStyle}>{t("footer.about")}</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                <li>
                    <Link href="/store-locations" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.828 14.828a4 4 0 01-5.656 0L7.757 13.414a2 2 0 010-2.828L10.586 7.757a4 4 0 015.656 0l1.414 1.414a2 2 0 010 2.828l-2.828 2.829zm-8.485 0L4.929 13.414a2 2 0 010-2.828L7.757 7.757a2 2 0 012.828 0l1.414 1.414a4 4 0 010 5.656l-1.414 1.414a2 2 0 01-2.828 0z" clipRule="evenodd" />
                      </svg>
                      {t("footer.contact")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {t("footer.about")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      {t("footer.privacy")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Quick Links Section */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
              <div className="footer-heading footer-heading-desktop">
                  <h6 style={headingStyle}>{t("footer.quick")}</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                <li>
                    <Link href="/tkc-product" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 15a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      {t("footer.products")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/all-solution" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t("footer.solutions")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-sidebar-right" style={linkStyle}
                      onMouseOver={(e) => e.target.style.color = '#0099FF'}
                      onMouseOut={(e) => e.target.style.color = ''}>
                      <svg style={iconStyle} viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                      </svg>
                      {t("footer.blog")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-between align-items-center">
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                {t("footer.copyright")}   
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}