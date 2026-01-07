"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";
import NoImage from "../../../public/images/NoImage.jpg";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Skeleton,
  Container,
  Stack,
  IconButton,
  Tooltip,
  Rating,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function EnhancedProductCarousel() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language; //เพิ่ม current language

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user_data");
        if (stored) {
          setUserData(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error parsing user_data:", e);
      }
    }
  }, []);

  const {
    addProductToCart,
    isAddedToCartProducts,
    isAddedtoWishlist,
    toggleWishlist,
  } = useContextElement();

  // ฟังก์ชันตรวจสอบว่าข้อความเป็นภาษาไทยหรือไม่
  const isThai = (text) => {
    return typeof text === "string" && /[\u0E00-\u0E7F]/.test(text);
  };

  // ฟังก์ชันกรองสินค้าตามภาษา
  const filterProductsByLanguage = (productsData) => {
    const uniqueProducts = new Map();

    productsData.forEach((product) => {
      const productId = product.product_id;
      const productName = product.product_name || "";
      const isThaiProduct = isThai(productName);

      // เลือกตามภาษาปัจจุบัน
      const shouldInclude =
        currentLang === "th" ? isThaiProduct : !isThaiProduct;

      if (!uniqueProducts.has(productId) && shouldInclude) {
        uniqueProducts.set(productId, product);
      }
    });

    return Array.from(uniqueProducts.values());
  };

  // Fetch products และกรองตามภาษา
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiEndpoint}/products/`);
        const data = await res.json();

        // กรองสินค้าตามภาษาปัจจุบัน
        const filteredProducts = filterProductsByLanguage(data);
        setProducts(filteredProducts);

        // console.log(
        //   `🌍 Filtered products (${currentLang}):`,
        //   filteredProducts.length
        // );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentLang]); // Re-fetch เมื่อเปลี่ยนภาษา

  const handleMouseEnter = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
  };

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.product_id,
      title: product.product_name,
      name: product.product_name,
      price: product.price,
      imgSrc: product.image,
      image: product.image,
      quantity: 1,
      stock_quantity: product.stock_quantity || 10,
      solution_category_name: product.solution_category_name,
    };

    addProductToCart(cartProduct);
  };

  const handleWishlistToggle = (product) => {
    const wishlistProduct = {
      id: product.product_id,
      title: product.product_name,
      name: product.product_name,
      price: product.price,
      imgSrc: product.image,
      image: product.image,
      solution_category_name: product.solution_category_name,
    };

    toggleWishlist(wishlistProduct);
  };

  const loadingPlaceholders = Array(4)
    .fill()
    .map((_, index) => (
      <SwiperSlide key={`loading-${index}`}>
        <Card
          elevation={2}
          sx={{ maxWidth: "100%", height: "100%", borderRadius: 2 }}
        >
          <Skeleton
            variant="rectangular"
            height={280}
            width="100%"
            animation="wave"
          />
          <CardContent>
            <Skeleton variant="text" width="80%" height={30} animation="wave" />
            <Skeleton variant="text" width="60%" height={20} animation="wave" />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Skeleton
                variant="text"
                width="40%"
                height={30}
                animation="wave"
              />
              <Skeleton
                variant="circular"
                width={36}
                height={36}
                animation="wave"
              />
            </Box>
          </CardContent>
        </Card>
      </SwiperSlide>
    ));

  return (
    <Box component="section" sx={{ py: 5, bgcolor: "background.paper" }}>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          mb={4}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            mb={1}
            align="center"
            sx={{
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: 60,
                height: 4,
                bgcolor: "primary.main",
                borderRadius: 2,
              },
            }}
          >
            {t("vision.Justforyou")}
          </Typography>
        </Stack>

        <Box
          sx={{ position: "relative" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Swiper
            dir="ltr"
            slidesPerView={4}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              960: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            loop={false}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: ".snbp299",
              nextEl: ".snbn299",
            }}
            pagination={{
              clickable: true,
              el: ".spd299",
              bulletClass: "mui-pagination-bullet",
              bulletActiveClass: "mui-pagination-bullet-active",
            }}
            onSwiper={setSwiperInstance}
            sx={{ pb: 5 }}
          >
            {isLoading ? (
              loadingPlaceholders
            ) : products.length > 0 ? (
              products.map((product) => {
                const isInWishlist = isAddedtoWishlist(product.product_id);
                const isInCart = isAddedToCartProducts(product.product_id);

                return (
                  <SwiperSlide key={product.product_id}>
                    <Card
                      elevation={1}
                      sx={{
                        height: "100%",
                        margin: 2,
                        display: "flex",
                        flexDirection: "column",
                        transition:
                          "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        "&:hover": {
                          transform: "translateY(-12px)",
                          boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                        },
                        borderRadius: 2,
                        overflow: "hidden",
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          top: 0,
                          left: 0,
                          background:
                            "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                          transform: "translateX(-100%)",
                          transition: "transform 0.6s ease-out",
                          zIndex: 1,
                        },
                        "&:hover::before": {
                          transform: "translateX(100%)",
                        },
                      }}
                    >
                      <CardActionArea
                        component={Link}
                        href={`/product-detail/${product.product_id}`}
                        sx={{
                          flexShrink: 0,
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0)",
                            transition: "background 0.3s ease",
                            zIndex: 1,
                          },
                          "&:hover::after": {
                            background: "rgba(0,0,0,0.03)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            paddingTop: "100%",
                            bgcolor: "white",
                            overflow: "hidden",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <Image
                              src={product.image || NoImage}
                              alt={product.product_name}
                              fill
                              style={{
                                objectFit: "contain",
                                objectPosition: "center",
                                padding: "8px",
                                transition: "transform 0.7s ease",
                              }}
                              className="product-image"
                              unoptimized
                            />
                          </Box>
                          {product.solution_category_name && (
                            <Chip
                              label={product.solution_category_name}
                              size="small"
                              color="primary"
                              sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                fontWeight: "medium",
                                transform: "translateY(0)",
                                opacity: 1,
                                transition:
                                  "transform 0.3s ease, opacity 0.3s ease",
                                zIndex: 2,
                                "& .MuiChip-label": {
                                  transition: "all 0.3s ease",
                                },
                                "&:hover": {
                                  "& .MuiChip-label": {
                                    letterSpacing: "0.5px",
                                  },
                                },
                              }}
                            />
                          )}
                        </Box>
                      </CardActionArea>

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          p: 2,
                          position: "relative",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            width: 0,
                            height: 2,
                            background:
                              "linear-gradient(90deg, transparent, #1976d2, transparent)",
                            transition: "width 0.3s ease, left 0.3s ease",
                          },
                          "$:hover::after": {
                            width: "80%",
                            left: "10%",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          fontWeight="medium"
                          noWrap
                          gutterBottom
                          sx={{
                            fontSize: "1.1rem",
                            transition: "color 0.3s ease, transform 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                              color: "primary.main",
                              transform: "translateX(4px)",
                            },
                          }}
                          onClick={() =>
                            window.open(
                              `/product-detail/${product.product_id}`,
                              "_self"
                            )
                          }
                        >
                          {product.product_name}
                        </Typography>

                        <Rating
                          value={4.5}
                          precision={0.5}
                          size="small"
                          readOnly
                          sx={{
                            mb: 1,
                            "& .MuiRating-icon": {
                              transition: "transform 0.2s ease",
                            },
                            "&:hover .MuiRating-icon": {
                              transform: "scale(1.2)",
                              transition:
                                "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            },
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="span"
                            fontWeight="bold"
                            color="primary.main"
                            sx={{
                              position: "relative",
                              overflow: "hidden",
                              display: "inline-block",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: 0,
                                height: 2,
                                backgroundColor: "primary.main",
                                transition: "width 0.3s ease",
                              },
                              "&:hover::after": {
                                width: "100%",
                              },
                            }}
                          >
                            ฿{" "}
                            {parseFloat(product.price).toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>

                          {userData && (
                            <Box>
                              <Tooltip
                                title={
                                  isInWishlist
                                    ? t("product.clicktoremovesave")
                                    : t("product.clicktosave")
                                }
                                TransitionProps={{ timeout: 600 }}
                                enterNextDelay={500}
                              >
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleWishlistToggle(product);
                                  }}
                                  sx={{
                                    mr: 1,
                                    bgcolor: isInWishlist
                                      ? "red.50"
                                      : "grey.100",
                                    color: isInWishlist ? "red" : "inherit",
                                    transition:
                                      "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                      bgcolor: isInWishlist
                                        ? "red.100"
                                        : "grey.200",
                                      transform: "rotate(12deg) scale(1.1)",
                                    },
                                  }}
                                >
                                  {isInWishlist ? (
                                    <FavoriteIcon
                                      fontSize="small"
                                      sx={{
                                        transition:
                                          "color 0.3s ease, transform 0.3s ease",
                                        color: "red",
                                      }}
                                    />
                                  ) : (
                                    <FavoriteBorderIcon
                                      fontSize="small"
                                      sx={{
                                        transition:
                                          "color 0.3s ease, transform 0.3s ease",
                                        "&:hover": {
                                          color: "red",
                                          transform: "scale(1.1)",
                                        },
                                      }}
                                    />
                                  )}
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title={
                                  isInCart
                                    ? t("product.alreadyincart")
                                    : t("product.clicktoadd")
                                }
                                TransitionProps={{ timeout: 600 }}
                                enterNextDelay={500}
                              >
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isInCart) {
                                      handleAddToCart(product);
                                    }
                                  }}
                                  disabled={isInCart}
                                  sx={{
                                    bgcolor: isInCart
                                      ? "success.light"
                                      : "primary.light",
                                    color: isInCart
                                      ? "success.main"
                                      : "primary.main",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition:
                                      "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                      bgcolor: isInCart
                                        ? "success.light"
                                        : "primary.main",
                                      color: isInCart
                                        ? "success.main"
                                        : "white",
                                      transform: isInCart
                                        ? "none"
                                        : "translateY(-3px)",
                                    },
                                    "&::after": {
                                      content: '""',
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      width: 0,
                                      height: 0,
                                      backgroundColor:
                                        "rgba(255, 255, 255, 0.2)",
                                      borderRadius: "50%",
                                      transform: "translate(-50%, -50%)",
                                      transition:
                                        "width 0.6s ease-out, height 0.6s ease-out",
                                    },
                                    "&:hover::after": {
                                      width: isInCart ? 0 : 120,
                                      height: isInCart ? 0 : 120,
                                    },
                                  }}
                                >
                                  <ShoppingCartIcon
                                    fontSize="small"
                                    sx={{
                                      position: "relative",
                                      zIndex: 2,
                                      transition: "transform 0.3s ease",
                                      "&:hover": {
                                        transform: isInCart
                                          ? "none"
                                          : "scale(1.1)",
                                      },
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>
                      </CardContent>

                      <style jsx global>{`
                        .product-image {
                          transform: scale(1);
                        }

                        .MuiCard-root:hover .product-image {
                          transform: scale(1.08);
                        }

                        @keyframes pulse {
                          0% {
                            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
                          }
                          70% {
                            box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
                          }
                          100% {
                            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
                          }
                        }
                      `}</style>
                    </Card>
                  </SwiperSlide>
                );
              })
            ) : (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  width: "100%",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {t("product.noproductsavailable") || "No products available"}
                </Typography>
              </Box>
            )}
          </Swiper>

          <Box
            className="spd299"
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              "& .mui-pagination-bullet": {
                width: 8,
                height: 8,
                display: "inline-block",
                borderRadius: "50%",
                bgcolor: "grey.300",
                mx: 0.5,
                transition: "all 0.3s",
                cursor: "pointer",
              },
              "& .mui-pagination-bullet-active": {
                bgcolor: "primary.main",
                width: 24,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
