"use client";

import ProductCardWishlist from '@/components/shopCards/ProductCardWishlist';
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useTranslation } from 'react-i18next';


export default function Wishlist() {
  const { t } = useTranslation();
  const { wishList } = useContextElement();

  return (
    <div className="wishlist-container">
      {/* Header Section */}
      <div className="wishlist-header">
        <div className="header-content">
          <div className="icon-wrapper">
            <Heart className="heart-icon" size={32} />
            <Sparkles className="sparkle-1" size={16} />
            <Sparkles className="sparkle-2" size={12} />
          </div>
          <h1 className="page-title">{t('wishlist.MyWishlist')}</h1>
          <p className="page-subtitle">
            {wishList.length > 0 
              ? `${wishList.length} ${t('wishlist.item')}${wishList.length > 1 ? t('wishlist.s') : ''} ${t('wishlist.savedforlater')}`
              : t('wishlist.Save')
            }
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="wishlist-content">
        {wishList.length > 0 ? (
          <>
            <div className="wishlist-grid">
              {wishList.map((elm, i) => (
                <div key={elm.id ?? i} className="product-card-wrapper">
                  <ProductCardWishlist product={elm} isWishlist={true} />
                </div>
              ))}
            </div>
            
            {/* Additional Actions */}
            <div className="wishlist-actions">
              <Link
                href="/tkc-product"
                className="action-btn secondary"
              >
                <ShoppingBag size={18} />
                {t('wishlist.ContinueShopping')}
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration">
              <div className="heart-container">
                <Heart className="empty-heart" size={64} />
                <div className="pulse-ring"></div>
              </div>
            </div>
            
            <div className="empty-content">
              <h2 className="empty-title">{t('wishlist.wishlistiswaiting')}</h2>
              <p className="empty-description">
              {t('wishlist.Start')}
              </p>
              
              <div className="empty-actions">
                <Link
                  href="/tkc-product"
                  className="action-btn primary"
                >
                  <Sparkles size={18} />
                  {t('wishlist.GotoProducts')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .wishlist-container {
          min-height: 60vh;
          padding: 2rem 1rem;
          max-width: 1400px;
          margin: 0 auto;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .wishlist-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.4), transparent);
        }

        .wishlist-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .header-content {
          position: relative;
          z-index: 2;
        }

        .icon-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .heart-icon {
          color: #e11d48;
          filter: drop-shadow(0 4px 20px rgba(225, 29, 72, 0.3));
          animation: heartbeat 2s ease-in-out infinite;
        }

        .sparkle-1, .sparkle-2 {
          position: absolute;
          color: #fbbf24;
          animation: sparkle 3s ease-in-out infinite;
        }

        .sparkle-1 {
          top: -8px;
          right: -8px;
          animation-delay: 0s;
        }

        .sparkle-2 {
          bottom: -4px;
          left: -6px;
          animation-delay: 1.5s;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b, #475569);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .wishlist-content {
          position: relative;
          z-index: 1;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .product-card-wrapper {
          animation: slideInUp 0.6s ease-out;
        }

        .product-card-wrapper:nth-child(even) {
          animation-delay: 0.1s;
        }

        .product-card-wrapper:nth-child(3n) {
          animation-delay: 0.2s;
        }

        .wishlist-actions {
          text-align: center;
          padding: 2rem 0;
          border-top: 1px solid #e2e8f0;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
          gap: 2rem;
        }

        .empty-illustration {
          position: relative;
          margin-bottom: 1rem;
        }

        .heart-container {
          position: relative;
          display: inline-block;
        }

        .empty-heart {
          color: #cbd5e1;
          animation: float 3s ease-in-out infinite;
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          border: 2px solid #e11d48;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
          opacity: 0;
        }

        .empty-content {
          max-width: 400px;
        }

        .empty-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 1rem;
        }

        .empty-description {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .empty-actions {
          display: flex;
          justify-content: center;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .action-btn:hover::before {
          left: 100%;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .action-btn.secondary {
          background: white;
          color: #475569;
          border: 2px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .action-btn.secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0.8) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2) rotate(180deg); 
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        @media (max-width: 768px) {
          .wishlist-container {
            padding: 1.5rem 1rem;
            border-radius: 16px;
          }

          .page-title {
            font-size: 2rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .wishlist-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .empty-title {
            font-size: 1.5rem;
          }

          .empty-description {
            font-size: 1rem;
          }

          .action-btn {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}