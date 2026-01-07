"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";

const ProductCardWishlist = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(product?.imgSrc || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const cardRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const forceHideRef = useRef(false);

  const {
    addProductToCart,
    isAddedToCartProducts,
    removeFromCart,
    isAddedtoWishlist,
    toggleWishlist,
    cartProducts,
  } = useContextElement();

  // Early return if product is not available
  if (!product) {
    return <div>Product not found</div>;
  }

  useEffect(() => {
    if (product?.imgSrc) {
      setCurrentImage(product.imgSrc);
    }
  }, [product]);

  // Toast notification effect
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Improved mouse events handling with debugging
  const handleCardMouseEnter = () => {
    console.log('Card mouse enter - Product ID:', product?.id); // Debug log
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    forceHideRef.current = false;
    setShowButtons(true);
  };

  const handleCardMouseLeave = (e) => {
    console.log('Card mouse leave - Product ID:', product?.id); // Debug log
    
    // Simplified mouse leave detection - just use relatedTarget
    const relatedTarget = e.relatedTarget;
    const currentTarget = e.currentTarget;

    // If mouse moved to a child element, don't hide
    if (relatedTarget && currentTarget && currentTarget.contains(relatedTarget)) {
      console.log('Mouse moved to child element, not hiding');
      return;
    }

    // Add delay to prevent flickering when moving between buttons
    hoverTimeoutRef.current = setTimeout(() => {
      if (!forceHideRef.current) {
        console.log('Hiding buttons after delay');
        setShowButtons(false);

        if (selectedColor?.imgSrc) {
          setCurrentImage(selectedColor.imgSrc);
        } else {
          setCurrentImage(product.imgSrc);
        }
      }
    }, 300); // Increased delay for better stability
  };

  // Force hide buttons when clicking outside - Simplified
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        console.log('Click outside card detected');
        forceHideRef.current = true;
        setShowButtons(false);
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        forceHideRef.current = true;
        setShowButtons(false);
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      }
    };

    // Only essential event listeners
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleColorSelect = (color) => {
    if (color?.imgSrc) {
      setCurrentImage(color.imgSrc);
      setSelectedColor(color);
    }
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleColorHover = (color) => {
    if (color?.imgSrc) {
      setCurrentImage(color.imgSrc);
    }
  };

  const handleColorLeave = () => {
    if (selectedColor?.imgSrc) {
      setCurrentImage(selectedColor.imgSrc);
    } else {
      setCurrentImage(product.imgSrc);
    }
  };

  const handleCartAction = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const isInCart = safeIsAddedToCart();
      
      if (isInCart) {
        // Remove from cart
        if (typeof removeFromCart === 'function') {
          removeFromCart(product.id);
          showSuccessToast(`Removed "${product.title || 'Product'}" from cart`);
        }
      } else {
        // Add to cart
        if (product?.id) {
          const productToAdd = {
            id: product.id,
            title: product.title || product.name || product.productName || 'Untitled Product',
            price: Number(product.price || product.cost || 0),
            imgSrc: product.imgSrc || product.image || product.img || '/placeholder-image.jpg',
            quantity: 1,
            stock_quantity: product.stock_quantity,
            originalPrice: product.originalPrice,
            colors: product.colors,
            sizes: product.sizes,
            ...product,
          };

          if (typeof addProductToCart === 'function') {
            addProductToCart(productToAdd);
            showSuccessToast(`Added "${product.title || 'Product'}" to cart`);
          }
        }
      }
    } catch (error) {
      console.error('Error handling cart action:', error);
      showSuccessToast('An error occurred. Please try again.');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Fixed wishlist handler with better error handling and debugging
  const handleWishlistAction = (e) => {
    console.log('Wishlist button clicked - Product ID:', product?.id); // Debug log
    e.preventDefault();
    e.stopPropagation();

    if (isWishlistLoading) {
      console.log('Wishlist action blocked - already loading'); // Debug log
      return;
    }

    if (!product?.id) {
      console.error('No product ID available'); // Debug log
      showSuccessToast('Product ID not found. Please try again.');
      return;
    }

    setIsWishlistLoading(true);

    try {
      if (typeof toggleWishlist === 'function') {
        const isCurrentlyInWishlist = safeIsAddedToWishlist();
        console.log('Current wishlist status:', isCurrentlyInWishlist); // Debug log
        
        // Call toggleWishlist with product
        toggleWishlist(product);
        
        // Show appropriate message
        if (isCurrentlyInWishlist) {
          showSuccessToast(`Removed "${product.title || 'Product'}" from wishlist`);
        } else {
          showSuccessToast(`Added "${product.title || 'Product'}" to wishlist`);
        }
      } else {
        console.error('toggleWishlist function not available');
        showSuccessToast('Wishlist function not available. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showSuccessToast('An error occurred. Please try again.');
    } finally {
      setTimeout(() => {
        setIsWishlistLoading(false);
      }, 300);
    }
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (product.originalPrice && product.price !== product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const discountPercentage = getDiscountPercentage();

  // Safe function calls with better error handling
  const safeIsAddedToCart = () => {
    try {
      if (typeof isAddedToCartProducts === 'function' && product?.id) {
        return isAddedToCartProducts(product.id);
      }
      if (Array.isArray(cartProducts) && product?.id) {
        return cartProducts.some(item => item.id === product.id);
      }
      return false;
    } catch (error) {
      console.error('Error checking cart status:', error);
      return false;
    }
  };

  const safeIsAddedToWishlist = () => {
    try {
      if (typeof isAddedtoWishlist === 'function' && product?.id) {
        return isAddedtoWishlist(product.id);
      }
      return false;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  };

  const isAddedToCart = safeIsAddedToCart();
  const isInWishlist = safeIsAddedToWishlist();
  const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity === 0;

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');

        .card-product {
          width: 100%;
          height: 350px;
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: visible; /* Changed from hidden to visible */
          position: relative;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          font-family: 'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 1; /* Base z-index */
        }

        .card-product:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
          z-index: 10; /* Higher z-index on hover */
        }

        .card-product-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden; /* Move overflow hidden here instead */
        }

        .product-img {
          position: relative;
          display: block;
          width: 100%;
          height: 200px;
          background: #f8fafc;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .img-product {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          transition: transform 0.3s ease;
          opacity: 1;
        }

        .img-hover {
          position: absolute;
          top: 0;
          left: 0;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-img:hover .img-product {
          opacity: 0;
        }

        .product-img:hover .img-hover {
          opacity: 1;
          transform: scale(1.05);
        }

        .card-product-info {
          display: flex;
          flex-direction: column;
          padding: 1rem;
          gap: 0.75rem;
          flex: 1;
          min-height: 0;
        }

        .title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          text-decoration: none;
          line-height: 1.3;
          height: 2.6em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin: 0;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }

        .title:hover {
          color: #667eea;
        }

        .price-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        .current-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #667eea;
          margin: 0;
        }

        .original-price {
          font-size: 0.9rem;
          color: #94a3b8;
          text-decoration: line-through;
          margin: 0;
        }

        .discount-badge {
          display: inline-block;
          background: #ef4444;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          width: fit-content;
        }

        .list-color-product {
          display: flex;
          gap: 6px;
          list-style: none;
          padding: 0;
          margin: 0;
          flex-shrink: 0;
        }

        .list-color-item {
          position: relative;
          cursor: pointer;
        }

        .swatch-value {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          display: block;
          transition: transform 0.2s ease;
        }

        .list-color-item.active .swatch-value,
        .list-color-item:hover .swatch-value {
          transform: scale(1.2);
          border-color: #667eea;
        }

        .bg_gray { background-color: #94a3b8; }
        .bg_red { background-color: #ef4444; }
        .bg_blue { background-color: #3b82f6; }
        .bg_green { background-color: #10b981; }
        .bg_yellow { background-color: #f59e0b; }
        .bg_purple { background-color: #8b5cf6; }
        .bg_pink { background-color: #ec4899; }
        .bg_black { background-color: #1f2937; }
        .bg_white { background-color: #ffffff; }

        .product-status {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ef4444;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          z-index: 5;
        }

        .product-status.in-stock {
          background: #10b981;
        }

        .product-status.out-of-stock {
          background: #6b7280;
        }

        .countdown-box {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
        }

        .size-list {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          gap: 4px;
        }

        .size-list span {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        /* Action Buttons Section - Stable positioning */
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 0.5rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(5px);
          transition: all 0.2s ease;
          flex-shrink: 0;
          pointer-events: none;
          position: relative;
          z-index: 100;
          background: white; /* Ensure solid background */
          border-radius: 8px;
          padding: 0.5rem;
          margin: -0.5rem -0.5rem 0 -0.5rem; /* Negative margin to extend clickable area */
        }

        .action-buttons.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
          z-index: 101;
        }

        .action-btn {
          flex: 1;
          padding: 0.625rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          background: white;
          color: #64748b;
          position: relative;
          user-select: none;
          z-index: 102;
          touch-action: manipulation;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Add subtle shadow for better visibility */
        }

        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Cart Button States */
        .btn-cart {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .btn-cart:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        .btn-cart.in-cart {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .btn-cart.in-cart:hover:not(:disabled) {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .btn-cart:disabled {
          background: #94a3b8;
        }

        .btn-cart.loading {
          background: #94a3b8;
          cursor: wait;
        }

        /* Wishlist Button States - Improved */
        .btn-wishlist {
          color: #64748b;
          border-color: #e2e8f0;
          background: white;
          position: relative;
        }

        .btn-wishlist.in-wishlist {
          background: #fef2f2;
          border-color: #ef4444;
          color: #ef4444;
        }

        .btn-wishlist:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #ef4444;
          color: #ef4444;
        }

        .btn-wishlist.in-wishlist:hover:not(:disabled) {
          background: #ef4444;
          color: white;
        }

        .btn-wishlist:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-wishlist.loading {
          background: #f1f5f9;
          cursor: wait;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        .loading-spinner.dark {
          border: 2px solid #64748b;
          border-top: 2px solid transparent;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Toast Notification */
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          font-size: 0.875rem;
          z-index: 9999;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          max-width: 350px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .toast-notification.show {
          transform: translateX(0);
        }

        .toast-notification.error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .toast-icon {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .toast-content {
          flex: 1;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1.25rem;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: opacity 0.2s ease;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .toast-close:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .card-product {
            height: 420px;
          }
          
          .product-img {
            height: 180px;
          }
          
          .card-product-info {
            padding: 0.875rem;
          }
          
          .title {
            font-size: 0.9rem;
          }
          
          .current-price {
            font-size: 1.1rem;
          }

          .action-buttons {
            gap: 0.375rem;
          }

          .action-btn {
            padding: 0.5rem;
            font-size: 0.75rem;
            min-height: 36px;
          }

          .toast-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
        }

        @media (max-width: 480px) {
          .card-product {
            height: 400px;
          }
          
          .product-img {
            height: 160px;
          }
          
          .card-product-info {
            padding: 0.75rem;
          }

          .action-buttons {
            flex-direction: column;
            gap: 0.375rem;
          }
          
          .action-btn {
            padding: 0.625rem;
            font-size: 0.8rem;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast-notification ${showToast ? 'show' : ''}`}>
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            {toastMessage}
          </div>
          <button
            className="toast-close"
            onClick={() => setShowToast(false)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <div
        ref={cardRef}
        className="card-product fl-item"
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
      >
        <div className="card-product-wrapper">
          <Link href={`/product-detail/${product.id}`} className="product-img">
            <Image
              className="img-product"
              src={currentImage || '/placeholder-image.jpg'}
              alt={product.title || 'Product'}
              width={400}
              height={400}
              style={{ objectFit: 'contain' }}
              priority={false}
              loading="lazy"
            />
            <Image
              className="img-hover"
              src={product.imgHoverSrc || currentImage || '/placeholder-image.jpg'}
              alt={`${product.title || 'Product'} hover`}
              width={400}
              height={400}
              priority={false}
              loading="lazy"
            />
          </Link>

          {/* Product Status Badge */}
          {product.stock_quantity !== undefined && (
            <div className={`product-status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          )}

          {product.countdown && (
            <div className="countdown-box">
              <div className="js-countdown">
                <CountdownComponent labels={product.countdown?.labels} />
              </div>
            </div>
          )}

          {product.sizes && Array.isArray(product.sizes) && (
            <div className="size-list">
              {product.sizes.map((size, index) => (
                <span key={`${size}-${index}`}>{size}</span>
              ))}
            </div>
          )}
        </div>

        <div className="card-product-info">
          <Link href={`/product-detail/${product.id}`} className="title">
            {product.title || 'Untitled Product'}
          </Link>

          <div className="price-section">
            <span className="current-price">
              ฿ {Number(product.price || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            {product.originalPrice && product.originalPrice !== product.price && (
              <>
                <span className="original-price">฿ {Number(product.originalPrice).toFixed(2)}</span>
                {discountPercentage > 0 && (
                  <span className="discount-badge">
                    {discountPercentage}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          {product.colors && Array.isArray(product.colors) && product.colors.length > 1 && (
            <ul className="list-color-product">
              {product.colors.map((color, index) => (
                <li
                  className={`list-color-item ${selectedColor?.name === color.name ? "active" : ""}`}
                  onClick={() => handleColorSelect(color)}
                  onMouseEnter={() => handleColorHover(color)}
                  onMouseLeave={handleColorLeave}
                  key={`${color.name}-${index}`}
                  title={color.name}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={`swatch-value ${color.colorClass || ''}`} />
                  {color.imgSrc && (
                    <Image
                      className="lazyload"
                      data-src={color.imgSrc}
                      src={color.imgSrc}
                      alt={`${product.title} - ${color.name}`}
                      width={720}
                      height={1005}
                      style={{ display: 'none' }}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Action Buttons - Simplified event handling */}
          <div 
            className={`action-buttons ${showButtons ? 'show' : ''}`}
            onMouseEnter={() => {
              // Keep buttons visible when hovering over them
              console.log('Mouse entered action buttons area');
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              forceHideRef.current = false;
              setShowButtons(true);
            }}
          >
            <button
              type="button"
              onClick={handleCartAction}
              className={`action-btn btn-cart ${isLoading ? 'loading' : ''} ${isAddedToCart ? 'in-cart' : ''}`}
              disabled={isOutOfStock || isLoading}
              title={isOutOfStock ? "Out of Stock" : isAddedToCart ? "Click to remove from cart" : "Click to add to cart"}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  {isAddedToCart ? 'Removing...' : 'Adding...'}
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : isAddedToCart ? (
                "✓ Remove from Cart"
              ) : (
                "Add to Cart"
              )}
            </button>

            <button
              type="button"
              onClick={handleWishlistAction}
              className={`action-btn btn-wishlist ${isWishlistLoading ? 'loading' : ''} ${isInWishlist ? 'in-wishlist' : ''}`}
              disabled={isWishlistLoading}
              title={isInWishlist ? "Click to remove from wishlist" : "Click to add to wishlist"}
            >
              {isWishlistLoading ? (
                <>
                  <div className="loading-spinner dark"></div>
                  {isInWishlist ? 'Removing...' : 'Adding...'}
                </>
              ) : isInWishlist ? (
                "♥ Remove"
              ) : (
                "♡ Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCardWishlist;