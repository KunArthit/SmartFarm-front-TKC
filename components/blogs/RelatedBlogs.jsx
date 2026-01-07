"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { t } from "i18next";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Skeleton,
  IconButton,
  Chip,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// MUI Icons
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const RelatedBlog = ({ currentPostId, categoryId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_ENDPOINT;

  // Add fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached, setting loading to false");
        setIsLoading(false);
        setError("Request timeout - please try again");
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached, setting loading to false");
        setIsLoading(false);
        setError("Request timeout - please try again");
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        if (!apiEndpoint) {
          console.error("API endpoint is not defined");
          setError("API endpoint not configured");
          setIsLoading(false);
          return;
        }

        const apiUrl = `${apiEndpoint}/blog`;
        console.log("Fetching from URL:", apiUrl);

        const response = await fetch(apiUrl);
        console.log("Response status:", response);

        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API data:", data);
        console.log("Data type:", typeof data);
        console.log("Is array:", Array.isArray(data));

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          setError("Invalid data format received");
          setIsLoading(false);
          return;
        }

        console.log("Total posts received:", data.length);

        // Filter out current post and get published posts only
        let relatedBlogs = data.filter((blog) => {
          const blogId = blog.post_id || blog.id;
          const isNotCurrent = blogId !== currentPostId;
          const isPublished = blog.status === "published";

          console.log(
            `Blog ${blogId}: isNotCurrent=${isNotCurrent}, isPublished=${isPublished}, status=${blog.status}`
          );

          return isNotCurrent && isPublished;
        });

        console.log(
          "Filtered blogs (excluding current and unpublished):",
          relatedBlogs.length
        );

        // Prioritize posts from same category if categoryId is provided
        if (categoryId) {
          const sameCategoryBlogs = relatedBlogs.filter((blog) => {
            const isSameCategory = blog.category_id === categoryId;
            console.log(
              `Blog ${blog.post_id || blog.id}: category_id=${
                blog.category_id
              }, same category=${isSameCategory}`
            );
            return isSameCategory;
          });
          const otherBlogs = relatedBlogs.filter(
            (blog) => blog.category_id !== categoryId
          );

          console.log("Same category blogs:", sameCategoryBlogs.length);
          console.log("Other category blogs:", otherBlogs.length);

          relatedBlogs = [...sameCategoryBlogs, ...otherBlogs];
        }

        // Limit to 6 posts
        const finalBlogs = relatedBlogs.slice(0, 6);
        console.log("Final blogs to display:", finalBlogs.length);
        console.log("Final blogs:", finalBlogs);

        setBlogs(finalBlogs);
      } catch (error) {
        console.error("Error fetching related blogs:", error);
        setError(error.message);
      } finally {
        console.log("Setting loading to false");
        setIsLoading(false);
      }
    };

    console.log("useEffect triggered, currentPostId:", currentPostId);

    if (currentPostId) {
      fetchRelatedBlogs();
    } else {
      console.log("No currentPostId provided, skipping fetch");
      setIsLoading(false);
    }
  }, [currentPostId, categoryId, apiEndpoint]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  };

  const handleBlogClick = (postId) => {
    router.push(`/blog-detail/${postId}`);
  };

  const handleCategoryClick = (categorySlug) => {
    router.push(`/category/${categorySlug}`);
  };

  // Debug component props
  console.log("RelatedBlog component rendered with:", {
    currentPostId,
    categoryId,
    apiEndpoint,
    isLoading,
    blogs: blogs.length,
  });
  const loadingPlaceholders = Array(3)
    .fill()
    .map((_, index) => (
      <SwiperSlide key={`loading-${index}`}>
        <Card
          elevation={0}
          sx={{
            height: "100%",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            overflow: "hidden",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={220}
            animation="wave"
          />
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="50%" height={16} />
            </Box>
          </CardContent>
        </Card>
      </SwiperSlide>
    ));

  // Error display with retry button
  if (error) {
    return (
      <Box
        sx={{
          py: 6,
          textAlign: "center",
          bgcolor: "#ffffff",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h5" sx={{ color: "#d32f2f", mb: 2 }}>
            {t("blog.unload")}
          </Typography>
          <Typography sx={{ color: "#666666", mb: 3 }}>{error}</Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: "#111111",
              color: "#ffffff",
              "&:hover": {
                bgcolor: "#333333",
              },
            }}
          >
            {t("blog.retry")}
          </Button>
        </Container>
      </Box>
    );
  }

  // Don't render if no blogs and not loading
  if (!isLoading && blogs.length === 0 && !error) {
    console.log("No blogs to display, component will not render");
    return (
      <Box sx={{ py: 4, textAlign: "center", bgcolor: "#ffffff" }}>
        <Typography variant="body1" sx={{ color: "#666666" }}>
          {t("blog.notblog")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        bgcolor: "#ffffff",
        borderTop: "1px solid #f0f0f0",
        position: "relative",
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#111111",
                mb: 1,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              {t("blog.related")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666666",
                fontSize: "1.125rem",
              }}
            >
              {t("blog.stories")}
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                className="prev-blog-btn"
                sx={{
                  bgcolor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  color: "#666666",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#111111",
                    color: "#111111",
                  },
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                className="next-blog-btn"
                sx={{
                  bgcolor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  color: "#666666",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#111111",
                    color: "#111111",
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Swiper Carousel */}
        <Box
          sx={{
            "& .swiper-pagination": {
              bottom: -5,
              "& .swiper-pagination-bullet": {
                width: 8,
                height: 8,
                backgroundColor: "#cccccc",
                opacity: 0.7,
                transition: "all 0.3s ease",
              },
              "& .swiper-pagination-bullet-active": {
                opacity: 1,
                width: 24,
                borderRadius: 4,
                backgroundColor: "#111111",
              },
            },
          }}
        >
          <Swiper
            spaceBetween={24}
            slidesPerView={isTablet ? (isMobile ? 1 : 2) : 3}
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: ".prev-blog-btn",
              nextEl: ".next-blog-btn",
            }}
            pagination={{
              clickable: true,
              el: ".blog-pagination",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            style={{ paddingBottom: 40 }}
          >
            {isLoading
              ? loadingPlaceholders
              : blogs.map((blog, index) => (
                  <SwiperSlide key={blog.post_id || blog.id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#111111",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          transform: "translateY(-4px)",
                        },
                      }}
                      onClick={() => handleBlogClick(blog.post_id || blog.id)}
                    >
                      {/* Image Section */}
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="div"
                          sx={{
                            height: 220,
                            position: "relative",
                            overflow: "hidden",
                            bgcolor: "#f5f5f5",
                          }}
                        >
                          <Image
                            src={
                              blog.featured_image
                                ? `${IMAGE_BASE_URL}${blog.featured_image}`
                                : "/images/blog/blog-placeholder.jpg"
                            }
                            alt={blog.title}
                            fill
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.6s ease",
                            }}
                            className="blog-image"
                          />
                        </CardMedia>

                        {/* Category Badge */}
                        {blog.category && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 16,
                              left: 16,
                              zIndex: 2,
                            }}
                          >
                            <Chip
                              label={blog.category.name}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryClick(blog.category.slug);
                              }}
                              sx={{
                                bgcolor: "#ffffff",
                                color: "#333333",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                "&:hover": {
                                  bgcolor: "#f0f0f0",
                                },
                              }}
                            />
                          </Box>
                        )}

                        {/* Read Article Button Overlay */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            padding: 2,
                            zIndex: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 500,
                              bgcolor: "#ffffff",
                              color: "#111111",
                              "&:hover": {
                                bgcolor: "#f0f0f0",
                              },
                            }}
                          >
                            {t("blog.readmore")}
                          </Button>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        {/* Title */}
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            color: "#111111",
                            mb: 2,
                            fontSize: "1.125rem",
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            transition: "color 0.2s",
                            "&:hover": { color: "#666666" },
                          }}
                        >
                          {blog.title}
                        </Typography>

                        {/* Excerpt */}
                        {blog.excerpt && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#666666",
                              mb: 2,
                              lineHeight: 1.6,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              fontFamily:
                                "'Sarabun', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            }}
                          >
                            {blog.excerpt}
                          </Typography>
                        )}

                        <Divider sx={{ my: 2, borderColor: "#f0f0f0" }} />

                        {/* Meta Information */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#999999",
                              fontSize: "0.875rem",
                            }}
                          >
                            {blog.author
                              ? `${blog.author.first_name} ${blog.author.last_name}`
                              : "Admin"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#999999",
                              fontSize: "0.875rem",
                            }}
                          >
                            {formatDate(blog.published_at)}
                          </Typography>
                        </Stack>

                        {/* Learn More Button */}
                        <Button
                          color="primary"
                          endIcon={<ArrowForwardIcon fontSize="small" />}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            p: 0,
                            mt: 2,
                            color: "#111111",
                            "&:hover": {
                              bgcolor: "transparent",
                              color: "#666666",
                            },
                          }}
                        >
                          {t("blog.learnmore")}
                        </Button>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
          </Swiper>

          <Box
            className="blog-pagination"
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 2,
            }}
          />
        </Box>
      </Container>

      <style jsx global>{`
        .blog-image {
          transition: transform 0.6s ease;
        }

        .swiper-slide:hover .blog-image {
          transform: scale(1.05);
        }
      `}</style>
    </Box>
  );
};

export default RelatedBlog;
