"use client";

import React, { useContext, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  Menu,
  Heart,
  ShoppingBag,
  User,
  LogOut,
  Settings,
} from "lucide-react";

import { ThemeContext } from "@/context/ThemeContext";
import { useContextElement } from "@/context/Context";
import { useLanguage } from "@/context/LanguageProvider";

import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";
import LanguageSelect from "../common/LanguageSelect";
import Logo from "../../public/images/logo/FarmSuk-TM.png";

// ฟังก์ชันตรวจสอบภาษาไทย
function isThai(text) {
  return /[\u0E00-\u0E7F]/.test(text);
}

export default function Header7() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const themeContext = useContext(ThemeContext);
  const { currentLanguageId } = useLanguage();

  const { user, login, logout } = useContextElement();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allSolutions, setAllSolutions] = useState([]);
  const [showSolutionsDropdown, setShowSolutionsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false);

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const MAX_MOBILE_SOLUTIONS = 6;

  // กรองและจัดกลุ่ม solutions ตามภาษา
  const solutionMenu = useMemo(() => {
    // สร้าง map category_id -> [solutionTH, solutionEN]
    const solutionMap = {};
    allSolutions.forEach((solution) => {
      const lang = isThai(solution.name) ? "th" : "en";
      if (!solutionMap[solution.category_id]) {
        solutionMap[solution.category_id] = {};
      }
      solutionMap[solution.category_id][lang] = solution;
    });

    // เลือก solution ตามภาษาปัจจุบัน
    const filtered = Object.values(solutionMap)
      .map((solutions) => solutions[currentLanguageId])
      .filter(Boolean)
      .filter((solution) => solution.active === 1);

    return filtered;
  }, [allSolutions, currentLanguageId]);

  const limitedMobileSolutions = solutionMenu.slice(0, MAX_MOBILE_SOLUTIONS);

  // --- ตรวจสอบ login ตอน mount ---
  useEffect(() => {
    const checkExistingLogin = () => {
      if (typeof window !== "undefined") {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) {
            setIsLoading(false);
            return;
          }
          const storedUserData = localStorage.getItem("user_data");
          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            login(parsedUserData);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          logout();
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkExistingLogin();
  }, [login, logout]);

  // --- Logout function ---
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      logout();
      localStorage.removeItem("remember_me");
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setShowUserMenu(false);
      closeMobileMenu();
      router.push("/login");
    }
  };

  // --- Fetch solution categories ---
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/solution-categories/`);
        if (!response.ok) throw new Error("Failed to fetch solutions");
        const data = await response.json();
        setAllSolutions(data); // เก็บข้อมูลทั้งหมด
      } catch (error) {
        console.error("Error fetching solution categories:", error);
      }
    };
    fetchSolutions();
  }, [apiEndpoint]);

  // --- Helper functions ---
  const getUserDisplayName = () => {
    if (!user) return "";
    const firstName = user.first_name || user.firstName || "";
    const lastName = user.last_name || user.lastName || "";
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return firstName || user.username || t("common.user");
  };

  const getUserRole = () => {
    if (!user) return "";
    const roleMap = { 1: "Admin", 2: "User", 3: "Manager" };
    return user.role || roleMap[user.user_type_id] || "Member";
  };

  // ฟังก์ชันจัดการ image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/default-solution.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/")) return imageUrl;
    return "/" + imageUrl;
  };

  // --- UI functions ---
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSolutionsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsMobileSolutionsOpen(false);
    }
  };

  const toggleMobileSolutions = () =>
    setIsMobileSolutionsOpen(!isMobileSolutionsOpen);

  const isActivePath = (path) => {
    if (path === "/") return pathname === "/";
    if (path === "/all-solution")
      return (
        pathname === "/all-solution" || pathname.startsWith("/solution-detail/")
      );
    return pathname.startsWith(path);
  };

  // --- Click outside to close dropdowns ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu"))
        setShowUserMenu(false);
      if (showSolutionsDropdown && !event.target.closest(".categories-item"))
        setShowSolutionsDropdown(false);
      if (
        isMobileMenuOpen &&
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".mobile-menu-toggle")
      )
        closeMobileMenu();
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showUserMenu, showSolutionsDropdown, isMobileMenuOpen]);

  // --- Prevent body scroll when mobile menu open ---
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  if (!themeContext || !themeContext.theme) return null;
  const { theme } = themeContext;

  return (
    <header
      id="header"
      className="header-default header-style-2"
      style={{
        position: "static",
        backgroundColor: theme.backgroundColor,
        fontFamily: "Kanit, sans-serif !important",
      }}
    >
      {/* ---------- TOP HEADER ---------- */}
      <div className="main-header line">
        <div className="container-full px_15 lg-px_40">
          <div className="row wrapper-header align-items-center">
            <div className="col-auto">
              <Link
                href={`/`}
                className="logo-header"
                style={{ color: theme.primaryColor }}
              >
                <Image
                  alt="logo"
                  className="logo"
                  src={Logo}
                  width={143}
                  height={21}
                />
              </Link>
            </div>
            <div className="col"></div>
            <div className="col-auto d-flex justify-content-end align-items-center">
              <div className="header-icons d-flex align-items-center gap-20">
                {/* ---------- Desktop icons ---------- */}
                <div className="d-none d-xl-flex align-items-center gap-3">
                  <LanguageSelect />
                  {user && (
                    <>
                      <Link
                        href={`/wishlist`}
                        className="nav-icon-item"
                        style={{ color: theme.primaryColor }}
                      >
                        <Heart size={18} style={{ marginInline: 3 }} />
                        <WishlistLength />
                      </Link>
                      <Link
                        href={`/view-cart`}
                        className="nav-icon-item"
                        style={{ color: theme.primaryColor }}
                      >
                        <ShoppingBag size={18} style={{ marginInline: 3 }} />
                        <CartLength />
                      </Link>
                    </>
                  )}
                  {isLoading ? (
                    <div
                      className="user-loading"
                      style={{ color: theme.primaryColor }}
                    >
                      <User size={20} style={{ opacity: 0.5 }} />
                    </div>
                  ) : user ? (
                    <div className="user-menu position-relative">
                      <button
                        className="user-info-btn d-flex align-items-center gap-10"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{
                          background: "none",
                          border: "none",
                          color: theme.primaryColor,
                          cursor: "pointer",
                          padding: "8px",
                        }}
                      >
                        <div className="user-avatar">
                          <User size={20} />
                        </div>
                        <div className="user-details d-none d-lg-block text-start">
                          <div
                            className="user-name"
                            style={{ fontSize: "14px", fontWeight: "500" }}
                          >
                            {getUserDisplayName()}
                          </div>
                          <div
                            className="user-role"
                            style={{ fontSize: "12px", opacity: "0.7" }}
                          >
                            {getUserRole()}
                          </div>
                        </div>
                        {showUserMenu ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </button>
                      {showUserMenu && (
                        <div
                          className="user-dropdown position-absolute"
                          style={{
                            top: "100%",
                            right: "0",
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            minWidth: "250px",
                            zIndex: 1000,
                            marginTop: "8px",
                          }}
                        >
                          <div className="user-info p-3 border-bottom">
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#333",
                                marginBottom: "4px",
                              }}
                            >
                              {getUserDisplayName()}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "#666",
                                marginBottom: "2px",
                              }}
                            >
                              {user.email}
                            </div>
                            {/* <div style={{ fontSize: "12px", color: "#999" }}>
                              {getUserRole()} • {user.username}
                            </div> */}
                          </div>
                          <div className="user-menu-items">
                            <Link
                              href="/my-account"
                              className="dropdown-item d-flex align-items-center gap-10 p-3"
                              onClick={() => setShowUserMenu(false)}
                              style={{
                                textDecoration: "none",
                                color: "#333",
                                transition: "background-color 0.2s",
                              }}
                            >
                              <User size={16} />
                              {t("auth.myProfile")}
                            </Link>
                            <Link
                              href="/my-account-orders"
                              className="dropdown-item d-flex align-items-center gap-10 p-3"
                              onClick={() => setShowUserMenu(false)}
                              style={{
                                textDecoration: "none",
                                color: "#333",
                                transition: "background-color 0.2s",
                              }}
                            >
                              <ShoppingBag size={16} />
                              {t("auth.myOrders")}
                            </Link>
                            <Link
                              href="/my-account-edit"
                              className="dropdown-item d-flex align-items-center gap-10 p-3"
                              onClick={() => setShowUserMenu(false)}
                              style={{
                                textDecoration: "none",
                                color: "#333",
                                transition: "background-color 0.2s",
                              }}
                            >
                              <Settings size={16} />
                              {t("auth.settings")}
                            </Link>
                            <hr className="m-0" />
                            <button
                              onClick={handleLogout}
                              className="dropdown-item d-flex align-items-center gap-10 p-3 w-100"
                              style={{
                                background: "none",
                                border: "none",
                                textAlign: "left",
                                color: "#dc3545",
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                              }}
                            >
                              <LogOut size={16} />
                              {t("auth.logout")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="auth-buttons d-flex align-items-center gap-10">
                      <Link
                        href="/login"
                        className="btn-login"
                        style={{
                          color: theme.primaryColor,
                          textDecoration: "none",
                          fontSize: "14px",
                          padding: "8px 12px",
                          borderRadius: "6px",
                        }}
                      >
                        {t("auth.login")}
                      </Link>
                      <Link
                        href="/register-acc"
                        className="btn-register"
                        style={{
                          background: theme.primaryColor,
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontSize: "14px",
                        }}
                      >
                        {t("auth.register")}
                      </Link>
                    </div>
                  )}
                </div>
                {/* ---------- Mobile menu button ---------- */}
                <button
                  className="mobile-menu-toggle d-xl-none d-flex align-items-center"
                  onClick={toggleMobileMenu}
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.primaryColor,
                    fontSize: "24px",
                    cursor: "pointer",
                    padding: "8px",
                  }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Mobile Overlay ---------- */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9998,
          }}
          onClick={closeMobileMenu}
        />
      )}

      {/* ---------- Mobile Menu ---------- */}
      <div
        className={`mobile-menu-container d-xl-none ${
          isMobileMenuOpen ? "mobile-menu-open" : ""
        }`}
        style={{
          position: "fixed",
          top: "0",
          right: isMobileMenuOpen ? "0" : "-100%",
          width: "280px",
          height: "100vh",
          backgroundColor: "#fff",
          zIndex: 9999,
          transition: "right 0.3s ease-in-out",
          overflowY: "auto",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="mobile-menu-header d-flex align-items-center justify-content-between p-3"
          style={{ borderBottom: "1px solid #eee" }}
        >
          <div className="mobile-logo">
            <Image alt="logo" src={Logo} width={120} height={18} />
          </div>
          <button
            onClick={closeMobileMenu}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              color: "#666",
              cursor: "pointer",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* ---------- Mobile User Section ---------- */}
        {user ? (
          <div
            className="mobile-user-section p-3"
            style={{ borderBottom: "1px solid #eee" }}
          >
            <div className="d-flex align-items-center gap-10 mb-3">
              <div className="user-avatar">
                <User size={24} style={{ color: theme.primaryColor }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {getUserDisplayName()}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {getUserRole()}
                </div>
              </div>
            </div>
            <div className="mobile-user-actions">
              <Link
                href="/my-account"
                className="mobile-menu-item d-flex align-items-center gap-10 p-2"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  color: "#333",
                  borderRadius: "6px",
                }}
              >
                <User size={16} />
                {t("auth.myProfile")}
              </Link>
              <Link
                href="/my-account-orders"
                className="mobile-menu-item d-flex align-items-center gap-10 p-2"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  color: "#333",
                  borderRadius: "6px",
                }}
              >
                <ShoppingBag size={16} />
                {t("auth.myOrders")}
              </Link>
              <button
                onClick={handleLogout}
                className="mobile-menu-item d-flex align-items-center gap-10 p-2 w-100"
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  color: "#dc3545",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                <LogOut size={16} />
                {t("auth.logout")}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="mobile-auth-section p-3"
            style={{ borderBottom: "1px solid #eee" }}
          >
            <div className="d-flex gap-10">
              <Link
                href="/login"
                className="btn btn-outline-primary flex-1 text-center py-2"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  border: `1px solid ${theme.primaryColor}`,
                  color: theme.primaryColor,
                  borderRadius: "6px",
                }}
              >
                {t("auth.login")}
              </Link>
              <Link
                href="/register-acc"
                className="btn btn-primary flex-1 text-center py-2"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  backgroundColor: theme.primaryColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                {t("auth.register")}
              </Link>
            </div>
          </div>
        )}

        {/* ---------- Mobile Nav ---------- */}
        <div className="mobile-nav-menu">
          <Link
            href="/"
            className={`mobile-nav-item d-flex align-items-center justify-content-between p-3 ${
              isActivePath("/") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{
              textDecoration: "none",
              color: isActivePath("/") ? theme.primaryColor : "#333",
              fontWeight: isActivePath("/") ? "600" : "400",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>{t("navigation.home")}</span>
            <ChevronRight size={12} />
          </Link>

          {/* Solutions */}
          <div className="mobile-solutions-section">
            <button
              className={`mobile-nav-item d-flex align-items-center justify-content-between p-3 w-100 ${
                isActivePath("/all-solution") ? "active" : ""
              }`}
              onClick={toggleMobileSolutions}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                color: isActivePath("/all-solution")
                  ? theme.primaryColor
                  : "#333",
                fontWeight: isActivePath("/all-solution") ? "600" : "400",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
              }}
            >
              <span>{t("navigation.solutions")}</span>
              {isMobileSolutionsOpen ? (
                <ChevronUp size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>
            {isMobileSolutionsOpen && (
              <div
                className="mobile-solutions-submenu"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <Link
                  href="/all-solution"
                  className="mobile-submenu-item d-block p-3 ps-4"
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    fontSize: "14px",
                    borderBottom: "1px solid #eee",
                    fontWeight: "500",
                  }}
                >
                  {t("navigation.viewAllSolutions")}
                </Link>

                {limitedMobileSolutions.length > 0 ? (
                  limitedMobileSolutions.map((solution) => (
                    <Link
                      key={`${solution.category_id}-${currentLanguageId}`}
                      href={`/solution-detail/${solution.category_id}`}
                      className="mobile-submenu-item d-flex align-items-center gap-10 p-3 ps-4"
                      onClick={closeMobileMenu}
                      style={{
                        textDecoration: "none",
                        color: "#666",
                        fontSize: "13px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div
                        className="solution-icon"
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "4px",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={getImageUrl(solution.image_url)}
                          alt={solution.name}
                          width={24}
                          height={24}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) =>
                            (e.currentTarget.src =
                              "/images/default-solution.png")
                          }
                        />
                      </div>
                      <span>{solution.name}</span>
                    </Link>
                  ))
                ) : (
                  <div
                    className="mobile-submenu-item p-3 ps-4"
                    style={{
                      fontSize: "13px",
                      color: "#999",
                      fontStyle: "italic",
                    }}
                  >
                    {t("navigation.noSolutionsFound", "No solutions available")}
                  </div>
                )}

                {solutionMenu.length > MAX_MOBILE_SOLUTIONS && (
                  <Link
                    href="/all-solution"
                    className="mobile-submenu-item d-flex align-items-center justify-content-center p-3"
                    onClick={closeMobileMenu}
                    style={{
                      textDecoration: "none",
                      color: theme.primaryColor,
                      fontSize: "13px",
                      fontWeight: "500",
                      borderTop: "1px solid #ddd",
                      backgroundColor: "#fff",
                    }}
                  >
                    {t("navigation.viewMoreSolutions", {
                      count: solutionMenu.length - MAX_MOBILE_SOLUTIONS,
                    })}{" "}
                    →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Other Navigation Items */}
          <Link
            href="/tkc-product"
            className={`mobile-nav-item d-flex align-items-center justify-content-between p-3 ${
              isActivePath("/tkc-product") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{
              textDecoration: "none",
              color: isActivePath("/tkc-product") ? theme.primaryColor : "#333",
              fontWeight: isActivePath("/tkc-product") ? "600" : "400",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>{t("navigation.products")}</span>
            <ChevronRight size={12} />
          </Link>

          <Link
            href="/blog-sidebar-right"
            className={`mobile-nav-item d-flex align-items-center justify-content-between p-3 ${
              isActivePath("/blog-sidebar-right") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{
              textDecoration: "none",
              color: isActivePath("/blog-sidebar-right")
                ? theme.primaryColor
                : "#333",
              fontWeight: isActivePath("/blog-sidebar-right") ? "600" : "400",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>{t("navigation.blog")}</span>
            <ChevronRight size={12} />
          </Link>

          <Link
            href="/store-locations"
            className={`mobile-nav-item d-flex align-items-center justify-content-between p-3 ${
              isActivePath("/store-locations") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{
              textDecoration: "none",
              color: isActivePath("/store-locations")
                ? theme.primaryColor
                : "#333",
              fontWeight: isActivePath("/store-locations") ? "600" : "400",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>{t("navigation.contact")}</span>
            <ChevronRight size={12} />
          </Link>

          <Link
            href="/about-us"
            className={`mobile-nav-item d-flex align-items-center justify-content-between p-3 ${
              isActivePath("/about-us") ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{
              textDecoration: "none",
              color: isActivePath("/about-us") ? theme.primaryColor : "#333",
              fontWeight: isActivePath("/about-us") ? "600" : "400",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>{t("navigation.about")}</span>
            <ChevronRight size={12} />
          </Link>
        </div>

        {/* Mobile Footer with Cart & Wishlist */}
        {user && (
          <div className="mobile-menu-footer p-3 mt-auto">
            <div className="d-flex justify-content-center gap-15">
              <Link
                href="/wishlist"
                className="mobile-footer-icon d-flex flex-column align-items-center position-relative"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  color: theme.primaryColor,
                  fontSize: "12px",
                  padding: "10px",
                }}
              >
                <Heart size={20} style={{ marginBottom: "4px" }} />
                <span>{t("common.wishlist")}</span>
                <WishlistLength />
              </Link>
              <Link
                href="/view-cart"
                className="mobile-footer-icon d-flex flex-column align-items-center position-relative"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  color: theme.primaryColor,
                  fontSize: "12px",
                  padding: "10px",
                }}
              >
                <ShoppingBag size={20} style={{ marginBottom: "4px" }} />
                <span>{t("common.cart")}</span>
                <CartLength />
              </Link>
            </div>
          </div>
        )}

        {/* Language Selector in Mobile Menu */}
        <div className="mobile-language-section p-3 border-top">
          <LanguageSelect />
        </div>
      </div>

      <style jsx global>{`
        /* FORCE Kanit font with maximum possible specificity */
        html body #header,
        html body #header *,
        html body #header a,
        html body #header span,
        html body #header div,
        html body #header button,
        html body #header li,
        html body #header ul,
        html body #header h1,
        html body #header h2,
        html body #header h3,
        html body #header h4,
        html body #header h5,
        html body #header h6,
        html body #header p,
        html body .kanit-font-header,
        html body .kanit-font-header *,
        html body .kanit-font-header a,
        html body .kanit-font-header span,
        html body .kanit-font-header div,
        html body .kanit-font-header button,
        html body .kanit-font-header li,
        html body .kanit-font-header ul,
        html body .kanit-font-header h1,
        html body .kanit-font-header h2,
        html body .kanit-font-header h3,
        html body .kanit-font-header h4,
        html body .kanit-font-header h5,
        html body .kanit-font-header h6,
        html body .kanit-font-header p {
          font-weight: inherit !important;
        }

        .navbar *,
        .nav *,
        .dropdown *,
        .btn *,
        .text-* {
          font-family: "Kanit", sans-serif !important;
        }

        .mobile-menu-item:hover,
        .mobile-submenu-item:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }

        .mobile-solutions-submenu {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1199px) {
          .header-icons {
            gap: 5px !important;
          }

          .cart-wishlist-icons {
            gap: 3px !important;
          }

          .nav-icon-item {
            min-width: 35px !important;
            height: 35px !important;
            padding: 4px !important;
          }

          .nav-icon-item i {
            font-size: 16px !important;
          }
        }

        @media (max-width: 767px) {
          .nav-icon-item {
            min-width: 32px !important;
            height: 32px !important;
          }

          .nav-icon-item i {
            font-size: 14px !important;
          }

          .mobile-cart-wishlist {
            gap: 5px !important;
          }

          .mobile-cart-wishlist .nav-icon-item {
            min-width: 30px !important;
            height: 30px !important;
          }

          .mobile-cart-wishlist .nav-icon-item i {
            font-size: 14px !important;
          }
        }

        .mobile-footer-icon:hover {
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }

        .nav-icon-item {
          position: relative;
        }

        .mobile-menu-container {
          display: flex;
          flex-direction: column;
        }

        .mobile-nav-menu {
          flex: 1;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa !important;
        }

        .user-dropdown {
          transform: translateY(0);
          animation: dropdownFadeIn 0.2s ease-out;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* เพิ่ม styles สำหรับการจัดการ multi-language */
        .solution-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #666;
          font-style: italic;
        }

        .mobile-language-section {
          margin-top: auto;
        }

        /* ปรับแต่ง mobile menu เพื่อรองรับ language switching */
        .mobile-menu-container {
          min-height: 100vh;
        }

        .mobile-nav-menu {
          flex-grow: 1;
        }

        /* Animation สำหรับ language switching */
        .solution-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
}
