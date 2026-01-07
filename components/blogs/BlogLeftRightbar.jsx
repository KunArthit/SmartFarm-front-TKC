"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import Image from "next/image";
import Link from "next/link";
import { blogArticles6 } from "@/data/blogs";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageProvider";
import { format } from "date-fns";

// API endpoint configuration
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

function isThai(text) {
  return /[\u0E00-\u0E7F]/.test(text);
}

export default function BlogLeftRightbar() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { t } = useTranslation();
  const { currentLanguageId } = useLanguage();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/blog/`);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        // console.log("API Response:", result);

        // API ส่งกลับมาเป็น { success: true, data: [...] }
        const posts =
          result.success && result.data
            ? result.data
            : Array.isArray(result)
            ? result
            : [result];
        // console.log("Posts extracted:", posts.length, "posts");

        setBlogPosts(posts);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(err.message);
        setBlogPosts(blogArticles6);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // ตรวจสอบและแปลง currentLanguageId ให้เป็น "th" หรือ "en"
  const normalizedLangId = useMemo(() => {
    if (!currentLanguageId) return "th";
    const lang = currentLanguageId.toString().toLowerCase();
    if (lang === "th" || lang === "thai" || lang === "1") return "th";
    if (lang === "en" || lang === "english" || lang === "2") return "en";
    return "th"; // default
  }, [currentLanguageId]);

  // Filter และ transform blogPosts ตามภาษา
  const filteredLanguagePosts = useMemo(() => {
    // console.log("Current Language:", normalizedLangId);

    return blogPosts
      .map((post) => {
        // ถ้ามี translations array
        if (
          post.translations &&
          Array.isArray(post.translations) &&
          post.translations.length > 0
        ) {
          // หา translation ที่ตรงกับภาษา
          let translation = post.translations.find(
            (t) => t.lang === normalizedLangId
          );

          // ถ้าไม่เจอ ใช้ภาษาแรก
          if (!translation) {
            translation = post.translations[0];
          }

          // Merge ข้อมูล
          return {
            ...post,
            title: translation.title || post.title || "Untitled",
            slug: translation.slug || post.slug || "",
            excerpt: translation.excerpt || post.excerpt || "",
            content: translation.content || post.content || "",
          };
        }

        // ถ้าไม่มี translations ใช้ข้อมูลเดิม
        return post;
      })
      .filter((post) => post.title); // กรองเฉพาะที่มี title
  }, [blogPosts, normalizedLangId]);

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_ENDPOINT;

  const transformApiData = (posts) => {
    return posts.map((post, index) => {
      const rawImg =
        post.featured_image ||
        post.image_url ||
        blogArticles6[index % blogArticles6.length]?.imgSrc;

      const imgSrc = rawImg
        ? rawImg.startsWith("http")
          ? rawImg
          : `${IMAGE_BASE_URL}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`
        : "/images/placeholder-blog.jpg";

      return {
        id: post.post_id || post.id || index,
        post_id: post.post_id || post.id,
        title: post.title || "Untitled",
        slug: post.slug || "",
        excerpt:
          post.excerpt ||
          (post.content
            ? post.content.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
            : ""),
        content: post.content || "",
        imgSrc,
        imgAlt: post.title || "Blog Image",
        category: {
          name: post.category?.name || "Uncategorized",
          slug: post.category?.slug || "uncategorized",
        },
        label: post.category?.name || "Uncategorized",
        author: {
          name: post.author
            ? `${post.author.first_name || ""} ${
                post.author.last_name || ""
              }`.trim() || post.author.username
            : "Unknown Author",
          avatar: post.author?.avatar || "/images/avatar-placeholder.jpg",
        },
        created_at:
          post.created_at || post.published_at || new Date().toISOString(),
        published_at: post.published_at || post.created_at,
        status: post.status || "published",
      };
    });
  };

  // Use API data if available, otherwise use mock data
  const postsToRender =
    filteredLanguagePosts.length > 0
      ? transformApiData(filteredLanguagePosts).filter(
          (post) =>
            post.status.toLowerCase() === "published" ||
            post.status.toLowerCase() === "draft"
        )
      : blogArticles6.filter(
          (post) => post.status?.toLowerCase?.() === "published"
        );

  // console.log("Posts to render:", postsToRender.length);

  // Filter posts by category
  const filteredPosts =
    activeFilter === "all"
      ? postsToRender
      : postsToRender.filter(
          (post) =>
            post.category?.slug?.toLowerCase() === activeFilter.toLowerCase() ||
            post.label?.toLowerCase() === activeFilter.toLowerCase()
        );

  // Pagination calculations
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Get all categories for filter
  const categories = [
    ...new Set(
      postsToRender.map(
        (post) => post.category?.name || post.label || "Uncategorized"
      )
    ),
  ];

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    document
      .querySelector(".blog-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Enhanced styling
  const categoryButtonStyle = {
    base: {
      display: "inline-flex",
      alignItems: "center",
      fontSize: "13px",
      fontWeight: "600",
      color: "white",
      backgroundColor: "#1e3a8a",
      padding: "8px 16px",
      borderRadius: "25px",
      boxShadow: "0 2px 8px rgba(30, 58, 138, 0.3)",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      border: "none",
      cursor: "pointer",
      textDecoration: "none",
      margin: "4px",
    },
    hover: {
      backgroundColor: "#2563eb",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
      transform: "translateY(-2px)",
    },
    active: {
      backgroundColor: "#3b82f6",
      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
      transform: "translateY(0)",
    },
  };

  const readMoreButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e3a8a",
    backgroundColor: "transparent",
    padding: "8px 0",
    transition: "all 0.3s ease",
    textDecoration: "none",
    borderBottom: "2px solid transparent",
    position: "relative",
  };

  const readMoreButtonHoverStyle = {
    color: "#3b82f6",
    borderBottom: "2px solid #3b82f6",
  };

  const paginationButtonStyle = {
    padding: "0.5rem 1rem",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    textDecoration: "none",
    outline: "none",
  };

  const paginationButtonHoverStyle = {
    backgroundColor: "#f3f4f6",
    borderColor: "#9ca3af",
  };

  const paginationButtonActiveStyle = {
    backgroundColor: "#000000",
    borderColor: "#000000",
    color: "#ffffff",
  };

  const paginationButtonDisabledStyle = {
    opacity: "0.5",
    cursor: "not-allowed",
  };

  const paginationContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "3rem",
    marginBottom: "2rem",
  };

  const paginationInfoStyle = {
    fontSize: "0.875rem",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "1rem",
  };

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="blog-section py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary mb-3"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4>Loading amazing content...</h4>
                <p className="text-muted">
                  Please wait while we fetch the latest posts
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="alert alert-info border-0 shadow-sm" role="alert">
                <div className="d-flex align-items-center">
                  <i
                    className="icon icon-info-circle text-info me-3"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <div>
                    <h6 className="mb-1">Demo Mode Active</h6>
                    <p className="mb-0">
                      Showing sample content. API connection will be restored
                      soon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Posts */}
            {!loading && (
              <div className="list-blog">
                {currentPosts.length === 0 ? (
                  <div className="row">
                    <div className="col-12 text-center py-5">
                      <div className="mb-4">
                        <i
                          className="icon icon-search text-muted"
                          style={{ fontSize: "4rem" }}
                        ></i>
                      </div>
                      <h3 className="mb-3">No posts found in this category</h3>
                      <p className="text-muted mb-4">
                        Try selecting a different category or browse all posts
                        to discover great content.
                      </p>
                    </div>
                  </div>
                ) : (
                  Array.from(
                    { length: Math.ceil(currentPosts.length / 3) },
                    (_, groupIndex) => {
                      const groupPosts = currentPosts.slice(
                        groupIndex * 3,
                        groupIndex * 3 + 3
                      );

                      return (
                        <div
                          key={`group-${groupIndex}`}
                          className="blog-group mb-5"
                        >
                          {/* Featured Article */}
                          {groupPosts.length > 0 && (
                            <div className="row mb-5">
                              <div className="col-12">
                                <article className="featured-article bg-white rounded-4 shadow-lg overflow-hidden position-relative">
                                  <div className="row g-0 h-100">
                                    <div className="col-lg-7 p-0">
                                      <div className="article-thumb position-relative overflow-hidden h-100 w-100">
                                        <Link
                                          href={`/blog-detail/${
                                            groupPosts[0].post_id ||
                                            groupPosts[0].id
                                          }`}
                                          className="position-absolute top-0 start-0 w-100 h-100 d-block"
                                        >
                                          <Image
                                            className="hover-scale transition-300"
                                            src={groupPosts[0].imgSrc}
                                            alt={groupPosts[0].imgAlt}
                                            width={800}
                                            height={500}
                                            style={{
                                              objectFit: "cover",
                                              width: "100%",
                                              height: "100%",
                                              display: "block",
                                            }}
                                          />
                                        </Link>
                                      </div>
                                    </div>
                                    <div className="col-lg-5 d-flex">
                                      <div className="article-content p-4 p-lg-5 d-flex flex-column justify-content-between">
                                        <div>
                                          <div className="article-meta mb-3">
                                            <div className="d-flex align-items-center text-muted mb-2">
                                              <i className="icon icon-calendar me-2"></i>
                                              <small>
                                                {format(
                                                  new Date(
                                                    groupPosts[0].created_at
                                                  ),
                                                  "dd-MM-yyyy"
                                                )}
                                              </small>
                                            </div>
                                            {groupPosts[0].author && (
                                              <div className="d-flex align-items-center">
                                                <small className="text-muted">
                                                  {t("blog.by")}{" "}
                                                  {groupPosts[0].author.name}
                                                </small>
                                              </div>
                                            )}
                                          </div>

                                          <div className="article-title mb-3">
                                            <Link
                                              href={`/blog-detail/${
                                                groupPosts[0].post_id ||
                                                groupPosts[0].id
                                              }`}
                                              className="text-decoration-none"
                                            >
                                              <h2 className="h3 fw-bold text-dark hover-text-primary transition-300 mb-0">
                                                {groupPosts[0].title}
                                              </h2>
                                            </Link>
                                          </div>

                                          {groupPosts[0].excerpt && (
                                            <div className="article-excerpt mb-4">
                                              <p
                                                className="text-muted mb-0"
                                                style={{ lineHeight: "1.6" }}
                                              >
                                                {groupPosts[0].excerpt.length >
                                                180
                                                  ? `${groupPosts[0].excerpt.substring(
                                                      0,
                                                      180
                                                    )}...`
                                                  : groupPosts[0].excerpt}
                                              </p>
                                            </div>
                                          )}
                                        </div>

                                        <div className="article-btn">
                                          <Link
                                            href={`/blog-detail/${
                                              groupPosts[0].post_id ||
                                              groupPosts[0].id
                                            }`}
                                            style={readMoreButtonStyle}
                                            onMouseOver={(e) => {
                                              const icon =
                                                e.target.querySelector("i");
                                              if (icon)
                                                icon.style.transform =
                                                  "translateX(5px)";
                                              Object.assign(
                                                e.target.style,
                                                readMoreButtonHoverStyle
                                              );
                                            }}
                                            onMouseOut={(e) => {
                                              const icon =
                                                e.target.querySelector("i");
                                              if (icon)
                                                icon.style.transform =
                                                  "translateX(0)";
                                              Object.assign(
                                                e.target.style,
                                                readMoreButtonStyle
                                              );
                                            }}
                                          >
                                            {t("navigation.readmore")}
                                            <i
                                              className="icon icon-arrow1-right ms-2"
                                              style={{
                                                transition:
                                                  "transform 0.3s ease",
                                              }}
                                            />
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            </div>
                          )}

                          {/* Grid Articles */}
                          {groupPosts.length > 1 && (
                            <div className="row g-4">
                              {groupPosts.slice(1).map((post, index) => (
                                <div
                                  key={post.post_id || post.id || index}
                                  className="col-lg-6"
                                >
                                  <article className="blog-article-item bg-white rounded-3 shadow-sm overflow-hidden h-90 transition-300">
                                    <div className="article-thumb position-relative overflow-hidden">
                                      <Link
                                        href={`/blog-detail/${
                                          post.post_id || post.id
                                        }`}
                                      >
                                        <div
                                          style={{
                                            aspectRatio: "16/9",
                                            overflow: "hidden",
                                          }}
                                        >
                                          <Image
                                            className="img-fluid hover-scale transition-300"
                                            src={post.imgSrc}
                                            alt={post.imgAlt}
                                            width={600}
                                            height={338}
                                            style={{
                                              objectFit: "cover",
                                              width: "100%",
                                              height: "100%",
                                            }}
                                          />
                                        </div>
                                      </Link>
                                    </div>

                                    <div className="article-content p-4 d-flex flex-column h-100">
                                      <div className="article-meta mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                          <div className="d-flex align-items-center text-muted">
                                            <i className="icon icon-calendar me-1"></i>
                                            <small>
                                              {format(
                                                new Date(post.created_at),
                                                "dd-MM-yyyy"
                                              )}
                                            </small>
                                          </div>
                                          {post.author && (
                                            <div className="d-flex align-items-center">
                                              <small className="text-muted">
                                                {post.author.name}
                                              </small>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="article-title mb-3">
                                        <Link
                                          href={`/blog-detail/${
                                            post.post_id || post.id
                                          }`}
                                          className="text-decoration-none"
                                        >
                                          <h3 className="h5 fw-bold text-dark hover-text-primary transition-300 mb-0">
                                            {post.title}
                                          </h3>
                                        </Link>
                                      </div>

                                      {post.excerpt && (
                                        <div className="article-excerpt mb-4 flex-grow-1">
                                          <p
                                            className="text-muted mb-0"
                                            style={{ lineHeight: "1.5" }}
                                          >
                                            {post.excerpt.length > 120
                                              ? `${post.excerpt.substring(
                                                  0,
                                                  120
                                                )}...`
                                              : post.excerpt}
                                          </p>
                                        </div>
                                      )}

                                      <div className="article-btn mt-auto">
                                        <Link
                                          href={`/blog-detail/${
                                            post.post_id || post.id
                                          }`}
                                          style={readMoreButtonStyle}
                                          onMouseOver={(e) => {
                                            const icon =
                                              e.target.querySelector("i");
                                            if (icon)
                                              icon.style.transform =
                                                "translateX(5px)";
                                            Object.assign(
                                              e.target.style,
                                              readMoreButtonHoverStyle
                                            );
                                          }}
                                          onMouseOut={(e) => {
                                            const icon =
                                              e.target.querySelector("i");
                                            if (icon)
                                              icon.style.transform =
                                                "translateX(0)";
                                            Object.assign(
                                              e.target.style,
                                              readMoreButtonStyle
                                            );
                                          }}
                                        >
                                          {t("navigation.readmore")}
                                          <i
                                            className="icon icon-arrow1-right ms-2"
                                            style={{
                                              transition: "transform 0.3s ease",
                                            }}
                                          />
                                        </Link>
                                      </div>
                                    </div>
                                  </article>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )
                )}
              </div>
            )}

            {/* Pagination Info */}
            {!loading && currentPosts.length > 0 && (
              <div style={paginationInfoStyle}>
                {t("solution.show")} {indexOfFirstPost + 1}-
                {Math.min(indexOfLastPost, totalPosts)} {t("solution.of")}{" "}
                {totalPosts} {t("solution.list")}
              </div>
            )}

            {/* Pagination */}
            {!loading && currentPosts.length > 0 && totalPages > 1 && (
              <div style={paginationContainerStyle}>
                {/* Previous Button */}
                <button
                  style={{
                    ...paginationButtonStyle,
                    ...(currentPage === 1 ? paginationButtonDisabledStyle : {}),
                  }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      Object.assign(e.target.style, paginationButtonHoverStyle);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      Object.assign(e.target.style, paginationButtonStyle);
                    }
                  }}
                >
                  <svg
                    style={{ width: "16px", height: "16px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  {t("blog.previous")}
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      style={{
                        ...paginationButtonStyle,
                        ...(currentPage === pageNumber
                          ? paginationButtonActiveStyle
                          : {}),
                      }}
                      onClick={() => handlePageChange(pageNumber)}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNumber) {
                          Object.assign(e.target.style, {
                            ...paginationButtonStyle,
                            ...paginationButtonHoverStyle,
                          });
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNumber) {
                          Object.assign(e.target.style, paginationButtonStyle);
                        }
                      }}
                    >
                      {pageNumber}
                    </button>
                  )
                )}

                {/* Next Button */}
                <button
                  style={{
                    ...paginationButtonStyle,
                    ...(currentPage === totalPages
                      ? paginationButtonDisabledStyle
                      : {}),
                  }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      Object.assign(e.target.style, paginationButtonHoverStyle);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      Object.assign(e.target.style, paginationButtonStyle);
                    }
                  }}
                >
                  {t("blog.next")}
                  <svg
                    style={{ width: "16px", height: "16px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
