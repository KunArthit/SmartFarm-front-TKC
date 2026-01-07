"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // useRouter สำหรับการ redirect
import { colors, paymentImages } from "@/data/singleProductOptions";
import StickyItem from "./StickyItem";
import Quantity from "./Quantity";
import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";
import logo2c2p from "../../public/images/logo/2C2P.svg";

export default function DetailsOuterZoom({ product }) {
  const router = useRouter(); // instance ของ router

  // Use the provided product or fall back to the default product
  const productData = product;
  console.log("Product Data:123", productData);

  console.log("Product Data for Slider:", productData);

  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [userData, setUserData] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const resUser = JSON.parse(localStorage.getItem("user_data"));
      console.log(resUser);

      setUserData(resUser);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleColor = (color) => {
    const updatedColor = colors.find(
      (elm) => elm.value.toLowerCase() === color.toLowerCase()
    );
    if (updatedColor) setCurrentColor(updatedColor);
  };

  const {
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    removeFromWishlist,
    toggleWishlist,
  } = useContextElement();

  const handleAddToCart = () => {
    if (productData.stock_quantity > 0) {
      // ส่ง quantity เป็น parameter ที่สอง
      addProductToCart(productData, quantity);
    }
  };

  // สร้างฟังก์ชันสำหรับปุ่ม "Buy with"
  const handleBuyNow = () => {
    if (productData.stock_quantity > 0) {
      // เพิ่มสินค้าลงตะกร้า
      handleAddToCart();

      // หน่วงเวลาเล็กน้อยแล้ว redirect ไปหน้า checkout พร้อมส่ง status
      setTimeout(() => {
        // ส่งแค่ 2c2p_status=true ไปกับ URL
        router.push("/checkout?2c2p_status=true");
      }, 100);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlistLoading) return;

    console.log("Wishlist button clicked");
    console.log("Product ID:", productData?.id);
    console.log("Current wishlist status:", safeIsAddedToWishlist());

    setIsWishlistLoading(true);

    try {
      // ถ้ามี toggleWishlist function ให้ใช้แทน
      if (typeof toggleWishlist === "function" && productData?.id) {
        toggleWishlist(productData);
      } else {
        if (safeIsAddedToWishlist()) {
          if (typeof removeFromWishlist === "function") {
            removeFromWishlist(productData.id);
          }
        } else {
          if (typeof addToWishlist === "function") {
            addToWishlist(productData);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setTimeout(() => {
        setIsWishlistLoading(false);
      }, 300);
    }
  };

  // Safe function สำหรับตรวจสอบ wishlist status
  const safeIsAddedToWishlist = () => {
    try {
      if (typeof isAddedtoWishlist === "function" && productData?.id) {
        return isAddedtoWishlist(productData.id);
      }
      return false;
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      return false;
    }
  };

  const isInWishlist = safeIsAddedToWishlist();

  return (
    <>
      <style jsx>{`
        .wishlist-button {
          position: relative;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          transition: all 0.2s ease;
          outline: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          min-height: 48px;
        }

        .wishlist-button:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #ef4444;
          color: #ef4444;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .wishlist-button.in-wishlist {
          background: #fef2f2;
          border-color: #ef4444;
          color: #ef4444;
        }

        .wishlist-button.in-wishlist:hover:not(:disabled) {
          background: #ef4444;
          color: white;
        }

        .wishlist-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .wishlist-button.loading {
          background: #f1f5f9;
          cursor: wait;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #64748b;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .icon-heart {
          transition: all 0.2s ease;
        }

        .icon-heart.added {
          color: #ef4444;
          transform: scale(1.1);
        }

        .tooltip {
          position: absolute;
          top: -35px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1000;
          pointer-events: none;
        }

        .wishlist-button:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }

        .tf-product-btn-wishlist {
          position: relative;
          z-index: 10;
        }
      `}</style>

      <section
        className="flat-spacing-4 pt_0"
        style={{ maxWidth: "100vw", overflow: "clip" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <div className="thumbs-slider">
                  <Slider1ZoomOuter
                    handleColor={handleColor}
                    currentColor={currentColor.value}
                    product={productData}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-title">
                    <h5>{productData.title || "Unnamed Product"}</h5>
                    {productData.short_description && (
                      <p className="text-muted mb-3">
                        {productData.short_description}
                      </p>
                    )}
                  </div>

                  <div className="tf-product-info-badges">
                    {productData.filterCategories?.map((cat, index) => (
                      <div className="badges" key={index}>
                        {cat}
                      </div>
                    ))}
                  </div>

                  <div className="tf-product-info-price">
                    <div className="price-on-sale">
                      ฿ {productData.price.toLocaleString("en-US")}
                    </div>
                  </div>

                  {/* SKU and Stock Information */}
                  <div className="tf-product-info-meta">
                    {productData.sku && (
                      <div className="meta-item">
                        <span className="meta-label">SKU:</span>
                        <span className="meta-value">{productData.sku}</span>
                      </div>
                    )}
                    {productData.stock_quantity !== undefined && (
                      <div className="meta-item">
                        <span className="meta-label">
                          {t("productdetail.InStock")}:
                        </span>
                        <span
                          className={`meta-value ${
                            productData.stock_quantity > 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {productData.stock_quantity > 0
                            ? ` ${productData.stock_quantity} ${t(
                                "productdetail.unitsavailable"
                              )}`
                            : t("productdetail.OutOfStock")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Description */}
                  {productData.description && (
                    <div className="tf-product-info-description">
                      <h6>{t("productdetail.Description")}</h6>
                      <p>{productData.description}</p>
                    </div>
                  )}

                  <div className="tf-product-info-variant-picker">
                    <div className="variant-picker-item">
                      {/* Size/variant options can be added here if needed */}
                    </div>
                  </div>

                  {userData && (
                    <div className="tf-product-info-quantity">
                      <div className="quantity-title fw-6">
                        {t("productdetail.Quantity")}
                      </div>
                      <Quantity
                        setQuantity={setQuantity}
                        maxQuantity={productData.stock_quantity || 999}
                      />
                    </div>
                  )}

                  {userData && (
                    <div className="tf-product-info-buy-button">
                      <form onSubmit={(e) => e.preventDefault()} className="">
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          disabled={productData.stock_quantity === 0}
                          className={`tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn ${
                            productData.stock_quantity === 0 ? "disabled" : ""
                          }`}
                          style={{
                            opacity: productData.stock_quantity === 0 ? 0.5 : 1,
                            cursor:
                              productData.stock_quantity === 0
                                ? "not-allowed"
                                : "pointer",
                            border: "none",
                            outline: "none",
                          }}
                        >
                          <span>
                            {productData.stock_quantity === 0
                              ? t("productdetail.OutOfStock")
                              : isAddedToCartProducts(productData.id)
                              ? t("productdetail.AlreadyAdded")
                              : t("productdetail.AddToCart")}{" "}
                          </span>
                          <span className="tf-qty-price ms-1">
                            ฿{" "}
                            {(productData.price * quantity).toLocaleString(
                              "en-US"
                            )}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleWishlistToggle}
                          disabled={isWishlistLoading || !productData?.id}
                          className={`tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action wishlist-button ${
                            isInWishlist ? "in-wishlist" : ""
                          } ${isWishlistLoading ? "loading" : ""}`}
                          style={{
                            border: "1px solid #e2e8f0",
                            outline: "none",
                            position: "relative",
                            zIndex: 10,
                          }}
                        >
                          {isWishlistLoading ? (
                            <div className="loading-spinner" />
                          ) : (
                            <>
                              <span
                                className={`icon icon-heart ${
                                  isInWishlist ? "added" : ""
                                }`}
                              />
                              <span className="tooltip">
                                {isInWishlist
                                  ? t("productdetail.RemoveFromWishlist")
                                  : t("productdetail.AddToWishlist")}
                              </span>
                              <span className="icon icon-delete" />
                            </>
                          )}
                        </button>

                        <div className="w-100">
                          <button
                            type="button"
                            onClick={handleBuyNow}
                            disabled={productData.stock_quantity === 0}
                            className="btns-full"
                            style={{
                              cursor:
                                productData.stock_quantity === 0
                                  ? "not-allowed"
                                  : "pointer",
                              border: "none",
                            }}
                          >
                            {t("productdetail.Buywith")}{" "}
                            <Image
                              alt="image"
                              src={logo2c2p}
                              width={64}
                              height={18}
                            />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Delivery Information Section */}
                  <div className="tf-product-info-delivery">
                    <div className="delivery-method-item">
                      <div className="icon-delivery">
                        <i className="icon-location" />
                      </div>
                      <div className="delivery-detail">
                        <div className="fw-6 delivery-location">
                          {t("productdetail.Delivery")}{" "}
                          <span className="location">
                            {t("productdetail.Everywhere")}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="delivery-method-item">
                      <div className="icon-delivery">
                        <i className="icon-store" />
                      </div>
                      <div className="delivery-detail"></div>
                    </div>
                  </div>

                  {/* Trust Badges Section */}
                  <div className="tf-product-info-trust-badges">
                    <h6>{t("productdetail.GuaranteedSafeCheckout")}</h6>
                    <div
                      className="payment-methods"
                      style={{ display: "flex", gap: 10 }}
                    >
                      {paymentImages.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            id={index}
                            src={item.src}
                            alt={item.alt || "payment-method"}
                            width={item.width}
                            height={item.height}
                            style={{ objectFit: "contain", height: "100%" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StickyItem product={productData} />
      </section>
    </>
  );
}
