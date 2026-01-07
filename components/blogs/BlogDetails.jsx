"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Box,
  Container,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Card,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Facebook,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageProvider";
import { format } from "date-fns";

// API endpoint configuration
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function BlogDetails({ blog, postId }) {
  const [loading, setLoading] = useState(!blog);
  const [error, setError] = useState(null);
  const [blogData, setBlogData] = useState(blog || null);

  const [allPosts, setAllPosts] = useState([]);
  const [blogTranslations, setBlogTranslations] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_ENDPOINT;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const { currentLanguageId } = useLanguage();
  const { t } = useTranslation();

  // Helper function to detect Thai language
  const isThai = (text) => {
    if (!text) return false;
    const thaiRegex = /[\u0E00-\u0E7F]/;
    return thaiRegex.test(text);
  };

  // Helper function to validate and construct image URL
  const getValidImageUrl = (
    imagePath,
    fallbackUrl = "/images/blog/blog-detail.jpg"
  ) => {
    try {
      if (!imagePath) return fallbackUrl;

      if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        new URL(imagePath);
        return imagePath;
      }

      if (IMAGE_BASE_URL) {
        const fullUrl = `${IMAGE_BASE_URL.replace(
          /\/$/,
          ""
        )}/${imagePath.replace(/^\//, "")}`;
        new URL(fullUrl);
        return fullUrl;
      }

      if (imagePath.startsWith("/")) {
        return imagePath;
      }

      return fallbackUrl;
    } catch (e) {
      console.warn("Invalid image URL:", imagePath, e);
      return fallbackUrl;
    }
  };

  useEffect(() => {
    if (blog) {
      // จัดการข้อมูลแปลภาษาจาก JSON array ที่ส่งมา
      if (Array.isArray(blog)) {
        const translations = {};
        blog.forEach((post) => {
          const lang = isThai(post.title) ? "th" : "en";
          translations[lang] = post;
        });
        setBlogTranslations(translations);
        setBlogData(blog[0]);
        fetchAdjacentPosts(blog[0].post_id || blog[0].id);
      } else {
        const lang = isThai(blog.title) ? "th" : "en";
        setBlogTranslations({ [lang]: blog });
        setBlogData(blog);
        fetchAdjacentPosts(blog.post_id || blog.id);
      }

      setLoading(false);
      return;
    }

    const fetchBlogPost = async () => {
      try {
        if (!postId) {
          throw new Error("No post ID provided");
        }
        const response = await fetch(`${apiEndpoint}/blog/${postId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blog post: ${response.status}`);
        }

        const data = await response.json();

        const translations = {};
        if (Array.isArray(data)) {
          data.forEach((post) => {
            const lang = isThai(post.title) ? "th" : "en";
            translations[lang] = post;
          });
          setBlogTranslations(translations);
          setBlogData(data[0]);
          fetchAdjacentPosts(data[0].post_id || data[0].id);
        } else {
          const lang = isThai(data.title) ? "th" : "en";
          translations[lang] = data;
          setBlogTranslations(translations);
          setBlogData(data);
          fetchAdjacentPosts(data.post_id || data.id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [blog, postId]);

  const displayedBlog = useMemo(() => {
    if (!blogData) return null;

    if (blogData.translations && Array.isArray(blogData.translations)) {
      const lang = currentLanguageId === "en" ? "en" : "th";
      let translation = blogData.translations.find((t) => t.lang === lang);
      if (!translation) translation = blogData.translations[0];

      return {
        ...blogData,
        title: translation.title || "Untitled",
        content: translation.content || "",
        excerpt: translation.excerpt || "",
      };
    }

    return blogData;
  }, [blogData, currentLanguageId]);
  // Helper functions to get the correct post based on current language
  const getDisplayedPrevPost = useMemo(() => {
    if (!prevPost) return null;
    if (!Array.isArray(prevPost)) return prevPost;

    const selectedPost = prevPost.find(
      (post) =>
        (currentLanguageId === "th" && isThai(post.title)) ||
        (currentLanguageId === "en" && !isThai(post.title))
    );

    return selectedPost || prevPost[0];
  }, [prevPost, currentLanguageId]);

  const getDisplayedNextPost = useMemo(() => {
    if (!nextPost) return null;
    if (!Array.isArray(nextPost)) return nextPost;

    const selectedPost = nextPost.find(
      (post) =>
        (currentLanguageId === "th" && isThai(post.title)) ||
        (currentLanguageId === "en" && !isThai(post.title))
    );

    return selectedPost || nextPost[0];
  }, [nextPost, currentLanguageId]);

  // Function to fetch previous and next posts with language consideration
  const fetchAdjacentPosts = async (currentPostId) => {
    if (!currentPostId) return;

    try {
      const response = await fetch(`${apiEndpoint}/blog`);

      if (!response.ok) {
        throw new Error(`Failed to fetch blog list: ${response.status}`);
      }

      const posts = await response.json();

      if (!Array.isArray(posts)) {
        console.warn("Expected array of posts but received:", posts);
        return;
      }

      setAllPosts(posts);

      // กรองโพสต์เฉพาะเฉพาะ post_id ที่ไม่ซ้ำกัน
      const uniquePosts = posts.reduce((acc, post) => {
        const existingPost = acc.find((p) => p.post_id === post.post_id);
        if (!existingPost) {
          acc.push(post);
        }
        return acc;
      }, []);

      const currentIndex = uniquePosts.findIndex(
        (post) => (post.post_id || post.id) == currentPostId
      );

      if (currentIndex === -1) {
        console.warn("Current post not found in posts list");
        return;
      }

      // Set previous post if available
      if (currentIndex > 0) {
        const prevPostId = uniquePosts[currentIndex - 1].post_id;
        const prevPostLanguages = posts.filter(
          (post) => post.post_id === prevPostId
        );
        setPrevPost(prevPostLanguages);
      } else {
        setPrevPost(null);
      }

      // Set next post if available
      if (currentIndex < uniquePosts.length - 1) {
        const nextPostId = uniquePosts[currentIndex + 1].post_id;
        const nextPostLanguages = posts.filter(
          (post) => post.post_id === nextPostId
        );
        setNextPost(nextPostLanguages);
      } else {
        setNextPost(null);
      }
    } catch (err) {
      console.error("Error fetching adjacent posts:", err);
    }
  };

  // Check if we should display a loading or error message
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#ffffff",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={48} sx={{ color: "#333333" }} />
          <Typography variant="h6" sx={{ color: "#666666" }}>
            {t("blog.loading")}
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#ffffff",
          p: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          <Typography variant="h6"> {t("blog.errorload")} </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  if (!displayedBlog) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h6" sx={{ color: "#666666" }}>
          {t("blog.notfound")}
        </Typography>
      </Box>
    );
  }

  // Get the post ID for navigation links
  const getPostId = (post) => {
    return post.post_id || post.id;
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(displayedBlog.title);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  const handleCategoryClick = () => {
    if (displayedBlog.category?.slug) {
      router.push(`/category/${displayedBlog.category.slug}`);
    }
  };

  const handleNavigation = (postId) => {
    router.push(`/blog-detail/${postId}`);
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", position: "relative", zIndex: 1 }}>
      <Container
        maxWidth="md"
        sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 8, pt: 2 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 4,
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1.2,
              color: "#111111",
            }}
          >
            {displayedBlog.title}
          </Typography>

          {/* Meta Information */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mb: 4 }}
          >
            <Typography variant="body2" sx={{ color: "#666666" }}>
              {t("blog.by")}{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{ fontWeight: 600, color: "#111111" }}
              >
                {displayedBlog.author
                  ? `${displayedBlog.author.first_name} ${displayedBlog.author.last_name}`
                  : "Admin"}
              </Typography>
            </Typography>
            <Box
              sx={{
                width: 4,
                height: 4,
                bgcolor: "#cccccc",
                borderRadius: "50%",
                display: { xs: "none", sm: "block" },
              }}
            />
            <Typography variant="body2" sx={{ color: "#666666" }}>
              {displayedBlog?.published_at
                ? format(new Date(displayedBlog.published_at), "dd-MM-yyyy")
                : "-"}{" "}
            </Typography>
          </Stack>

          {/* Excerpt */}

          {/* Featured Image */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 250, md: 400 },
              mb: 6,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "#f5f5f5",
            }}
          >
            <Image
              src={getValidImageUrl(displayedBlog.featured_image)}
              alt={displayedBlog.title || "Blog post image"}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
            />
          </Box>
        </Box>

        {/* Blog Content */}
        <Box
          sx={{
            mb: 12,
            fontFamily:
              "'Sarabun', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              fontWeight: 600,
              mt: 4,
              mb: 2,
              color: "#111111",
            },
            "& h1": { fontSize: "2.25rem", lineHeight: 1.2 },
            "& h2": { fontSize: "1.875rem", lineHeight: 1.3 },
            "& h3": { fontSize: "1.5rem", lineHeight: 1.4 },
            "& h4": { fontSize: "1.25rem", lineHeight: 1.5 },
            "& p": {
              mb: 3,
              lineHeight: 2,
              fontSize: "1.125rem",
              color: "#444444",
            },
            "& a": {
              color: "#111111",
              textDecoration: "underline",
              textDecorationColor: "#cccccc",
              textUnderlineOffset: "2px",
              "&:hover": {
                textDecorationColor: "#111111",
              },
            },
            "& blockquote": {
              borderLeft: "4px solid #111111",
              pl: 3,
              my: 4,
              fontStyle: "italic",
              color: "#555555",
            },
            "& ul, & ol": {
              my: 3,
              pl: 3,
              "& li": {
                mb: 1,
                color: "#444444",
              },
            },
            "& img": {
              borderRadius: 1,
              my: 4,
              maxWidth: "100%",
              height: "auto",
            },
            "& code": {
              bgcolor: "#f1f3f4",
              p: "2px 6px",
              borderRadius: 0.5,
              fontSize: "0.875em",
              color: "#333333",
            },
            "& pre": {
              bgcolor: "#1a1a1a",
              color: "#f5f5f5",
              p: 3,
              borderRadius: 1,
              overflow: "auto",
              my: 4,
              "& code": {
                bgcolor: "transparent",
                p: 0,
                color: "#f5f5f5",
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: displayedBlog.content }}
        />

        {/* Footer Section */}
        <Box component="footer" sx={{ pb: 8, mt: 8 }}>
          <Divider sx={{ mb: 8, borderColor: "#e0e0e0" }} />

          {/* Social Share */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 12 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#111111" }}>
              {t("blog.share")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => handleShare("facebook")}
                sx={{
                  border: "1px solid #e0e0e0",
                  color: "#666666",
                  "&:hover": {
                    borderColor: "#111111",
                    color: "#111111",
                    bgcolor: "transparent",
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                onClick={() => handleShare("twitter")}
                sx={{
                  border: "1px solid #e0e0e0",
                  color: "#666666",
                  "&:hover": {
                    borderColor: "#111111",
                    color: "#111111",
                    bgcolor: "transparent",
                  },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                onClick={() => handleShare("linkedin")}
                sx={{
                  border: "1px solid #e0e0e0",
                  color: "#666666",
                  "&:hover": {
                    borderColor: "#111111",
                    color: "#111111",
                    bgcolor: "transparent",
                  },
                }}
              >
                <LinkedIn />
              </IconButton>
            </Stack>
          </Stack>

          {/* Navigation */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            {getDisplayedPrevPost && (
              <Box sx={{ flex: 1 }}>
                <Card
                  elevation={0}
                  onClick={() =>
                    handleNavigation(getPostId(getDisplayedPrevPost))
                  }
                  sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#111111",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <ArrowBack sx={{ fontSize: 16, color: "#666666" }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#666666",
                      }}
                    >
                      {t("blog.previous")}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#111111",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {getDisplayedPrevPost.title}
                  </Typography>
                </Card>
              </Box>
            )}

            {getDisplayedNextPost && (
              <Box sx={{ flex: 1 }}>
                <Card
                  elevation={0}
                  onClick={() =>
                    handleNavigation(getPostId(getDisplayedNextPost))
                  }
                  sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                    textAlign: "right",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#111111",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#666666",
                      }}
                    >
                      {t("blog.next")}
                    </Typography>
                    <ArrowForward sx={{ fontSize: 16, color: "#666666" }} />
                  </Stack>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#111111",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {getDisplayedNextPost.title}
                  </Typography>
                </Card>
              </Box>
            )}
          </Stack>
        </Box>
      </Container>

      {/* Bottom Spacer to prevent footer overlap */}
      <Box sx={{ height: 80 }} />

      {/* Mobile Sidebar Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          display: { xs: "block", md: "none" },
        }}
      >
        <div className="btn-sidebar-mobile d-flex">
          <button
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarmobile"
            aria-controls="offcanvasRight"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1px solid #e0e0e0",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          >
            <i className="icon-open" />
          </button>
        </div>
      </Box>
    </Box>
  );
}
