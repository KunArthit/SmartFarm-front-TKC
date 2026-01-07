"use client";
import Drift from "drift-zoom";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import NoImage from "../../../public/images/NoImage.jpg";

const VIDEO_BASE_URL = "https://myfarmsuk.com";

// Helper function to extract YouTube video ID from various URL formats
const extractYouTubeId = (url) => {
  if (!url) return null;
  
  // Handle YouTube live URLs
  const liveRegex = /(?:youtube\.com\/live\/)([^"&?\/\s]{11})/;
  const liveMatch = url.match(liveRegex);
  if (liveMatch) return liveMatch[1];
  
  // Handle regular YouTube URLs
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Check if URL is a YouTube URL
const isYouTubeUrl = (url) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
};

export default function Slider1ZoomOuter({
  currentColor = "Beige",
  handleColor = () => {},
  product = null,
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);

  // Process product images and videos into a unified media array
  const processMediaItems = () => {
    if (!product) return [];

    const mediaItems = [];

    // Add regular videos first (non-YouTube)
    const regularVideos = [];
    const youtubeVideos = [];

    if (product.videos && product.videos.length > 0) {
      product.videos.forEach((video, index) => {
        if (isYouTubeUrl(video.url)) {
          // Handle YouTube videos - เก็บไว้ใน array แยก
          const videoId = extractYouTubeId(video.url);
          if (videoId) {
            youtubeVideos.push({
              id: index + 1,
              src: video.url,
              videoId: videoId,
              thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
              alt: `${product.title || 'Product'} video ${index + 1}`,
              width: 770,
              height: 432,
              type: 'youtube',
              videoType: video.type || 'other',
              dataValue: "default",
            });
          }
        } else {
          // Handle regular video files
          const videoUrl = video.url.startsWith('http') ? video.url : `${VIDEO_BASE_URL}${video.url}`;
          regularVideos.push({
            id: index + 1,
            src: videoUrl,
            alt: `${product.title || 'Product'} video ${index + 1}`,
            width: 770,
            height: 432,
            type: 'video',
            videoType: video.type || 'other',
            dataValue: "default",
          });
        }
      });
    }

    // Add regular videos first
    mediaItems.push(...regularVideos);

    // Add images after regular videos
    if (product.images && product.images.length > 0) {
      product.images.forEach((imageSrc, index) => {
        mediaItems.push({
          id: mediaItems.length + 1,
          src: imageSrc,
          alt: `${product.title || 'Product'} image ${index + 1}`,
          width: 770,
          height: 1075,
          type: 'image',
          dataValue: "default",
        });
      });
    }

    // Add YouTube videos last (ท้ายสุด)
    youtubeVideos.forEach((video) => {
      video.id = mediaItems.length + 1;
      mediaItems.push(video);
    });

    return mediaItems;
  };

  const mediaItems = processMediaItems();

  useEffect(() => {
    if (mediaItems.length === 0) return;

    const slideIndex = mediaItems.findIndex(
      (elm) => elm.dataValue?.toLowerCase() === currentColor.toLowerCase()
    );
    
    if (slideIndex !== -1 && swiperRef.current) {
      swiperRef.current.slideTo(slideIndex);
    }
  }, [currentColor, mediaItems]);

  useEffect(() => {
    // Function to initialize Drift for images only
    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      driftAll.forEach((el) => {
        new Drift(el, {
          zoomFactor: 2,
          paneContainer: pane,
          inlinePane: false,
          handleTouch: false,
          hoverBoundingBox: true,
          containInline: true,
        });
      });
    };

    imageZoom();

    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup event listeners on component unmount
    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [mediaItems]);

  if (mediaItems.length === 0) {
    return (
      <div className="tf-product-media-main">
        <div className="item">
          <Image
            src={NoImage}
            alt="No media available"
            width={770}
            height={1075}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Thumbnails Swiper */}
      <Swiper
        dir="ltr"
        direction="vertical"
        spaceBetween={10}
        slidesPerView={6}
        className="tf-product-media-thumbs other-image-zoom"
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        breakpoints={{
          0: {
            direction: "horizontal",
          },
          1150: {
            direction: "vertical",
          },
        }}
      >
        {mediaItems.map((slide, index) => (
          <SwiperSlide key={index} className="stagger-item">
            <div className="item">
              {slide.type === 'youtube' ? (
                <div className="video-thumbnail" style={{ 
                  position: 'relative',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={slide.thumbnailUrl || NoImage}
                    alt={slide.alt}
                    width={770}
                    height={100}
                    style={{ 
                      width: '100%', 
                      height: '100px', 
                      objectFit: 'cover',
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      backgroundColor: 'rgba(255,0,0,0.9)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ▶
                  </div>
                  {slide.videoType && slide.videoType !== 'other' && (
                    <div style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {slide.videoType}
                    </div>
                  )}
                </div>
              ) : slide.type === 'video' ? (
                <div className="video-thumbnail" style={{ 
                  position: 'relative',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <video
                    style={{ 
                      width: '100%', 
                      height: '100px', 
                      objectFit: 'cover',
                    }}
                    preload="metadata"
                    muted
                  >
                    <source src={slide.src} type="video/mp4" />
                  </video>
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ▶
                  </div>
                </div>
              ) : (
                <Image
                  className="lazyload"
                  data-src={slide.src}
                  alt={slide.alt}
                  src={slide.src || NoImage}
                  width={slide.width}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Main Media Swiper */}
      <Gallery>
        <Swiper
          dir="ltr"
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="tf-product-media-main"
          id="gallery-swiper-started"
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Thumbs, Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            if (mediaItems[swiper.activeIndex]?.dataValue) {
              handleColor(mediaItems[swiper.activeIndex].dataValue);
            }
          }}
        >
          {mediaItems.map((slide, index) => (
            <SwiperSlide key={index}>
              {slide.type === 'youtube' ? (
                <div className="item youtube-slide" style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  minHeight: '500px'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    aspectRatio: '16/9'
                  }}>
                    <iframe
                      src={slide.embedUrl}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                  {slide.videoType && slide.videoType !== 'other' && (
                    <div className="video-type-badge" style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: 'rgba(255,0,0,0.9)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      textTransform: 'capitalize'
                    }}>
                      {slide.videoType}
                    </div>
                  )}
                </div>
              ) : slide.type === 'video' ? (
                <div className="item video-slide" style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  minHeight: '500px'
                }}>
                  <video
                    controls
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: '600px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                    preload="metadata"
                    controlsList="nodownload"
                  >
                    <source src={slide.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {slide.videoType && slide.videoType !== 'other' && (
                    <div className="video-type-badge" style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      textTransform: 'capitalize'
                    }}>
                      {slide.videoType}
                    </div>
                  )}
                </div>
              ) : (
                <Item
                  original={slide.src}
                  thumbnail={slide.src}
                  width={slide.width}
                  height={slide.height}
                >
                  {({ ref, open }) => (
                    <a
                      className="item"
                      data-pswp-width={slide.width}
                      data-pswp-height={slide.height}
                      onClick={open}
                    >
                      <Image
                        className="tf-image-zoom lazyload"
                        data-zoom={slide.src}
                        data-src={slide.src}
                        ref={ref}
                        alt={slide.alt}
                        style={{ objectFit: "contain" }}
                        width={slide.width}
                        height={slide.height}
                        src={slide.src || NoImage}
                      />
                    </a>
                  )}
                </Item>
              )}
            </SwiperSlide>
          ))}

          {/* Navigation buttons */}
          <div className="swiper-button-next button-style-arrow thumbs-next"></div>
          <div className="swiper-button-prev button-style-arrow thumbs-prev"></div>
        </Swiper>
      </Gallery>
    </>
  );
}