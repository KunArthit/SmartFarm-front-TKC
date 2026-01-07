"use client";

import { useEffect, useState, useMemo } from "react";
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
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export default function HotProductSlide() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const [userData, setUserData] = useState(null);
  const { t, i18n } = useTranslation();

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

  // Get context functions
  const {
    addProductToCart,
    isAddedToCartProducts,
    isAddedtoWishlist,
    toggleWishlist,
  } = useContextElement();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${apiEndpoint}/products`);
        const data = await res.json();

        // เก็บข้อมูลทั้งหมด (ทั้ง TH และ EN)
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [apiEndpoint]);

  // กรองสินค้าตามภาษาปัจจุบัน
  const products = useMemo(() => {
    const currentLang = i18n.language; // 'th' หรือ 'en'

    // กรองเฉพาะสินค้าที่ is_featured === 1 และ action === "Active"
    const featuredActive = allProducts.filter(
      (item) => item.is_featured === 1 && item.action === "Active"
    );

    // จัดกลุ่มสินค้าตาม product_id
    const groupedByProductId = {};

    featuredActive.forEach((item) => {
      const productId = item.product_id;

      if (!groupedByProductId[productId]) {
        groupedByProductId[productId] = {
          th: null,
          en: null,
        };
      }

      // ตรวจสอบภาษาจาก product_name
      // ถ้ามีตัวอักษรไทย = ภาษาไทย, ไม่มี = ภาษาอังกฤษ
      const isThai = /[\u0E00-\u0E7F]/.test(item.product_name);

      if (isThai) {
        groupedByProductId[productId].th = item;
      } else {
        groupedByProductId[productId].en = item;
      }
    });

    // เลือกภาษาที่ต้องการแสดง
    const result = [];
    Object.values(groupedByProductId).forEach((group) => {
      let selectedProduct = null;

      if (currentLang === "th") {
        // ถ้าเลือกภาษาไทย ให้แสดงภาษาไทยก่อน ถ้าไม่มีให้แสดงภาษาอังกฤษ
        selectedProduct = group.th || group.en;
      } else {
        // ถ้าเลือกภาษาอังกฤษ ให้แสดงภาษาอังกฤษก่อน ถ้าไม่มีให้แสดงภาษาไทย
        selectedProduct = group.en || group.th;
      }

      if (selectedProduct) {
        result.push(selectedProduct);
      }
    });

    return result;
  }, [allProducts, i18n.language]);

  // Function to handle mouse enter (pause autoplay)
  const handleMouseEnter = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };

  // Function to handle mouse leave (resume autoplay)
  const handleMouseLeave = () => {
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
  };

  // Function to handle add to cart
  const handleAddToCart = (product) => {
    const stockQuantity = product.stock_quantity || 0;

    if (stockQuantity < 1) {
      alert(t("product.outofstock") || "This product is out of stock");
      return;
    }

    const cartProduct = {
      id: product.product_id,
      title: product.product_name,
      name: product.product_name,
      price: product.price,
      imgSrc: product.image,
      image: product.image,
      quantity: 1,
      stock_quantity: stockQuantity,
      solution_category_name: product.solution_category_name,
    };

    addProductToCart(cartProduct);
  };

  // Function to handle wishlist toggle
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

  // Placeholders for loading state
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
              color: "#FF6B35",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: 60,
                height: 4,
                background: "linear-gradient(90deg, #FF6B35, #FF8E53)",
                borderRadius: 2,
              },
            }}
          >
            🔥 {t("product.hotproducts")}
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

                const stockQuantity = product.stock_quantity || 0;
                const isOutOfStock = stockQuantity < 1;

                return (
                  <SwiperSlide key={`${product.product_id}-${i18n.language}`}>
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
                          boxShadow: "0 15px 30px rgba(255, 107, 53, 0.2)",
                        },
                        borderRadius: 2,
                        overflow: "hidden",
                        position: "relative",
                        border: "2px solid transparent",
                        background:
                          "linear-gradient(white, white) padding-box, linear-gradient(135deg, #FF6B35, #FF8E53, #FFB74D) border-box",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          top: 0,
                          left: 0,
                          background:
                            "linear-gradient(to right, rgba(255,107,53,0.1), rgba(255,142,83,0.05))",
                          transform: "translateX(-100%)",
                          transition: "transform 0.6s ease-out",
                          zIndex: 1,
                        },
                        "&:hover::before": {
                          transform: "translateX(100%)",
                        },
                        opacity: isOutOfStock ? 0.6 : 1,
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
                            background: "rgba(255,107,53,0.03)",
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
                              alt={product.product_name || "Product"}
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

                          <Chip
                            icon={
                              <LocalFireDepartmentIcon
                                sx={{
                                  fontSize: "16px !important",
                                  color: "white",
                                }}
                              />
                            }
                            label={t("product.hot")}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              background:
                                "linear-gradient(135deg, #FF6B35, #FF4500)",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.75rem",
                              height: 24,
                              borderRadius: "12px",
                              animation: "hotPulse 2s infinite",
                              boxShadow: "0 2px 8px rgba(255, 107, 53, 0.4)",
                              zIndex: 3,
                              "& .MuiChip-label": {
                                paddingX: 1,
                                letterSpacing: "0.5px",
                              },
                              "&:hover": {
                                transform: "scale(1.05)",
                                background:
                                  "linear-gradient(135deg, #FF4500, #FF6B35)",
                              },
                            }}
                          />

                          {isOutOfStock && (
                            <Chip
                              label={t("product.outofstock") || "Out of Stock"}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                background: "#f44336",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "0.75rem",
                                zIndex: 3,
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
                              color: "#FF6B35",
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
                          {product.product_name || "Unnamed Product"}
                        </Typography>

                        <Rating
                          value={4.5}
                          precision={0.5}
                          size="small"
                          readOnly
                          sx={{
                            mb: 1,
                            "& .MuiRating-iconFilled": {
                              color: "#FF6B35",
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
                            sx={{
                              background:
                                "linear-gradient(135deg, #FF6B35, #FF4500)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
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
                                      sx={{ color: "red" }}
                                    />
                                  ) : (
                                    <FavoriteBorderIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>

                              <Tooltip
                                title={
                                  isOutOfStock
                                    ? t("product.outofstock")
                                    : isInCart
                                    ? "Already in cart"
                                    : t("product.clicktoadd")
                                }
                              >
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isInCart && !isOutOfStock) {
                                      handleAddToCart(product);
                                    }
                                  }}
                                  disabled={isInCart || isOutOfStock}
                                  sx={{
                                    bgcolor: isInCart
                                      ? "success.light"
                                      : isOutOfStock
                                      ? "grey.300"
                                      : "#FF6B35",
                                    color: isInCart
                                      ? "success.main"
                                      : isOutOfStock
                                      ? "grey.500"
                                      : "white",
                                    "&:hover": {
                                      bgcolor: isInCart
                                        ? "success.light"
                                        : isOutOfStock
                                        ? "grey.300"
                                        : "#FF4500",
                                      transform:
                                        isInCart || isOutOfStock
                                          ? "none"
                                          : "translateY(-3px)",
                                    },
                                  }}
                                >
                                  <ShoppingCartIcon fontSize="small" />
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

                        @keyframes hotPulse {
                          0% {
                            box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);
                            transform: scale(1);
                          }
                          50% {
                            box-shadow: 0 0 0 8px rgba(255, 107, 53, 0);
                            transform: scale(1.02);
                          }
                          100% {
                            box-shadow: 0 0 0 0 rgba(255, 107, 53, 0);
                            transform: scale(1);
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
                  {t("product.noproduct") || "No products available"}
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
                bgcolor: "#FF6B35",
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
