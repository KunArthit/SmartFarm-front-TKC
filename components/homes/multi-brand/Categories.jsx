"use client";

import React, { useEffect, useState, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeContext } from "@/context/ThemeContext";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NoImage from "../../../public/images/NoImage.jpg";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isTransitioningRef = useRef(false);
  const [isDragging] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { theme } = useContext(ThemeContext);
  const sliderRef = useRef(null);

  const shouldUseSlider = categories.length >= 4;

  // ฟังก์ชันตรวจสอบภาษาไทย
  const isThai = (text) => {
    return typeof text === "string" && /[\u0E00-\u0E7F]/.test(text);
  };

  // ฟังก์ชันกรอง categories ตามภาษา
  const filterCategoriesByLanguage = (categoriesData) => {
    const uniqueCategories = new Map();

    categoriesData.forEach((category) => {
      const categoryId = category.category_id;
      const categoryName = category.name || "";
      const isThaiCategory = isThai(categoryName);

      // เลือกตามภาษาปัจจุบัน
      const shouldInclude =
        currentLang === "th" ? isThaiCategory : !isThaiCategory;

      if (!uniqueCategories.has(categoryId) && shouldInclude) {
        uniqueCategories.set(categoryId, category);
      }
    });

    return Array.from(uniqueCategories.values());
  };

  // Fetch และกรองตามภาษา
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiEndpoint}/solution-categories/`);
        const data = await res.json();

        const filtered = data.filter((item) => item.active === 1);

        // กรองตามภาษาปัจจุบัน
        const languageFiltered = filterCategoriesByLanguage(filtered);

        setCategories(languageFiltered);
        // console.log(
        //   `🌍 Filtered categories (${currentLang}):`,
        //   languageFiltered.length
        // );
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [apiEndpoint, currentLang]); // เพิ่ม currentLang dependency

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (sliderRef.current && shouldUseSlider) {
      sliderRef.current.slickPause();
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (sliderRef.current && shouldUseSlider) {
      sliderRef.current.slickPlay();
    }
  };

  const CustomPrevArrow = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseStyle = {
      position: "absolute",
      left: "-60px",
      top: "50%",
      width: "60px",
      height: "60px",
      background: isHovered
        ? `linear-gradient(135deg, ${theme?.primaryColor || "#007bff"} 0%, ${
            theme?.primaryColor || "#007bff"
          }cc 50%, ${theme?.primaryColor || "#007bff"}dd 100%)`
        : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 15,
      boxShadow: isHovered
        ? `0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px ${
            theme?.primaryColor || "#007bff"
          }20`
        : "0 6px 20px rgba(0, 0, 0, 0.12)",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
      transform: "translateY(-50%)",
    };

    return (
      <motion.div
        onClick={onClick}
        style={baseStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            color: isHovered ? "#ffffff" : theme?.primaryColor || "#007bff",
          }}
          animate={{ x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    );
  };

  const CustomNextArrow = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseStyle = {
      position: "absolute",
      right: "-60px",
      top: "50%",
      width: "60px",
      height: "60px",
      background: isHovered
        ? `linear-gradient(135deg, ${theme?.primaryColor || "#007bff"} 0%, ${
            theme?.primaryColor || "#007bff"
          }cc 50%, ${theme?.primaryColor || "#007bff"}dd 100%)`
        : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 15,
      boxShadow: isHovered
        ? `0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px ${
            theme?.primaryColor || "#007bff"
          }20`
        : "0 6px 20px rgba(0, 0, 0, 0.12)",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
      transform: "translateY(-50%)",
    };

    return (
      <motion.div
        onClick={onClick}
        style={baseStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            color: isHovered ? "#ffffff" : theme?.primaryColor || "#007bff",
          }}
          animate={{ x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    );
  };

  const sliderSettings = {
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "80px",
    autoplay: !isPaused,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    pauseOnDotsHover: true,
    focusOnSelect: true,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: (current, next) => {
      isTransitioningRef.current = true;
      setCurrentIndex(next);
    },
    afterChange: (current) => {
      isTransitioningRef.current = false;
      setCurrentIndex(current);
    },
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: "40px",
          autoplay: !isPaused,
          prevArrow: <CustomPrevArrow />,
          nextArrow: <CustomNextArrow />,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "60px",
          autoplay: !isPaused,
          prevArrow: <CustomPrevArrow />,
          nextArrow: <CustomNextArrow />,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "0px",
          autoplay: !isPaused,
          prevArrow: <CustomPrevArrow />,
          nextArrow: <CustomNextArrow />,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0px",
          arrows: false,
          autoplay: !isPaused,
        },
      },
    ],
  };

  const StaticGrid = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          maxWidth: "100%",
          padding: "0 20px",
          flexWrap: "nowrap",
        }}
        className="static-horizontal-container"
      >
        {categories.map((category, index) => {
          const stableKey = `static-${
            category.category_id || category.id || category.name || index
          }-${index}`;

          return (
            <motion.div
              key={stableKey}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                width: "300px",
                maxWidth: "300px",
                height: "450px",
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
                border: `2px solid ${theme?.primaryColor || "#007bff"}30`,
                cursor: "pointer",
                flexShrink: 0,
              }}
              className="category-card static-card"
              whileHover={{
                scale: 1.05,
                borderColor: theme?.primaryColor || "#007bff",
                boxShadow: `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px ${
                  theme?.primaryColor || "#007bff"
                }20`,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              }}
            >
              <motion.div
                style={{
                  width: "100%",
                  height: "65%",
                  position: "relative",
                  overflow: "hidden",
                  background:
                    "linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)",
                }}
              >
                <Image
                  src={category.image_url || NoImage}
                  alt={category.name}
                  fill
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: "none",
                  }}
                  className="category-image"
                  priority={index <= 2}
                  draggable={false}
                  onDragStart={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                />
              </motion.div>

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "35%",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "24px",
                  borderTop: `3px solid ${theme?.primaryColor || "#007bff"}30`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Link href={`/solution-detail/${category.category_id}`}>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      textAlign: "center",
                      margin: "-8px 0 5px 0",
                      lineHeight: "1.3",
                      cursor: "pointer",
                      padding: "6px 12px",
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      textShadow: "0 2px 4px rgba(0, 123, 255, 0.2)",
                      color: theme?.primaryColor || "#007bff",
                      letterSpacing: "-0.5px",
                    }}
                    className="category-title"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${
                        theme?.primaryColor || "#007bff"
                      }10`;
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {category.name}
                  </h3>
                </Link>

                <p
                  style={{
                    color: "#444",
                    textAlign: "center",
                    margin: "0 0 5px 0",
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "1.4",
                    height: "36px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    pointerEvents: "none",
                  }}
                  className="category-description"
                >
                  {category.description || t("solution.innovative")}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "8px 0 0 0",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#333",
                    fontWeight: "600",
                    pointerEvents: "none",
                  }}
                  className="category-cta"
                >
                  <span>{t("solution.click")}</span>
                  <span
                    style={{
                      fontSize: "18px",
                      color: theme?.primaryColor || "#007bff",
                      fontWeight: "700",
                      animation: "enhanced-bounce 2.5s infinite",
                      filter: "drop-shadow(0 2px 4px rgba(0, 123, 255, 0.3))",
                    }}
                    className="category-arrow"
                  >
                    →
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const sectionStyle = {
    background: `linear-gradient(135deg, ${
      theme?.backgroundColor || "#ffffff"
    } 0%, ${theme?.backgroundColor || "#f8f9fa"} 100%)`,
    color: "#1a1a1a",
    padding: "100px 0 40px",
    minHeight: "800px",
    position: "relative",
    overflow: "hidden",
  };

  if (isLoading) {
    return (
      <section style={sectionStyle}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-5"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                width: "80px",
                height: "80px",
                border: `4px solid ${theme?.primaryColor || "#007bff"}20`,
                borderTop: `4px solid ${theme?.primaryColor || "#007bff"}`,
                borderRadius: "50%",
                margin: "0 auto",
                boxShadow: `0 0 30px ${theme?.primaryColor || "#007bff"}30`,
              }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                marginTop: "32px",
                color: "#666",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              {currentLang === "th"
                ? "กำลังโหลดโซลูชั่น..."
                : "Loading amazing solutions..."}
            </motion.p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section style={sectionStyle}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${
              theme?.primaryColor || "#007bff"
            }08 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div className="container position-relative">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-5"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                fontSize: "clamp(2.8rem, 5.5vw, 4rem)",
                fontWeight: "800",
                color: "#1a1a1a",
                marginBottom: "20px",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
                textShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("solution.Solutions")}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                width: "100px",
                height: "4px",
                background: `linear-gradient(90deg, ${
                  theme?.primaryColor || "#007bff"
                } 0%, ${theme?.primaryColor || "#007bff"}60 100%)`,
                borderRadius: "2px",
                margin: "0 auto",
                boxShadow: `0 2px 10px ${theme?.primaryColor || "#007bff"}40`,
              }}
            />
          </motion.div>

          {shouldUseSlider ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="coverflow-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                maxWidth: "100%",
                overflow: "visible",
                padding: "0 80px",
              }}
            >
              <Slider
                ref={sliderRef}
                {...sliderSettings}
                className={`enhanced-carousel ${isPaused ? "paused" : ""}`}
              >
                {categories.map((category, index) => {
                  const isCenter = index === currentIndex;
                  const distance = Math.abs(index - currentIndex);
                  const stableKey = `slide-${
                    category.category_id ||
                    category.id ||
                    category.name ||
                    index
                  }-${index}`;

                  return (
                    <div key={stableKey} data-index={index}>
                      <motion.div
                        style={{
                          width: "360px",
                          height: "500px",
                          borderRadius: "20px",
                          overflow: "hidden",
                          position: "relative",
                          background: isCenter
                            ? "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)"
                            : "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                          border: isCenter
                            ? `4px solid ${theme?.primaryColor || "#007bff"}`
                            : "2px solid #e8eaed",
                          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                          willChange: "transform, border, background",
                          pointerEvents: isDragging ? "none" : "auto",
                          cursor: "pointer",
                          margin: "20px auto",
                          opacity: isCenter ? 1 : distance === 1 ? 0.75 : 0.5,
                        }}
                        className="category-card"
                        animate={{
                          transform: isCenter
                            ? "scale(1.0) rotateY(0deg)"
                            : distance === 1
                            ? "scale(0.75) rotateY(15deg)"
                            : "scale(0.65) rotateY(25deg)",
                          y: 0,
                          scale: isCenter ? 1.0 : distance === 1 ? 0.75 : 0.65,
                        }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <motion.div
                          style={{
                            width: "100%",
                            height: "65%",
                            position: "relative",
                            overflow: "hidden",
                            background:
                              "linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)",
                          }}
                          animate={{
                            y: 0,
                            scale: 1,
                          }}
                          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <Image
                            src={category.image_url || NoImage}
                            alt={category.name}
                            fill
                            style={{
                              objectFit: "cover",
                              transition:
                                "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                              pointerEvents: "none",
                              transform: isCenter ? "scale(1.05)" : "scale(1)",
                              filter: isCenter
                                ? "saturate(1.2) contrast(1.1)"
                                : "saturate(1) contrast(1)",
                            }}
                            className="category-image"
                            priority={index <= 2}
                            draggable={false}
                            onDragStart={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                          />
                        </motion.div>

                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "35%",
                            background: isCenter
                              ? "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)"
                              : "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "28px",
                            borderTop: isCenter
                              ? `3px solid ${
                                  theme?.primaryColor || "#007bff"
                                }30`
                              : "2px solid #f0f2f5",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <Link
                            href={`/solution-detail/${category.category_id}`}
                          >
                            <h3
                              style={{
                                fontSize: isCenter ? "24px" : "19px",
                                fontWeight: isCenter ? "700" : "600",
                                textAlign: "center",
                                margin: "-10px 0 5px 0",
                                lineHeight: "1.3",
                                cursor: "pointer",
                                padding: "6px 12px",
                                borderRadius: "12px",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                pointerEvents: isDragging ? "none" : "auto",
                                textShadow: isCenter
                                  ? "0 2px 4px rgba(0, 123, 255, 0.2)"
                                  : "0 1px 2px rgba(0, 0, 0, 0.1)",
                                color: isCenter
                                  ? theme?.primaryColor || "#007bff"
                                  : "#1a1a1a",
                                letterSpacing: isCenter ? "-0.5px" : "0px",
                              }}
                              className="category-title"
                              onMouseEnter={(e) => {
                                if (!isDragging) {
                                  e.currentTarget.style.backgroundColor = `${
                                    theme?.primaryColor || "#007bff"
                                  }10`;
                                  e.currentTarget.style.transform =
                                    "scale(1.02)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              {category.name}
                            </h3>
                          </Link>

                          <p
                            style={{
                              color: isCenter ? "#444" : "#666",
                              textAlign: "center",
                              margin: "0 0 5px 0",
                              fontSize: isCenter ? "16px" : "14px",
                              fontWeight: isCenter ? "500" : "400",
                              lineHeight: isCenter ? "1.4" : "1.5",
                              height: "42px",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              pointerEvents: "none",
                              opacity: isCenter ? 1 : 0.7,
                            }}
                            className="category-description"
                          >
                            {category.description || t("solution.innovative")}
                          </p>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "10px 0 0 0",
                              gap: "10px",
                              fontSize: isCenter ? "16px" : "14px",
                              color: isCenter ? "#333" : "#666",
                              fontWeight: isCenter ? "600" : "500",
                              pointerEvents: "none",
                              opacity: isCenter ? 1 : 0.7,
                            }}
                            className="category-cta"
                          >
                            <span>{t("solution.click")}</span>
                            <span
                              style={{
                                fontSize: isCenter ? "20px" : "16px",
                                color: theme?.primaryColor || "#007bff",
                                fontWeight: "700",
                                animation: isCenter
                                  ? "enhanced-bounce 2.5s infinite"
                                  : "none",
                                filter: isCenter
                                  ? "drop-shadow(0 2px 4px rgba(0, 123, 255, 0.3))"
                                  : "none",
                              }}
                              className="category-arrow"
                            >
                              →
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </Slider>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              style={{
                padding: "0 20px",
                overflow: "hidden",
              }}
            >
              <StaticGrid />
            </motion.div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @media screen and (max-width: 1440px) {
          .enhanced-carousel .slick-arrow {
            width: 50px !important;
            height: 50px !important;
          }
          .enhanced-carousel .slick-prev {
            left: -50px !important;
          }
          .enhanced-carousel .slick-next {
            right: -50px !important;
          }
        }

        @media screen and (max-width: 1200px) {
          .coverflow-container {
            padding: 0 60px !important;
          }
          .enhanced-carousel .slick-prev {
            left: -40px !important;
          }
          .enhanced-carousel .slick-next {
            right: -40px !important;
          }
        }

        @media screen and (max-width: 1024px) {
          .coverflow-container {
            padding: 0 40px !important;
          }
          .enhanced-carousel .slick-prev {
            left: -30px !important;
          }
          .enhanced-carousel .slick-next {
            right: -30px !important;
          }
        }

        @media screen and (max-width: 768px) {
          .coverflow-container {
            padding: 0 20px !important;
          }
          .enhanced-carousel .slick-arrow {
            display: none !important;
          }

          .static-horizontal-container {
            flex-direction: column !important;
            align-items: center !important;
            gap: 20px !important;
          }

          .static-horizontal-container .category-card {
            width: 280px !important;
            max-width: 90vw !important;
          }
        }

        @media screen and (max-width: 480px) {
          .static-horizontal-container .category-card {
            width: 260px !important;
            height: 400px !important;
          }
        }

        @keyframes enhanced-bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(5px);
          }
          60% {
            transform: translateX(3px);
          }
        }

        .static-card:hover .category-image {
          transform: scale(1.05) !important;
        }

        .static-card .category-title:hover {
          transform: scale(1.02) !important;
        }

        @media screen and (min-width: 1400px) {
          .static-horizontal-container {
            gap: 40px !important;
          }
        }

        .static-horizontal-container {
          max-width: 100%;
        }
      `}</style>
    </>
  );
}
