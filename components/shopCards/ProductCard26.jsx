"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import CountdownComponent from "../common/Countdown";

export const ProductCard26 = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);
  const {
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    toggleWishlist,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(product.imgSrc);
  }, [product]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addProductToCart(product);
  };

  return (
    <>
      <style jsx>{`
        .card-product {
          width: 100%;
          height: fit-content;
          display: flex;
          flex-direction: column;
          background: transparent;
          border: none;
          border-radius: 0;
          overflow: hidden;
          position: relative;
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
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .list-product-btn {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 0.5rem;
          z-index: 10;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          height: 0;
          overflow: hidden;
        }

        .card-product:hover .list-product-btn {
          opacity: 1;
          transform: translateY(0);
          height: auto;
          margin-top: 0.75rem;
        }

        .box-icon {
          width: 40px;
          height: 40px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: #64748b;
          position: relative;
        }

        .box-icon:hover {
          background: #667eea;
          color: white;
          transform: scale(1.1);
          border-color: #667eea;
        }

        .box-icon:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .box-icon .tooltip {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1000;
        }

        .box-icon .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #1f2937;
        }

        .box-icon:hover .tooltip {
          opacity: 1;
        }

        .icon {
          font-size: 16px;
        }

        .icon.added {
          color: #ef4444;
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

        .card-product-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }

        .btn-quick-add {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.5rem;
        }

        .btn-quick-add:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-quick-add:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .title {
          font-size: 36px;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          line-height: 1.4;
          height: 2.8em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin: 0;
        }

        .title:hover {
          color: #667eea;
        }

        .price {
          font-size: 28px;
          font-weight: 700;
          color: #667eea;
          margin: 0;
        }

        .list-color-product {
          display: flex;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0.25rem 0;
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

        /* Status Badge */
        .product-status {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ef4444;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .product-img {
            height: 180px;
          }
          
          .box-icon {
            width: 36px;
            height: 36px;
          }
          
          .icon {
            font-size: 14px;
          }
          
          .title {
            font-size: 14px;
          }
          
          .price {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .product-img {
            height: 160px;
          }
          
          .btn-quick-add {
            padding: 10px;
            font-size: 12px;
          }
          
          .box-icon {
            width: 32px;
            height: 32px;
          }
          
          .icon {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="card-product style-7">
        <div className="card-product-wrapper">
          <Link href={`/product-detail/${product.id}`} className="product-img">
            <Image
              className="img-product"
              src={currentImage}
              alt={product.title}
              width={400}
              height={400}
              style={{ objectFit: 'contain' }}
              priority={false}
              loading="lazy"
            />
            <Image
              className="img-hover"
              src={product.imgHoverSrc}
              alt={`${product.title} hover`}
              width={400}
              height={400}
              priority={false}
              loading="lazy"
            />
          </Link>

          {/* Product Status Badge */}
          {product.isAvailable !== undefined && (
            <div className={`product-status ${product.isAvailable ? 'in-stock' : 'out-of-stock'}`}>
              {product.isAvailable ? 'have product' : 'out of stock'}
            </div>
          )}

          {product.countdown && (
            <div className="countdown-box">
              <div className="js-countdown">
                <CountdownComponent labels={product.countdown.labels} />
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="size-list">
              {product.sizes.map((size) => (
                <span key={size}>{size}</span>
              ))}
            </div>
          )}
        </div>

        <div className="card-product-info">
          <Link href={`/product-detail/${product.id}`} className="title">
            {product.title}
          </Link>
          
          <span className="price">฿ {product.price.toFixed(2)}</span>

          {product.colors && product.colors.length > 1 && (
            <ul className="list-color-product">
              {product.colors.map((color) => (
                <li
                  className={`list-color-item ${
                    currentImage === color.imgSrc ? "active" : ""
                  }`}
                  onMouseOver={() => setCurrentImage(color.imgSrc)}
                  key={color.name}
                  title={color.name}
                >
                  <span className={`swatch-value ${color.colorClass}`} />
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-quick-add"
            disabled={isAddedToCartProducts(product.id)}
          >
            {isAddedToCartProducts(product.id) ? "already have in cart" : "quick add"}
          </button>

          {/* Action buttons moved to bottom */}
          <div className="list-product-btn">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className="box-icon"
              title={isAddedtoWishlist(product.id) ? "remove from wishlist" : "add to wishlist"}
            >
              <span
                className={`icon icon-heart ${
                  isAddedtoWishlist(product.id) ? "added" : ""
                }`}
              />
              <span className="tooltip">
                {isAddedtoWishlist(product.id)
                  ? "remove from wishlist"
                  : "add to wishlist"}
              </span>
            </button>

            <a
              href="#compare"
              data-bs-toggle="offcanvas"
              aria-controls="offcanvasLeft"
              onClick={(e) => {
                e.preventDefault();
                addToCompareItem(product.id);
              }}
              className="box-icon"
              title={isAddedtoCompareItem(product.id) ? "remove from compare" : "add to compare"}
            >
              <span
                className={`icon icon-compare ${
                  isAddedtoCompareItem(product.id) ? "added" : ""
                }`}
              />
              <span className="tooltip">
                {isAddedtoCompareItem(product.id)
                  ? "remove from compare"
                  : "add to compare"}
              </span>
            </a>
            
            <button
              type="button"
              onClick={handleAddToCart}
              className="box-icon"
              disabled={isAddedToCartProducts(product.id)}
              title={isAddedToCartProducts(product.id) ? "already have in cart" : "add to cart"}
            >
              <span className={`icon ${isAddedToCartProducts(product.id) ? 'icon-check' : 'icon-bag'}`} />
              <span className="tooltip">
                {isAddedToCartProducts(product.id) ? "already have in cart" : "add to cart"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};