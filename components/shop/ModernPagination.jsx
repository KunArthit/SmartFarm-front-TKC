"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ModernPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisiblePages = 5 
}) => {
  // Generate page numbers array
  const { t, i18n } = useTranslation();
  const getPageNumbers = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }
    
    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '1rem 0'
    }}>

      {/* Page Info - Moved to top */}
      <div style={{
        fontSize: '14px',
        color: '#64748b',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      }}>
        {t('Page.page')} {currentPage} {t('Page.of')} {totalPages}
      </div>

      {/* Pagination Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '0 12px',
            height: '40px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            background: currentPage === 1 ? '#f8fafc' : 'white',
            color: currentPage === 1 ? '#94a3b8' : '#475569',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = '#0099FF';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = '#0099FF';
              e.currentTarget.style.transform = 'translateY(-1px)';
              // e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <ChevronLeft size={18} />
          <span>{t('blog.previous')}</span>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                color: '#94a3b8',
                fontSize: '14px',
              }}>
                <MoreHorizontal size={18} />
              </div>
            ) : (
              <button
                onClick={() => handlePageClick(page)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  border: page === currentPage ? 'none' : '1px solid #e2e8f0',
                  background: page === currentPage 
                    ? 'linear-gradient(135deg, #0099FF)' 
                    : 'white',
                  color: page === currentPage ? 'white' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: page === currentPage ? '600' : '500',
                  boxShadow: page === currentPage 
                    ? '0 4px 16px rgba(102, 126, 234, 0.3)' 
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (page !== currentPage) {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#0099FF';
                    e.currentTarget.style.color = '#0099FF';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== currentPage) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '0 12px',
            height: '40px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            background: currentPage === totalPages ? '#f8fafc' : 'white',
            color: currentPage === totalPages ? '#94a3b8' : '#475569',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = '#0099FF';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = '#0099FF';
              e.currentTarget.style.transform = 'translateY(-1px)';
              // e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <span>{t('blog.next')}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ModernPagination;