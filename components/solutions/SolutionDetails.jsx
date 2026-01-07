"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageProvider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function isThai(text) {
  return typeof text === "string" && /[\u0E00-\u0E7F]/.test(text);
}

const SolutionDetail = () => {
  const { id } = useParams();
  const { currentLanguageId } = useLanguage();

  const [allCategories, setAllCategories] = useState([]);
  const [allContents, setAllContents] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch category data สำหรับ id นี้ (ทั้งภาษาไทยและอังกฤษ)
        const res1 = await fetch(`${apiEndpoint}/solution-categories/${id}`);
        const categoryData = await res1.json();

        // เก็บข้อมูล category ทั้งหมด
        setAllCategories(
          Array.isArray(categoryData) ? categoryData : [categoryData]
        );

        // Fetch content data
        const res2 = await fetch(
          `${apiEndpoint}/solution-content/solution/${id}`
        );
        const contentData = await res2.json();

        console.log("✅ All content data:", contentData);

        setAllContents(contentData);

        // Fetch media (ใช้ content แรกเพื่อดึง media)
        if (contentData && contentData.length > 0) {
          const res3 = await fetch(
            `${apiEndpoint}/solution-media/category/${contentData[0].content_id}`
          );
          const mediaData = await res3.json();

          console.log("✅ media data:", mediaData);
          setMedia(mediaData.data || []);
        }
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, apiEndpoint]);

  // กรองข้อมูล category ตามภาษาที่เลือก
  const category = useMemo(() => {
    if (allCategories.length === 0) return null;

    // หาข้อมูลที่ตรงกับภาษาปัจจุบัน
    const found = allCategories.find((cat) => {
      const lang = isThai(cat.name) ? "th" : "en";
      return lang === currentLanguageId;
    });

    // Fallback ถ้าไม่เจอภาษาที่ต้องการ
    return found || allCategories[0];
  }, [allCategories, currentLanguageId]);

  // กรองข้อมูล content ตามภาษาที่เลือก
  const content = useMemo(() => {
    if (allContents.length === 0) return null;

    // หาข้อมูลที่ตรงกับภาษาปัจจุบัน
    const found = allContents.find((cnt) => {
      const lang = isThai(cnt.title) ? "th" : "en";
      return lang === currentLanguageId;
    });

    // Fallback ถ้าไม่เจอภาษาที่ต้องการ
    return found || allContents[0];
  }, [allContents, currentLanguageId]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    focusOnSelect: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          arrows: false,
          dots: true,
          autoplay: false,
        },
      },
    ],
  };

  const sortedMedia = [...media].sort(
    (a, b) => a.display_order - b.display_order
  );

  const effectiveSettings = {
    ...sliderSettings,
    infinite: sortedMedia.length > 1,
    slidesToShow: Math.min(sortedMedia.length, 3),
    centerMode: sortedMedia.length > 1,
    arrows: sortedMedia.length > 1,
    dots: sortedMedia.length > 1,
  };

  return (
    <>
      <style jsx>{`
        .solution-container {
          min-height: 100vh;
          background: #ffffff;
          padding: 0;
          overflow-x: hidden;
        }

        .hero-section {
          background: #ffffff;
          color: #2d3748;
          padding: 20px 20px 40px;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
          margin-top: -20px;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(1.75rem, 5vw, 3rem);
          font-weight: 600;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .hero-description {
          font-size: clamp(0.9rem, 2.5vw, 1.125rem);
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .carousel-section {
          background: #ffffff;
          padding: 0;
          margin: 0 0 40px 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: start;
          margin-bottom: 40px;
        }

        .content-box {
          display: contents;
        }

        .content-block {
          background: #ffffff;
          padding: 0;
          margin-top: 20px;
          border: none;
          box-shadow: none;
          order: 1;
        }

        .content-title {
          font-size: clamp(1.25rem, 4vw, 2rem);
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1f2937;
          line-height: 1.3;
        }

        .content-text {
          font-size: 16px;
          line-height: 1.7;
          color: #374151;
        }

        .image-gallery {
          display: flex;
          flex-direction: column;
          gap: 20px;
          order: 2;
        }

        .gallery-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .gallery-image img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          transition: none;
        }

        .single-media-container {
          text-align: center;
          margin: 0 auto;
          max-width: 800px;
        }

        .single-media-image {
          width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          object-fit: cover;
        }

        /* Enhanced Carousel Styles */
        .enhanced-carousel .slick-slide {
          transition: all 0.3s ease;
          transform: scale(0.9);
          opacity: 0.8;
          margin: 0 10px;
        }

        .enhanced-carousel .slick-slide.slick-center {
          transform: scale(1);
          opacity: 1;
        }

        .enhanced-carousel .slick-slide img {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .enhanced-carousel .slick-slide.slick-center img {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .enhanced-carousel .slick-dots {
          bottom: -50px;
        }

        .enhanced-carousel .slick-dots li button:before {
          font-size: 12px;
          color: #cbd5e0;
        }

        .enhanced-carousel .slick-dots li.slick-active button:before {
          color: #4a5568;
        }

        .enhanced-carousel .slick-prev {
          left: -60px;
        }

        .enhanced-carousel .slick-next {
          right: -60px;
        }

        .coverflow-container {
          perspective: 1200px;
          perspective-origin: center center;
          padding: 20px 0;
        }

        .loading-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px;
        }

        /* Tablet Layout (768px - 1024px) */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .hero-section {
            padding: 30px 20px 30px;
          }

          .main-content {
            padding: 30px 20px;
          }

          .enhanced-carousel .slick-prev {
            left: -40px;
          }

          .enhanced-carousel .slick-next {
            right: -40px;
          }
        }

        /* Mobile Layout (max-width: 768px) */
        @media (max-width: 768px) {
          .solution-container {
            padding: 0;
          }

          .hero-section {
            padding: 20px 16px 20px;
            margin-top: 0;
          }

          .hero-title {
            font-size: clamp(1.5rem, 6vw, 2.5rem);
            margin-bottom: 0.75rem;
          }

          .hero-description {
            font-size: clamp(0.875rem, 3vw, 1rem);
          }

          .main-content {
            padding: 20px 16px;
          }

          .carousel-section {
            padding: 16px 0;
            margin-bottom: 24px;
          }

          .coverflow-container {
            padding: 16px 0;
          }

          .enhanced-carousel .slick-arrow {
            display: none !important;
          }

          .enhanced-carousel .slick-dots {
            bottom: -40px;
          }

          .content-box {
            display: block;
            padding: 0;
          }

          .content-block {
            margin-top: 0;
          }

          .content-title {
            font-size: clamp(1.125rem, 5vw, 1.75rem);
            margin-bottom: 1rem;
          }

          .content-text {
            font-size: 15px;
            line-height: 1.6;
          }

          .image-gallery {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 20px;
          }

          .gallery-image {
            flex: 1 1 calc(50% - 6px);
            min-width: calc(50% - 6px);
          }

          .gallery-image img {
            height: 160px;
          }

          .single-media-image {
            height: 200px;
          }
        }

        /* Small Mobile Layout (max-width: 480px) */
        @media (max-width: 480px) {
          .hero-section {
            padding: 16px 12px 16px;
          }

          .main-content {
            padding: 16px 12px;
          }

          .carousel-section {
            padding: 12px 0;
            margin-bottom: 20px;
          }

          .hero-title {
            font-size: clamp(1.25rem, 7vw, 2rem);
          }

          .hero-description {
            font-size: clamp(0.8rem, 3.5vw, 0.9rem);
          }

          .content-title {
            font-size: clamp(1rem, 6vw, 1.5rem);
            margin-bottom: 0.75rem;
          }

          .content-text {
            font-size: 14px;
            line-height: 1.5;
          }

          .image-gallery {
            flex-direction: column;
            gap: 16px;
          }

          .gallery-image {
            flex: unset;
            min-width: unset;
          }

          .gallery-image img {
            height: 180px;
          }

          .single-media-image {
            height: 180px;
          }

          .enhanced-carousel .slick-slide img {
            height: 180px;
          }

          .loading-container {
            padding: 40px 12px;
          }
        }

        /* Extra Small Mobile (max-width: 360px) */
        @media (max-width: 360px) {
          .hero-section {
            padding: 12px 8px 12px;
          }

          .main-content {
            padding: 12px 8px;
          }

          .content-title {
            font-size: clamp(0.9rem, 7vw, 1.25rem);
          }

          .content-text {
            font-size: 13px;
          }

          .gallery-image img {
            height: 150px;
          }

          .single-media-image {
            height: 150px;
          }

          .enhanced-carousel .slick-slide img {
            height: 150px;
          }
        }
      `}</style>

      <div className="solution-container">
        {loading ? (
          <div className="loading-container">
            <div className="animate-pulse h-4 w-1/2 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="animate-pulse h-64 bg-gray-200 rounded mb-12"></div>
          </div>
        ) : (
          <>
            <div className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">{category?.name}</h1>
                <p className="hero-description">{category?.description}</p>
              </div>
            </div>

            <div className="main-content">
              <div className="carousel-section">
                <div className="coverflow-container">
                  {sortedMedia.length > 1 ? (
                    <Slider
                      {...effectiveSettings}
                      className="enhanced-carousel"
                    >
                      {sortedMedia.map((item, index) => (
                        <div key={item.media_id}>
                          <img
                            src={item.media_url}
                            alt={`Media ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "260px",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    sortedMedia[0] && (
                      <div className="single-media-container">
                        <img
                          src={sortedMedia[0].media_url}
                          alt="Single Media"
                          className="single-media-image"
                          style={{
                            height: "260px",
                            display: "block",
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="content-grid">
                <div className="content-box">
                  <div className="content-block">
                    <div className="content-title">
                      <div
                        dangerouslySetInnerHTML={{ __html: content?.title }}
                      />
                    </div>
                    <div className="content-text">
                      <div
                        dangerouslySetInnerHTML={{ __html: content?.content }}
                      />
                    </div>
                  </div>

                  <div className="image-gallery">
                    {sortedMedia.slice(0, 2).map((item, index) => (
                      <div key={item.media_id} className="gallery-image">
                        <img
                          src={item.media_url}
                          alt={`Gallery image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SolutionDetail;
