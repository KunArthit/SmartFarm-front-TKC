"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "@/context/LanguageProvider";
import backgroundImg from "../../public/images/collections/farmsuk05.png";
import Image from "next/image";

const FarmsukHero = () => {
  
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => setWindowWidth(window.innerWidth);
      const handleScroll = () => setScrollY(window.scrollY);

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "60vh",
        overflow: "hidden",
        padding: "10rem 1.5rem",
      }}
    >
      {/* Fallback background image for Next.js production */}
      <Image
        src={backgroundImg}
        alt="farmsuk background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
        aria-hidden="true"
        draggable={false}
      />
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.3), rgba(0,0,0,0), rgba(0,0,0,0.2))",
          zIndex: 1,
        }}
      />

      {/* Text Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize:
              windowWidth < 768
                ? "3rem"
                : windowWidth < 1024
                ? "4.5rem"
                : "6rem",
            fontWeight: "900",
            color: "white",
            marginBottom: "1rem",
          }}
        >
          {t("solutionhead.title1")}{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #34d399, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Farmsuk
          </span>{" "}
          {t("solutionhead.title2")}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "linear-gradient(90deg, #34d399, #22d3ee)",
              borderRadius: "2px",
            }}
          />
          <h2
            style={{
              fontSize:
                windowWidth < 768
                  ? "2rem"
                  : windowWidth < 1024
                  ? "3rem"
                  : "4rem",
              fontWeight: "700",
              color: "white",
              margin: 0,
            }}
          >
            {t("solutionhead.title3")}
          </h2>
        </div>

        <p
          style={{
            fontSize:
              windowWidth < 768
                ? "1.25rem"
                : windowWidth < 1024
                ? "1.5rem"
                : "1.875rem",
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: 300,
            marginTop: "1.5rem",
            paddingLeft: "6rem",
          }}
        >
          {t("solutionhead.title4")}
        </p>
      </div>
    </div>
  );
};

const FarmsukPage = () => {
  const [cards, setCards] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryTranslations, setCategoryTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { currentLanguageId } = useLanguage();
  const { t } = useTranslation();

  // Helper function to detect Thai language
  const isThai = (text) => {
    if (!text) return false;
    const thaiRegex = /[\u0E00-\u0E7F]/;
    return thaiRegex.test(text);
  };

  // Process displayed cards based on current language
  const displayedCards = useMemo(() => {
    if (!categoryTranslations || Object.keys(categoryTranslations).length === 0) {
      return cards; // fallback to original cards
    }

    // Group categories by ID and select appropriate language
    const processedCards = [];
    const processedIds = new Set();

    Object.values(categoryTranslations).forEach(translations => {
      if (processedIds.has(translations.id)) return;
      
      // Select translation based on current language
      let selectedTranslation = null;
      
      if (currentLanguageId === "th") {
        selectedTranslation = translations.th || translations.en || Object.values(translations)[0];
      } else {
        selectedTranslation = translations.en || translations.th || Object.values(translations)[0];
      }

      if (selectedTranslation) {
        processedCards.push({
          id: translations.id,
          title: selectedTranslation.title,
          image: selectedTranslation.image,
        });
        processedIds.add(translations.id);
      }
    });

    return processedCards.sort((a, b) => a.id - b.id);
  }, [categoryTranslations, currentLanguageId, cards]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`${apiEndpoint}/solution-categories/`);
        const data = await res.json();
        const filtered = data.filter((item) => item.active === 1);

        // console.log("Fetched categories:", filtered);

        // Process data for multi-language support
        if (Array.isArray(filtered) && filtered.length > 0) {
          // Check if data contains multiple language entries
          const translationGroups = {};
          const simpleCards = [];

          filtered.forEach(item => {
            const categoryId = parseInt(item.category_id);
            const lang = isThai(item.name) ? "th" : "en";
            
            if (!translationGroups[categoryId]) {
              translationGroups[categoryId] = { id: categoryId };
            }
            
            translationGroups[categoryId][lang] = {
              title: item.name,
              image: item.image_url || "/placeholder.png",
            };
          });

          // Check if we have multi-language data
          const hasMultiLanguage = Object.values(translationGroups).some(group => 
            group.th && group.en
          );

          if (hasMultiLanguage) {
            setCategoryTranslations(translationGroups);
          } else {
            // Fallback to simple format
            const formatted = filtered
              .map((item) => ({
                id: parseInt(item.category_id),
                title: item.name,
                image: item.image_url || "/placeholder.png",
              }))
              .sort((a, b) => a.id - b.id);
            
            setCards(formatted);
          }
        }

        setAllCategories(filtered);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  const getItemsPerSlide = () => {
    if (windowWidth < 768) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const itemsPerSlide = getItemsPerSlide();
  const cardsToUse = displayedCards.length > 0 ? displayedCards : cards;
  const totalSlides = Math.ceil(cardsToUse.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentCards = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return cardsToUse.slice(startIndex, startIndex + itemsPerSlide);
  };

  // Reset slide when language changes and cards change
  useEffect(() => {
    setCurrentSlide(0);
  }, [currentLanguageId]);

  return (
    <>
      <FarmsukHero />
      <div
        style={{
          marginTop: "-80px",
          position: "relative",
          zIndex: 10,
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 2rem",
            position: "relative",
          }}
        >
          {isLoading ? (
            <p style={{ color: "#333", textAlign: "center" }}>
              {t("common.loading") || "Loading..."}
            </p>
          ) : (
            <>
              {/* Slider Container */}
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: "1rem",
                  position: "relative",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: `${totalSlides * 100}%`,
                    transform: `translateX(-${
                      currentSlide * (100 / totalSlides)
                    }%)`,
                    transition:
                      "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div
                      key={slideIndex}
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${itemsPerSlide}, 1fr)`,
                        gap: "2rem",
                        width: `${100 / totalSlides}%`,
                        opacity: slideIndex === currentSlide ? 1 : 0.7,
                        transform:
                          slideIndex === currentSlide
                            ? "scale(1)"
                            : "scale(0.95)",
                        transition:
                          "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      }}
                    >
                      {cardsToUse
                        .slice(
                          slideIndex * itemsPerSlide,
                          (slideIndex + 1) * itemsPerSlide
                        )
                        .map((card, cardIndex) => (
                          <Link
                            key={`${slideIndex}-${cardIndex}-${currentLanguageId}`}
                            href={`/solution-detail/${card.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <div
                              style={{
                                background: "white",
                                borderRadius: "1rem",
                                overflow: "hidden",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                transition:
                                  "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                cursor: "pointer",
                                transform: "translateY(0px)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(-8px) scale(1.03)";
                                e.currentTarget.style.boxShadow =
                                  "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(0px) scale(1)";
                                e.currentTarget.style.boxShadow =
                                  "0 4px 6px rgba(0,0,0,0.1)";
                              }}
                            >
                              <div
                                style={{ padding: "1rem", textAlign: "center" }}
                              >
                                <h3
                                  style={{
                                    fontSize: "1.25rem",
                                    fontWeight: 700,
                                    color: "#374151",
                                    margin: 0,
                                    transition: "color 0.3s ease",
                                    minHeight: "1.5rem",
                                  }}
                                >
                                  {card.title}
                                </h3>
                              </div>
                              <div
                                style={{
                                  height: "160px",
                                  backgroundImage: `url(${card.image})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  margin: "0 1rem 1rem",
                                  borderRadius: "0.5rem",
                                  transition: "transform 0.4s ease",
                                }}
                              />
                            </div>
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    style={{
                      position: "absolute",
                      left: "-20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                      fontSize: "1.5rem",
                      color: "#374151",
                      zIndex: 20,
                      transition: "all 0.3s ease",
                      opacity: 0.8,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-50%) scale(1.1)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0,0,0,0.2)";
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-50%) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0,0,0,0.15)";
                      e.currentTarget.style.opacity = "0.8";
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextSlide}
                    style={{
                      position: "absolute",
                      right: "-20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                      fontSize: "1.5rem",
                      color: "#374151",
                      zIndex: 20,
                      transition: "all 0.3s ease",
                      opacity: 0.8,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-50%) scale(1.1)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0,0,0,0.2)";
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-50%) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0,0,0,0.15)";
                      e.currentTarget.style.opacity = "0.8";
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {totalSlides > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginTop: "2rem",
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      style={{
                        width: currentSlide === index ? "32px" : "12px",
                        height: "12px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor:
                          currentSlide === index ? "#34d399" : "#d1d5db",
                        cursor: "pointer",
                        transition:
                          "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        opacity: currentSlide === index ? 1 : 0.6,
                        transform:
                          currentSlide === index ? "scale(1)" : "scale(0.8)",
                      }}
                      onMouseEnter={(e) => {
                        if (currentSlide !== index) {
                          e.currentTarget.style.backgroundColor = "#9ca3af";
                          e.currentTarget.style.opacity = "0.8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentSlide !== index) {
                          e.currentTarget.style.backgroundColor = "#d1d5db";
                          e.currentTarget.style.opacity = "0.6";
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmsukPage;