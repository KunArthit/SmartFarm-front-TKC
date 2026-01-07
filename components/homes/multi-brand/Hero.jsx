"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";

import {
  Box,
  Typography,
  Container,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function Hero() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  // Content data - single text content
  const heroContent = {
    title: t("hero.title"),
    subtitle: t("hero.subtitle"),
    description: t("hero.description"),
    ctaText: t("hero.ctaAbout"),
    ctaSecondary: t("hero.ctaSolutions"),
  };

  // Background images array - multiple images
  const backgroundImages = [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=2000&q=80",
  ];

  useEffect(() => {
    // Simulate API call
    const loadSlides = async () => {
      setIsLoading(true);
      try {
        // Simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Create slides array from background images
        const slidesData = backgroundImages.map((image, index) => ({
          id: index + 1,
          backgroundImage: image,
          ...heroContent, // Spread the same content for all slides
        }));

        setSlides(slidesData);
      } catch (error) {
        console.error("Error loading slides:", error);
        // Fallback
        const fallbackSlides = backgroundImages.map((image, index) => ({
          id: index + 1,
          backgroundImage: image,
          ...heroContent,
        }));
        setSlides(fallbackSlides);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlides();
  }, []);

  // Go to next or previous slide
  const handleNavigation = (direction) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      if (direction === "next") {
        swiperRef.current.swiper.slideNext();
      } else {
        swiperRef.current.swiper.slidePrev();
      }
    }
  };

  // Handle slide change to update active index
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  // Scroll down to next section
  const scrollToNextSection = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "100vh", sm: "100vh" },
        overflow: "hidden",
        bgcolor: "black",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f5f5f5",
          }}
        >
          <CircularProgress color="primary" size={60} thickness={4} />
        </Box>
      ) : (
        <>
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            effect="fade"
            speed={1000}
            loop={true}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: !isMobile, // Only pause on desktop
            }}
            modules={[Autoplay, EffectFade]}
            onSlideChange={handleSlideChange}
            allowTouchMove={true}
            touchRatio={1}
            touchAngle={45}
            grabCursor={true}
            className="hero-swiper"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                  }}
                >
                  {/* Background Image with Gradient Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: 0,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
                        zIndex: 1,
                      },
                    }}
                  >
                    <Image
                      src={slide.backgroundImage}
                      alt={`${slide.title} - Image ${index + 1}`}
                      fill
                      priority={index === 0}
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </Box>

                  {/* Content Container - Same content for all slides */}
                  <Container
                    maxWidth="xl"
                    sx={{
                      height: "100%",
                      position: "relative",
                      zIndex: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      container
                      spacing={6}
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* Text Content - Centered */}
                      <Grid
                        item
                        xs={12}
                        md={8}
                        lg={6}
                        sx={{
                          ml: { xs: 0, md: "5rem" },
                          px: { xs: 2, sm: 3, md: 0 },
                        }}
                      >
                        <Box
                          sx={{
                            textAlign: "center",
                            maxWidth: { xs: "100%", sm: "600px", md: "800px" },
                            mx: "auto",
                          }}
                        >
                          {/* Main Title - Static (no animation key) */}
                          <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          >
                            <Typography
                              variant="h1"
                              component="h1"
                              sx={{
                                fontWeight: 900,
                                color: "white",
                                fontSize: {
                                  xs: "2.5rem",
                                  sm: "3.5rem",
                                  md: "5rem",
                                  lg: "6rem",
                                  xl: "7rem",
                                },
                                lineHeight: { xs: 1.1, md: 0.9 },
                                textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                                mb: { xs: 2, md: 3 },
                                letterSpacing: "-0.02em",
                              }}
                            >
                              {heroContent.title}
                            </Typography>
                          </motion.div>

                          {/* Subtitle - Static */}
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          >
                            <Typography
                              variant="h4"
                              component="h2"
                              sx={{
                                color: "#FFD700",
                                fontWeight: 600,
                                mb: { xs: 3, md: 4 },
                                fontSize: {
                                  xs: "1rem",
                                  sm: "1.2rem",
                                  md: "1.5rem",
                                  lg: "2rem",
                                },
                                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                lineHeight: { xs: 1.4, md: 1.3 },
                                px: { xs: 1, sm: 0 },
                              }}
                            >
                              {heroContent.subtitle}
                            </Typography>
                          </motion.div>

                          {/* Description - Static */}
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            <Typography
                              variant="h6"
                              component="p"
                              sx={{
                                color: "rgba(255,255,255,0.9)",
                                fontWeight: 300,
                                mb: { xs: 4, md: 5 },
                                textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                lineHeight: { xs: 1.5, md: 1.6 },
                                fontSize: {
                                  xs: "0.9rem",
                                  sm: "1rem",
                                  md: "1.1rem",
                                  lg: "1.2rem",
                                },
                                maxWidth: {
                                  xs: "100%",
                                  sm: "500px",
                                  md: "600px",
                                },
                                mx: "auto",
                                px: { xs: 1, sm: 0 },
                              }}
                            >
                              {heroContent.description}
                            </Typography>
                          </motion.div>

                          {/* CTA Buttons - Static */}
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: { xs: 2, sm: 2 },
                                justifyContent: "center",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: "center",
                                px: { xs: 2, sm: 0 },
                              }}
                            >
                              <Link href="/about-us" passHref>
                                <Button
                                  variant="contained"
                                  size={isMobile ? "medium" : "large"}
                                  sx={{
                                    px: { xs: 3, sm: 4 },
                                    py: { xs: 1.2, sm: 1.5 },
                                    borderRadius: 50,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                    bgcolor: "#2196F3",
                                    color: "white",
                                    minWidth: { xs: "200px", sm: "auto" },
                                    boxShadow:
                                      "0 8px 32px rgba(33, 150, 243, 0.3)",
                                    "&:hover": {
                                      bgcolor: "#1976D2",
                                      boxShadow:
                                        "0 12px 40px rgba(33, 150, 243, 0.4)",
                                    },
                                  }}
                                >
                                  {heroContent.ctaText}
                                </Button>
                              </Link>

                              <Link href="/all-solution" passHref>
                                <Button
                                  variant="outlined"
                                  size={isMobile ? "medium" : "large"}
                                  sx={{
                                    px: { xs: 3, sm: 4 },
                                    py: { xs: 1.2, sm: 1.5 },
                                    borderRadius: 50,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                    borderColor: "rgba(255,255,255,0.5)",
                                    color: "white",
                                    minWidth: { xs: "200px", sm: "auto" },
                                    "&:hover": {
                                      borderColor: "white",
                                      bgcolor: "rgba(255,255,255,0.1)",
                                    },
                                  }}
                                >
                                  {heroContent.ctaSecondary}
                                </Button>
                              </Link>
                            </Box>
                          </motion.div>
                        </Box>
                      </Grid>
                    </Grid>
                  </Container>

                  {/* Navigation Controls - Hidden on mobile, visible on tablet+ */}
                  {!isMobile && slides.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "50%",
                        left: 0,
                        right: 0,
                        transform: "translateY(50%)",
                        display: "flex",
                        justifyContent: "space-between",
                        px: { sm: 2, md: 3 },
                        zIndex: 10,
                      }}
                    >
                      <IconButton
                        onClick={() => handleNavigation("prev")}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.15)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.25)",
                            transform: "scale(1.1)",
                          },
                          width: { sm: 48, md: 56 },
                          height: { sm: 48, md: 56 },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <KeyboardArrowLeftIcon
                          fontSize={isTablet ? "medium" : "large"}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => handleNavigation("next")}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.15)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.25)",
                            transform: "scale(1.1)",
                          },
                          width: { sm: 48, md: 56 },
                          height: { sm: 48, md: 56 },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <KeyboardArrowRightIcon
                          fontSize={isTablet ? "medium" : "large"}
                        />
                      </IconButton>
                    </Box>
                  )}

                  {/* Scroll Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: { xs: 30, sm: 40 },
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      onClick={scrollToNextSection}
                      sx={{
                        color: "white",
                        animation: "bounce 2s infinite",
                        bgcolor: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.2)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <KeyboardArrowDownIcon
                        fontSize={isMobile ? "medium" : "large"}
                      />
                    </IconButton>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Slide Counter - Responsive positioning */}
          {slides.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                top: { xs: 20, sm: 30, md: 40 },
                right: { xs: 20, sm: 30, md: 40 },
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                color: "white",
                bgcolor: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                borderRadius: { xs: 1.5, md: 2 },
                px: { xs: 1.5, md: 2 },
                py: { xs: 0.5, md: 1 },
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="span"
                fontWeight="bold"
                sx={{
                  mr: { xs: 0.5, md: 1 },
                  color: "#FFD700",
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </Typography>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                component="span"
                fontWeight="300"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                }}
              >
                /{String(slides.length).padStart(2, "0")}
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Global styles */}
      <style jsx global>{`
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .hero-swiper {
          height: 100%;
        }

        .hero-swiper .swiper-slide {
          height: 100vh;
        }

        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          .hero-swiper {
            touch-action: pan-y;
          }

          .hero-swiper .swiper-slide {
            min-height: 100vh;
            display: flex;
            align-items: center;
          }

          /* Ensure text doesn't get too small on very small screens */
          @media (max-width: 320px) {
            .hero-swiper h1 {
              font-size: 2rem !important;
            }
            .hero-swiper h2 {
              font-size: 0.9rem !important;
            }
            .hero-swiper h6 {
              font-size: 0.8rem !important;
            }
          }
        }

        /* Tablet optimizations */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-swiper .swiper-slide {
            padding: 0 2rem;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
          .hero-bullet {
            border-width: 1px;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hero-bullet {
            min-width: 44px;
            min-height: 44px;
          }

          .hero-swiper .swiper-pagination-bullet {
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>
    </Box>
  );
}
