"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownComponent from "../common/Countdown";
import { useTranslation } from "react-i18next";
import { useContextElement } from "@/context/Context";
import NoImage from "../../public/images/NoImage.jpg";

const ProductCardWishlist = ({ product, onWishlistUpdated, isWishlist }) => {
  const { t, i18n } = useTranslation();

  // Get product name based on current language
  const getProductName = useMemo(() => {
    if (!product) return "Untitled Product";

    const currentLang = i18n.language;

    // For products from API with product_name field
    if (product.product_name) {
      // If current language is Thai, try to find Thai name
      // If English or not found, use the other available name
      return product.product_name;
    }

    // Fallback for other product formats
    return product.title || product.name || "Untitled Product";
  }, [product, i18n.language]);

  const [currentImage, setCurrentImage] = useState(
    product?.image || product?.imgSrc || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || null
  );
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [productId, setProductId] = useState(null);
  const cardRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const forceHideRef = useRef(false);

  // ใช้ Context functions และ data
  const {
    cartProducts,
    wishList,
    user,
    addProductToCart,
    removeFromCart,
    toggleWishlist,
  } = useContextElement();

  // --- ใช้ productId ในการเช็คแทน product.id ---
  const isAddedToCart = cartProducts.some(
    (item) => item.product_id === productId
  );

  const isInWishlist = wishList.some((item) => item.product_id === productId);

  // sync image
  useEffect(() => {
    if (product?.image || product?.imgSrc) {
      setCurrentImage(product.image || product.imgSrc);
    }
  }, [product]);

  useEffect(() => {
    if (isWishlist) {
      setProductId(product.product_id);
    } else {
      setProductId(product.id || product.product_id);
    }
  }, [product, isWishlist]);

  // Hover handling
  const handleCardMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    forceHideRef.current = false;
    setShowButtons(true);
  };

  const handleCardMouseLeave = (e) => {
    const relatedTarget = e.relatedTarget;
    const currentTarget = e.currentTarget;
    if (
      relatedTarget instanceof Node &&
      currentTarget instanceof Node &&
      currentTarget.contains(relatedTarget)
    ) {
      return;
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (!forceHideRef.current) {
        setShowButtons(false);
        setCurrentImage(
          selectedColor?.image || product.imgSrc || product.image || NoImage
        );
      }
    }, 300);
  };

  // Wishlist Action - ใช้ Context function
  const handleWishlistAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("Please login first");
    if (!productId) return;

    if (isWishlistLoading) return;
    setIsWishlistLoading(true);

    try {
      // ใช้ toggleWishlist จาก Context
      await toggleWishlist({ id: productId });

      // เรียก callback หลังจากเสร็จ
      if (onWishlistUpdated) {
        onWishlistUpdated();
      }
    } catch (err) {
      console.error("Wishlist action error:", err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Cart Action - ใช้ Context functions
  const handleCartAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("Please login first");
    if (!productId) return;

    if (isCartLoading) return;
    setIsCartLoading(true);

    try {
      if (isAddedToCart) {
        // ลบออกจากตะกร้า - หา cart item แล้วลบ
        const cartItem = cartProducts.find(
          (item) => item.product_id === productId
        );
        if (cartItem) {
          await removeFromCart(cartItem.id);
        }
      } else {
        // เพิ่มเข้าตะกร้า
        await addProductToCart({ id: productId }, 1);
      }

      // เรียก callback หลังจากเสร็จ
      if (onWishlistUpdated) {
        onWishlistUpdated();
      }
    } catch (err) {
      console.error("Cart action error:", err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsCartLoading(false);
    }
  };

  const discountPercentage =
    product.originalPrice && product.price !== product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  const isOutOfStock =
    product.stock_quantity !== undefined && product.stock_quantity === 0;

  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap");

        .card-product {
          width: 100%;
          height: 350px;
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .card-product:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .card-product-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
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
          opacity: 1;
          transform: scale(1);
          transition: transform 0.7s ease;
        }

        /* เพิ่ม hover effect สำหรับการขยายภาพ */
        .card-product:hover .img-product {
          transform: scale(1.08);
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
          color: #0099ff;
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
          color: #0099ff;
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

        /* Action Buttons Section */
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 0.5rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(5px);
          transition: all 0.3s ease;
          flex-shrink: 0;
          pointer-events: none;
        }

        .action-buttons.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
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
        }

        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Cart Button States */
        .btn-cart {
          background: linear-gradient(135deg, #0099ff);
          color: white;
          border-color: transparent;
        }

        .btn-cart:hover:not(:disabled) {
          background: linear-gradient(135deg, #0066ff);
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

        /* Wishlist Button States */
        .btn-wishlist {
          color: #64748b;
          border-color: #e2e8f0;
          background: white;
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
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-wishlist.loading {
          background: #f1f5f9;
          cursor: wait;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 6px;
        }

        .loading-spinner.dark {
          border: 2px solid rgba(100, 116, 139, 0.3);
          border-top: 2px solid #64748b;
        }

        .loading-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
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

      <div
        ref={cardRef}
        className="card-product fl-item"
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
      >
        <div className="card-product-wrapper">
          <Link href={`/product-detail/${productId}`} className="product-img">
            <Image
              src={currentImage || NoImage}
              alt={getProductName}
              width={400}
              height={400}
              style={{ objectFit: "contain" }}
              loading="lazy"
            />
          </Link>

          {product.stock_quantity !== undefined && (
            <div
              className={`product-status ${
                product.stock_quantity > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              {product.stock_quantity > 0
                ? t("product.instock")
                : t("product.outofstock")}
            </div>
          )}

          {product.countdown && (
            <div className="countdown-box">
              <CountdownComponent labels={product.countdown?.labels} />
            </div>
          )}
        </div>

        <div className="card-product-info">
          <Link href={`/product-detail/${productId}`} className="title">
            {getProductName}
          </Link>

          <div className="price-section">
            <span className="current-price">
              ฿{" "}
              {Number(product.price || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <>
                  <span className="original-price">
                    ฿ {Number(product.originalPrice).toFixed(2)}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="discount-badge">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </>
              )}
          </div>

          {user && (
            <div
              className={`action-buttons ${
                showButtons && !forceHideRef.current ? "show" : ""
              }`}
            >
              {/* ปุ่ม Add to Cart */}
              <button
                type="button"
                onClick={handleCartAction}
                className={`action-btn btn-cart ${
                  isCartLoading ? "loading" : ""
                } ${isAddedToCart ? "in-cart" : ""}`}
                disabled={isOutOfStock || isCartLoading}
                title={
                  isOutOfStock
                    ? t("product.outofstock")
                    : isAddedToCart
                    ? t("product.clicktoremove")
                    : t("product.clicktoadd")
                }
              >
                {isCartLoading ? (
                  <div className="loading-text">
                    <div className="loading-spinner"></div>
                    {isAddedToCart ? "Removing..." : "Adding..."}
                  </div>
                ) : isOutOfStock ? (
                  t("product.outofstock")
                ) : isAddedToCart ? (
                  t("product.removecart")
                ) : (
                  t("product.add")
                )}
              </button>

              {/* ปุ่ม Wishlist */}
              <button
                type="button"
                onClick={handleWishlistAction}
                className={`action-btn btn-wishlist ${
                  isWishlistLoading ? "loading" : ""
                } ${isInWishlist ? "in-wishlist" : ""}`}
                disabled={isWishlistLoading}
                title={
                  isInWishlist
                    ? t("product.clicktoremovesave")
                    : t("product.clicktosave")
                }
              >
                {isWishlistLoading ? (
                  <div className="loading-text">
                    <div className="loading-spinner dark"></div>
                    {isInWishlist ? "Removing..." : "Saving..."}
                  </div>
                ) : isInWishlist ? (
                  t("product.remove")
                ) : (
                  t("product.save")
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCardWishlist;
