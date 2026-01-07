"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogArticles8 } from "@/data/blogs";
import { useLanguage } from "@/context/LanguageProvider";
import { useTranslation } from "react-i18next";

// API endpoint configuration
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [categoryPostCount, setCategoryPostCount] = useState({});
  const [instagramImages, setInstagramImages] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    posts: true,
    instagram: true,
  });

  const { currentLanguageId } = useLanguage();
  const { t } = useTranslation();

  // ตรวจสอบและแปลง currentLanguageId ให้เป็น "th" หรือ "en"
  const normalizedLangId = useMemo(() => {
    if (!currentLanguageId) return "th";
    const lang = currentLanguageId.toString().toLowerCase();
    if (lang === "th" || lang === "thai" || lang === "1") return "th";
    if (lang === "en" || lang === "english" || lang === "2") return "en";
    return "th";
  }, [currentLanguageId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/blog-categories/`);
        if (!response.ok)
          throw new Error(`Failed to fetch categories: ${response.status}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/blog/`);
        if (!response.ok)
          throw new Error(`Failed to fetch blog posts: ${response.status}`);
        const result = await response.json();

        // API ส่งกลับมาเป็น { success: true, data: [...] }
        const postsArray =
          result.success && result.data
            ? result.data
            : Array.isArray(result)
            ? result
            : [result];

        // console.log("Sidebar - Posts fetched:", postsArray.length);
        setAllPosts(postsArray);

        // นับจำนวน post ต่อ category
        const countMap = {};
        postsArray.forEach((post) => {
          if (post.category && post.category.category_id) {
            const categoryId = post.category.category_id;
            countMap[categoryId] = (countMap[categoryId] || 0) + 1;
          }
        });
        setCategoryPostCount(countMap);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      } finally {
        setLoading((prev) => ({ ...prev, posts: false }));
      }
    };

    const fetchInstagramImages = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/blog-post-media/`);
        if (!response.ok)
          throw new Error(
            `Failed to fetch Instagram images: ${response.status}`
          );
        const data = await response.json();
        setInstagramImages(data);
      } catch (error) {
        console.error("Error fetching Instagram images:", error);
      } finally {
        setLoading((prev) => ({ ...prev, instagram: false }));
      }
    };

    fetchCategories();
    fetchRecentPosts();
    fetchInstagramImages();
  }, []);

  // Filter และ transform posts ตามภาษา (รองรับ translations array)
  const recentPosts = useMemo(() => {
    const transformedPosts = allPosts.map((post) => {
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
    });

    // เรียงตาม published_at และเอาแค่ 4 อันแรก
    return transformedPosts
      .filter(
        (post) =>
          post.title && (post.status === "published" || post.status === "draft")
      )
      .sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at || 0);
        const dateB = new Date(b.published_at || b.created_at || 0);
        return dateB - dateA;
      })
      .slice(0, 4);
  }, [allPosts, normalizedLangId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(
        normalizedLangId === "th" ? "th-TH" : "en-US",
        {
          month: "short",
          day: "2-digit",
        }
      );
    } catch (e) {
      return "N/A";
    }
  };

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_ENDPOINT;

  const getPostImage = (post) => {
    if (post.featured_image) {
      return post.featured_image.startsWith("http")
        ? post.featured_image
        : `${IMAGE_BASE_URL}${post.featured_image.startsWith("/") ? "" : "/"}${
            post.featured_image
          }`;
    }
    const postId = post.post_id || post.id || 0;
    return (
      blogArticles8[postId % blogArticles8.length]?.imgSrc ||
      "/images/blog/blog-detail.jpg"
    );
  };

  return (
    <div className="tf-section-sidebar wrap-sidebar-mobile">
      <div className="sidebar-item sidebar-post">
        <div className="sidebar-title">{t("blog.recentposts")}</div>
        <div className="sidebar-content">
          {loading.posts ? (
            <p>{t("blog.loadingrecentposts")}</p>
          ) : recentPosts.length > 0 ? (
            <ul>
              {recentPosts.map((post) => {
                const postId = post.post_id || post.id;
                return (
                  <li key={postId}>
                    <div className="blog-article-item style-sidebar">
                      <div className="article-thumb">
                        <Link href={`/blog-detail/${postId}`}>
                          <Image
                            alt={post.title || t("blog.untitledPost")}
                            src={getPostImage(post)}
                            width={100}
                            height={80}
                            className="rounded"
                          />
                        </Link>
                      </div>
                      <div className="article-content">
                        {post.category && (
                          <div className="article-label">
                            <Link
                              href={`/category/${post.category.slug}`}
                              className="tf-btn btn-sm radius-3 btn-fill animate-hover-btn"
                            >
                              {post.category.name}
                            </Link>
                          </div>
                        )}
                        <div className="article-title">
                          <Link href={`/blog-detail/${postId}`}>
                            {post.title}
                          </Link>
                        </div>
                        <div className="article-meta">
                          {post.published_at && (
                            <span className="article-date">
                              {formatDate(post.published_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>{t("blog.norecentpostsfound")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
