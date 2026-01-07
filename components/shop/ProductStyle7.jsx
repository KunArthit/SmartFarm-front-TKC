"use client";
import { useState, useEffect, useMemo } from "react";
import ShopFilter from "./ShopFilter";
import Sorting from "./Sorting";
import { useContextElement } from "@/context/Context";
import { useLanguage } from "@/context/LanguageProvider";
import Image from "next/image";
import Link from "next/link";
import ProductCardWishlist from "../shopCards/ProductCardWishlist";
import { SearchIcon, ShoppingCart, Plus, X, Trash2 } from "lucide-react";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import ModernPagination from "./ModernPagination";
import HotProductSlide from "../homes/multi-brand/HotProduct";

// ฟังก์ชันตรวจสอบภาษาไทย
function isThai(text) {
  return typeof text === "string" && /[\u0E00-\u0E7F]/.test(text);
}

export default function ProductStyle7() {
  const [products, setProducts] = useState([]);
  const [finalSorted, setFinalSorted] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("Total");
  const [allCategories, setAllCategories] = useState([]);
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  const productsPerPage = 8;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { t } = useTranslation();
  const { currentLanguageId } = useLanguage();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user_data");
        if (stored) {
          setUserData(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error parsing user_data from localStorage:", e);
      }
    }
  }, []);

  // Get cart context
  const {
    cartProducts,
    setCartProducts,
    removeFromCart,
    updateQuantity,
    totalPrice,
  } = useContextElement();

  // Fetch categories (ทุกภาษา)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/solution-categories`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setAllCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);

  const filteredCategories = useMemo(() => {
    if (allCategories.length === 0) {
      return [currentLanguageId === "th" ? "ทั้งหมด" : "Total"];
    }

    // จัดกลุ่ม categories ตาม category_id และภาษา
    const categoryMap = {};
    allCategories.forEach((cat) => {
      const lang = isThai(cat.name) ? "th" : "en";
      if (!categoryMap[cat.category_id]) {
        categoryMap[cat.category_id] = {};
      }
      categoryMap[cat.category_id][lang] = cat;
    });

    // เลือกเฉพาะภาษาที่ต้องการ
    const filtered = Object.values(categoryMap)
      .map((cats) => cats[currentLanguageId] || cats["en"] || cats["th"])
      .filter((cat) => cat && cat.active === 1)
      .map((cat) => cat.name);

    return [currentLanguageId === "th" ? "ทั้งหมด" : "Total", ...filtered];
  }, [allCategories, currentLanguageId]);

  // เพิ่มส่วนนี้ในฟังก์ชัน fetchProducts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (Array.isArray(data)) {
          // Group products by product_id AND language
          const groupedByProductId = data.reduce((acc, item) => {
            const productId = item.product_id;
            const lang = isThai(item.product_name) ? "th" : "en";

            if (!acc[productId]) {
              acc[productId] = { th: null, en: null, images: [] };
            }

            // Store product data by language
            acc[productId][lang] = {
              id: productId,
              product_id: productId,
              imgSrc: item.image,
              imgHoverSrc: item.image,
              title: item.product_name,
              product_name: item.product_name,
              price: parseFloat(item.price) || 0,
              filterCategories: item.solution_category_name
                ? [item.solution_category_name]
                : [],
              brand: "AgroSmart",
              isAvailable: item.stock_quantity > 0,
              stock_quantity: item.stock_quantity,
              solution_category_name: item.solution_category_name,
              solution_category_id: item.solution_category_id,
              product_category_name: item.product_category_name,
              action: item.action,
            };

            // Collect all images
            if (item.image && !acc[productId].images.includes(item.image)) {
              acc[productId].images.push(item.image);
            }

            return acc;
          }, {});

          // Filter by current language and combine data
          const productsForCurrentLang = Object.entries(groupedByProductId)
            .map(([productId, langs]) => {
              // Get product for current language, fallback to other language
              const product =
                langs[currentLanguageId] || langs["th"] || langs["en"];

              if (!product) return null;

              // Add all collected images
              return {
                ...product,
                images: langs.images,
                colors: langs.images.map((img, idx) => ({
                  name: idx === 0 ? "default" : `variant_${idx + 1}`,
                  colorClass: "bg_gray",
                  imgSrc: img,
                })),
              };
            })
            .filter((item) => item !== null && item.action === "Active");

          setProducts(productsForCurrentLang);
          setFinalSorted(productsForCurrentLang);
        } else {
          console.error("รูปแบบข้อมูลจาก API ไม่ถูกต้อง");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);
      }
    };

    fetchProducts();
  }, [API_BASE_URL, currentLanguageId]); // เพิ่ม currentLanguageId เป็น dependency

  useEffect(() => {
    const checkBodyOverflow = () => {
      if (!document.body.classList.contains("modal-open")) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };

    const interval = setInterval(checkBodyOverflow, 100);
    return () => clearInterval(interval);
  }, []);

  // Reset active category เมื่อสลับภาษา
  useEffect(() => {
    setActiveCategory("Total");
    setFinalSorted(products);
  }, [currentLanguageId, products]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = products.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );
    setFinalSorted(filtered);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);

    // กรณีเลือกดูทั้งหมด (รองรับทั้ง Total และ ทั้งหมด)
    if (category === "Total" || category === "ทั้งหมด") {
      setFinalSorted(products);
      setCurrentPage(1);
      return; // ออกจากฟังก์ชันเลยเพื่อความ Clean
    }

    // หา object ของ category ที่ user คลิกเพื่อเอา category_id
    const selectedCategoryObj = allCategories.find(
      (cat) => cat.name.trim() === category.trim()
    );

    if (selectedCategoryObj) {
      // (จุดสำคัญ) เมื่อได้ ID แล้ว ให้ไปดึง "ชื่อทุกภาษา" (TH + EN) ที่มี ID เดียวกันออกมา
      // ผลลัพธ์จะเป็น Array เช่น ['Furniture', 'เฟอร์นิเจอร์']
      const targetCategoryNames = allCategories
        .filter((cat) => cat.category_id === selectedCategoryObj.category_id)
        .map((cat) => cat.name.trim());

      // console.log("Filtering matching names:", targetCategoryNames);

      // ทำการ Filter สินค้า
      const filtered = products.filter((item) => {
        const productCategories = (item.filterCategories || []).map((c) => c.trim());
        
        // เช็คว่า Product ตัวนี้ มี Category ไหนตรงกับ List ภาษาที่เราดึงมาบ้าง (ใช้ .some)
        return productCategories.some((pCat) => targetCategoryNames.includes(pCat));
      });

      setFinalSorted(filtered);
    } else {
      //Error หาหมวดหมู่ไม่เจอ
      console.error("Category not found in master list");
      setFinalSorted([]);
    }

    setCurrentPage(1);
  };

  // Safe price formatting function
  const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Handle quantity change in cart
  const handleQuantityChange = (id, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
      setCartProducts((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item.id !== id) : []
      );
    } else {
      setCartProducts((prev) =>
        Array.isArray(prev)
          ? prev.map((item) =>
              item.id === id ? { ...item, quantity: quantity } : item
            )
          : []
      );
    }
  };

  // Safe cart products with fallback
  const safeCartProducts = Array.isArray(cartProducts) ? cartProducts : [];

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = finalSorted.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(finalSorted.length / productsPerPage);

  return (
    <>
      <section
        className="flat-spacing-2"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="container">
          {/* Enhanced Category Menu */}
          <div
            className="category-menu-container"
            style={{ marginBottom: "2rem" }}
          >
            <div
              className="category-menu"
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "0.5rem",
                padding: "1rem",
                background: "linear-gradient(135deg, #0099FF)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                whiteSpace: "nowrap",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filteredCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className="category-link"
                  style={{
                    background:
                      activeCategory === category
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.2)",
                    color: activeCategory === category ? "#0099FF" : "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)",
                    minWidth: "fit-content",
                    boxShadow:
                      activeCategory === category
                        ? "0 4px 16px rgba(0, 0, 0, 0.1)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== category) {
                      e.target.style.background = "rgba(255, 255, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== category) {
                      e.target.style.background = "rgba(255, 255, 255, 0.2)";
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Filter + Sorting + Search */}
          <div
            className="controls-container"
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              marginBottom: "2rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <style jsx>{`
              body {
                overflow-x: hidden !important;
                overflow-y: auto !important;
              }

              body.modal-open {
                overflow: hidden !important;
              }

              @media (max-width: 768px) {
                .controls-container .d-flex {
                  flex-direction: column !important;
                  align-items: stretch !important;
                  gap: 1rem !important;
                }

                .search-container {
                  order: 1;
                }

                .tf-control-filter {
                  order: 2;
                }
              }
            `}</style>

            <div
              className="d-flex justify-content-end align-items-center"
              style={{ flexWrap: "wrap", gap: "1rem" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ gap: "1rem" }}
              >
                <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                  <Sorting
                    products={products}
                    setFinalSorted={setFinalSorted}
                    currentLanguageId={currentLanguageId} // ส่งค่าภาษาเข้าไป
                  />
                </div>
                <div
                  className="search-container"
                  style={{ position: "relative" }}
                >
                  <span
                    className="search-icon"
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                      color: "#94a3b8",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    <SearchIcon />
                  </span>

                  <input
                    type="text"
                    placeholder={
                      currentLanguageId === "th" ? "ค้นหา..." : "Searching..."
                    }
                    onChange={handleSearch}
                    style={{
                      padding: "12px 16px 12px 44px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      minWidth: "250px",
                      fontSize: "14px",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "#f8fafc",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0099FF";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      const icon =
                        e.target.parentElement.querySelector(".search-icon");
                      if (icon) icon.style.color = "#0099FF";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.background = "#f8fafc";
                      e.target.style.boxShadow = "none";
                      const icon =
                        e.target.parentElement.querySelector(".search-icon");
                      if (icon) icon.style.color = "#94a3b8";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Product Count */}
          <div
            className="product-count"
            style={{
              textAlign: "center",
              background: "white",
              padding: "1rem 2rem",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#475569",
              marginBottom: "2rem",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e2e8f0",
            }}
          >
            {t("product.found")}{" "}
            <span style={{ color: "#0099FF" }}>{finalSorted.length}</span>
          </div>

          {/* Enhanced Product Grid */}
          {currentProducts.length > 0 ? (
            <>
              <style jsx>{`
                .product-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                  gap: 24px;
                  margin-bottom: 3rem;
                }

                .product-card-wrapper {
                  background: white;
                  border-radius: 16px;
                  padding: 20px;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                  border: 1px solid #e2e8f0;
                  transition: all 0.3s ease;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  min-height: 350px;
                }

                .product-card-wrapper:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
                }

                @media (max-width: 768px) {
                  .product-grid {
                    grid-template-columns: repeat(
                      auto-fill,
                      minmax(250px, 1fr)
                    );
                    gap: 16px;
                  }

                  .product-card-wrapper {
                    min-height: 350px;
                    padding: 16px;
                  }
                }

                @media (max-width: 480px) {
                  .product-grid {
                    grid-template-columns: repeat(
                      auto-fill,
                      minmax(220px, 1fr)
                    );
                    gap: 12px;
                  }

                  .product-card-wrapper {
                    min-height: 350px;
                    padding: 12px;
                  }
                }
              `}</style>
              <HotProductSlide />

              <div className="product-grid">
                {currentProducts.map((elm, i) => (
                  <div key={elm.id || i} className="product-card-wrapper">
                    <ProductCardWishlist product={elm} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              className="no-products"
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  color: "#cbd5e1",
                  marginBottom: "1rem",
                }}
              >
                📦
              </div>
              <h3 style={{ color: "#475569", marginBottom: "0.5rem" }}>
                {t("product.notfound")}
              </h3>
              <p style={{ color: "#94a3b8", margin: "0" }}>
                {t("product.searchterm")}
              </p>
            </div>
          )}

          {/* Modern Pagination */}
          {finalSorted.length > 0 && totalPages > 1 && (
            <div
              className="pagination-container"
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
              }}
            >
              <ModernPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxVisiblePages={5}
              />
            </div>
          )}
        </div>
      </section>

      {/* Floating Cart Button - SpeedDial Style */}
      <div
        className="floating-cart-container"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "12px",
        }}
      >
        <style jsx>{`
          .floating-cart-preview {
            transform: scale(0) translateY(20px);
            opacity: 0;
            transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
          }

          .floating-cart-preview.show {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .floating-cart-button {
            transform: scale(1);
            transition: all 0.3s ease;
            position: relative;
          }

          .floating-cart-button:hover {
            transform: scale(1.1);
          }

          .floating-cart-button:active {
            transform: scale(0.95);
          }

          .cart-preview-item {
            transition: all 0.2s ease;
          }

          .cart-preview-item:hover {
            background-color: #f8fafc;
            transform: translateX(-2px);
          }

          .floating-cart-button.has-items {
            animation: cartPulse 2s ease-in-out infinite;
          }

          @keyframes cartPulse {
            0% {
              box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
            }
            50% {
              box-shadow: 0 8px 32px rgba(16, 185, 129, 0.7),
                0 0 0 10px rgba(16, 185, 129, 0.1);
            }
            100% {
              box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
            }
          }

          .floating-cart-button.has-items::before {
            content: "";
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            border-radius: 50%;
            border: 2px solid rgba(16, 185, 129, 0.3);
            animation: rippleRing 3s ease-out infinite;
          }

          @keyframes rippleRing {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }

          .cart-count-badge {
            animation: badgeBounce 0.6s ease-out;
          }

          @keyframes badgeBounce {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(1.3);
            }
            100% {
              transform: scale(1);
            }
          }

          .floating-cart-button.has-items::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.3),
              transparent
            );
            border-radius: 50%;
            animation: shimmer 2.5s ease-in-out infinite;
          }

          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          .notification-dot {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 12px;
            height: 12px;
            background: #ef4444;
            border-radius: 50%;
            animation: notificationPulse 1.5s ease-in-out infinite;
          }

          @keyframes notificationPulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.8;
            }
          }

          .floating-cart-container:hover .cart-action-label {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }

          @media (max-width: 768px) {
            .floating-cart-container {
              bottom: 20px;
              right: 20px;
            }

            .floating-cart-preview {
              min-width: 280px !important;
              max-width: calc(100vw - 48px) !important;
            }

            .floating-cart-button {
              width: 80px !important;
              height: 80px !important;
            }
          }
        `}</style>

        {/* Quick Cart Preview */}
        {safeCartProducts.length > 0 && (
          <div
            className={`floating-cart-preview ${
              isCartPreviewOpen ? "show" : ""
            }`}
            style={{
              position: "fixed",
              right: "60px",
              bottom: "100px",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
              border: "1px solid #e2e8f0",
              minWidth: "320px",
              maxWidth: "400px",
              maxHeight: "450px",
              overflowY: "auto",
              marginBottom: "8px",
            }}
          >
            <div style={{ padding: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <h6
                  style={{
                    margin: 0,
                    color: "#334155",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  {t("product.cart")} ({safeCartProducts.length})
                </h6>
                <button
                  onClick={() => setIsCartPreviewOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                {safeCartProducts.map((item) => (
                  <div
                    key={item.id}
                    className="cart-preview-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 8px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={item.image || "/images/products/blank.png"}
                      alt={item.title || "Product"}
                      width={48}
                      height={48}
                      style={{
                        objectFit: "contain",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        background: "#f8fafc",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#334155",
                          lineHeight: "1.3",
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name || "Untitled Product"}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#0099FF",
                          fontWeight: "600",
                        }}
                      >
                        {item.quantity || 1} × ฿{formatPrice(item.price)}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#059669",
                        whiteSpace: "nowrap",
                        marginRight: "8px",
                      }}
                    >
                      ฿{formatPrice((item.price || 0) * (item.quantity || 1))}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "4px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        opacity: "0.7",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = "1";
                        e.target.style.background = "#fef2f2";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = "0.7";
                        e.target.style.background = "none";
                      }}
                      title="ลบสินค้า"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#334155" }}>
                    {t("product.subtotal")}
                  </span>
                  <span
                    style={{
                      fontWeight: "700",
                      color: "#059669",
                      fontSize: "18px",
                    }}
                  >
                    ฿{formatPrice(totalPrice)}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Link
                    href="/view-cart"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "10px 16px",
                      background: "white",
                      border: "1px solid #0099FF",
                      color: "#0099FF",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#0099FF";
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "white";
                      e.target.style.color = "#0099FF";
                    }}
                  >
                    {t("product.view")}
                  </Link>
                  <Link
                    href="/checkout"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "10px 16px",
                      background: "linear-gradient(135deg, #0099FF)",
                      border: "none",
                      color: "white",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {t("product.chackout")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Cart Button */}
        {userData && (
          <div style={{ position: "relative" }}>
            <button
              className={`floating-cart-button ${
                safeCartProducts.length > 0 ? "has-items" : ""
              }`}
              onClick={() => {
                if (safeCartProducts.length > 0) {
                  setIsCartPreviewOpen(!isCartPreviewOpen);
                } else {
                  const modal = document.getElementById("shoppingCart");
                  if (
                    modal &&
                    typeof window !== "undefined" &&
                    window.bootstrap?.Modal
                  ) {
                    const bsModal = new window.bootstrap.Modal(modal);
                    bsModal.show();
                  }
                }
              }}
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background:
                  safeCartProducts.length > 0
                    ? "linear-gradient(135deg, #10b981)"
                    : "linear-gradient(135deg, #0099FF)",
                border: "none",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                boxShadow:
                  safeCartProducts.length > 0
                    ? "0 8px 32px rgba(16, 185, 129, 0.4)"
                    : "0 8px 32px rgba(102, 126, 234, 0.4)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (safeCartProducts.length > 0) {
                  e.target.style.background =
                    "linear-gradient(135deg, #059669)";
                  e.target.style.boxShadow =
                    "0 12px 40px rgba(16, 185, 129, 0.5)";
                } else {
                  e.target.style.background =
                    "linear-gradient(135deg, #0099FF)";
                  e.target.style.boxShadow =
                    "0 12px 40px rgba(102, 126, 234, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (safeCartProducts.length > 0) {
                  e.target.style.background =
                    "linear-gradient(135deg, #10b981)";
                  e.target.style.boxShadow =
                    "0 8px 32px rgba(16, 185, 129, 0.4)";
                } else {
                  e.target.style.background =
                    "linear-gradient(135deg, #0099FF)";
                  e.target.style.boxShadow =
                    "0 8px 32px rgba(102, 126, 234, 0.4)";
                }
              }}
            >
              <Box sx={{ paddingTop: "15px" }}>
                <ShoppingCartOutlined />
              </Box>

              {/* Cart Count Badge */}
              {safeCartProducts.length > 0 && (
                <div
                  className="cart-count-badge"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "25px",
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    minWidth: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "700",
                    border: "2px solid white",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {safeCartProducts.length > 99
                    ? "99+"
                    : safeCartProducts.length}
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Shopping Cart Modal */}
      <div
        className="modal fade"
        id="shoppingCart"
        tabIndex="-1"
        aria-labelledby="shoppingCartLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div
            className="modal-content"
            style={{
              borderRadius: "20px",
              border: "none",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div
              className="modal-header"
              style={{
                background: "linear-gradient(135deg, #0099FF)",
                color: "white",
                borderRadius: "20px 20px 0 0",
                border: "none",
                padding: "1.5rem",
              }}
            >
              <h5
                className="modal-title"
                id="shoppingCartLabel"
                style={{ fontWeight: "600" }}
              >
                <span className="icon icon-bag me-2" />
                {t("product.cart")} ({safeCartProducts.length})
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="close"
                style={{
                  filter: "brightness(0) invert(1)",
                }}
              ></button>
            </div>
            <div className="modal-body" style={{ padding: "2rem" }}>
              {safeCartProducts.length === 0 ? (
                <div className="text-center py-5">
                  <div
                    style={{
                      fontSize: "64px",
                      color: "#e2e8f0",
                      marginBottom: "1rem",
                    }}
                  >
                    🛒
                  </div>
                  <h4 style={{ color: "#475569", marginBottom: "0.5rem" }}>
                    Cart Empty
                  </h4>
                  <p className="text-muted mb-4">Add Product To Cart.</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    style={{
                      background: "linear-gradient(135deg, #0099FF)",
                      border: "none",
                      padding: "12px 32px",
                      borderRadius: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Enhanced Cart Items */}
                  <div
                    className="cart-items"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    {safeCartProducts.map((item) => (
                      <div
                        key={item.id}
                        className="cart-item d-flex align-items-center py-3 border-bottom"
                        style={{
                          borderColor: "#e2e8f0 !important",
                          padding: "1.5rem 0",
                        }}
                      >
                        <div className="product-image me-3">
                          <Image
                            src={item.image || "/images/products/blank.png"}
                            alt={item.title || "Product"}
                            width={80}
                            height={80}
                            style={{
                              objectFit: "contain",
                              borderRadius: "12px",
                              border: "2px solid #f1f5f9",
                              background: "#f8fafc",
                            }}
                          />
                        </div>
                        <div className="product-info flex-grow-1">
                          <h6
                            className="product-title mb-1"
                            style={{
                              fontWeight: "600",
                            }}
                            title={item.title || "Untitled Product"}
                          >
                            <Link
                              href={`/product-detail/${item.id}`}
                              className="text-decoration-none"
                              style={{
                                color: "#334155",
                                maxWidth: "400px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "inline-block",
                              }}
                            >
                              {item.name || "Untitled Product"}
                            </Link>
                          </h6>
                          <p
                            className="product-price mb-2 fw-bold"
                            style={{ color: "#0099FF" }}
                          >
                            ฿{formatPrice(item.price)}
                          </p>
                          <div className="quantity-controls d-flex align-items-center">
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.quantity || 1) - 1
                                )
                              }
                              style={{
                                background: "#f1f5f9",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity || 1}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              className="form-control mx-2 text-center"
                              style={{
                                width: "60px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                height: "32px",
                              }}
                              min="1"
                            />
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.quantity || 1) + 1
                                )
                              }
                              style={{
                                background: "#f1f5f9",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="product-total me-3">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "#059669",
                              fontWeight: "bold",
                              fontSize: "1rem",
                            }}
                          >
                            <span>฿</span>
                            <span>
                              {formatPrice(
                                (item.price || 0) * (item.quantity || 1)
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="product-remove">
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => removeFromCart(item.id)}
                            title="ลบสินค้า"
                            style={{
                              background: "#fef2f2",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              borderRadius: "8px",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: "16px" }}>×</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Cart Summary */}
                  <div
                    className="cart-summary mt-4 pt-4"
                    style={{
                      borderTop: "2px solid #f1f5f9",
                      background: "#f8fafc",
                      margin: "2rem -2rem -2rem",
                      padding: "2rem",
                      borderRadius: "0 0 20px 20px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <span className="h5 mb-0" style={{ color: "#475569" }}>
                        {t("product.subtotal")}
                      </span>
                      <span
                        className="h4 mb-0 fw-bold"
                        style={{ color: "#059669" }}
                      >
                        ฿ {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="d-flex gap-3">
                      <Link
                        href="/view-cart"
                        className="btn flex-fill"
                        onClick={() => {
                          try {
                            if (typeof window !== "undefined") {
                              const modal =
                                document.getElementById("shoppingCart");
                              if (modal) {
                                if (window.bootstrap?.Modal) {
                                  const bsModal =
                                    window.bootstrap.Modal.getInstance(modal) ||
                                    new window.bootstrap.Modal(modal);
                                  bsModal.hide();
                                } else {
                                  modal.classList.remove("show");
                                  modal.style.display = "none";
                                  modal.setAttribute("aria-hidden", "true");
                                  document.body.classList.remove("modal-open");
                                  document.body.style.overflow = "";
                                  document.body.style.paddingRight = "";
                                  const backdrop =
                                    document.querySelector(".modal-backdrop");
                                  if (backdrop) backdrop.remove();
                                }
                              }
                            }
                          } catch (error) {
                            console.log("Modal close error:", error);
                          }
                        }}
                        style={{
                          background: "white",
                          border: "2px solid #0099FF",
                          color: "#0099FF",
                          padding: "12px",
                          borderRadius: "12px",
                          fontWeight: "600",
                          textDecoration: "none",
                          textAlign: "center",
                          display: "block",
                        }}
                      >
                        {t("product.view")}
                      </Link>
                      <Link
                        href="/checkout"
                        className="btn flex-fill"
                        onClick={() => {
                          try {
                            if (typeof window !== "undefined") {
                              const modal =
                                document.getElementById("shoppingCart");
                              if (modal) {
                                if (window.bootstrap?.Modal) {
                                  const bsModal =
                                    window.bootstrap.Modal.getInstance(modal) ||
                                    new window.bootstrap.Modal(modal);
                                  bsModal.hide();
                                } else {
                                  modal.classList.remove("show");
                                  modal.style.display = "none";
                                  modal.setAttribute("aria-hidden", "true");
                                  document.body.classList.remove("modal-open");
                                  document.body.style.overflow = "";
                                  document.body.style.paddingRight = "";
                                  const backdrop =
                                    document.querySelector(".modal-backdrop");
                                  if (backdrop) backdrop.remove();
                                }
                              }
                            }
                          } catch (error) {
                            console.log("Modal close error:", error);
                          }
                        }}
                        style={{
                          background: "linear-gradient(135deg, #0099FF)",
                          border: "none",
                          color: "white",
                          padding: "12px",
                          borderRadius: "12px",
                          fontWeight: "600",
                          textDecoration: "none",
                          textAlign: "center",
                          display: "block",
                        }}
                      >
                        {t("product.chackout")}
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
