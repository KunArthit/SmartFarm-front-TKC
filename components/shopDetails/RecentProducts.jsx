"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard26 } from "../shopCards/ProductCard26";
import { Navigation, Pagination } from "swiper/modules";

export default function RecentProducts() {
  const [products, setProducts] = useState([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const mapped = data.map((item) => ({
            id: item.product_id,
            imgSrc: item.image || "/images/products/blank.png",
            imgHoverSrc: item.image || "/images/products/blank.png",
            title: item.product_name,
            price: parseFloat(item.price),
            filterCategories: item.solution_category_name
              ? [item.solution_category_name]
              : [],
            brand: "AgroSmart",
            isAvailable: item.stock_quantity > 0,
            colors: [
              {
                name: "Default",
                colorClass: "bg_gray",
                imgSrc: item.image || "/images/products/blank.png",
              },
            ],
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="flat-spacing-4 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">Recently Viewed</span>
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell wrap-sw-over"
            slidesPerView={4}
            spaceBetween={30}
            breakpoints={{
              1024: { slidesPerView: 4 },
              640: { slidesPerView: 3 },
              0: { slidesPerView: 2, spaceBetween: 15 },
            }}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp308",
              nextEl: ".snbn308",
            }}
            pagination={{ clickable: true, el: ".spd308" }}
          >
            {products.slice(4, 12).map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCard26 product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-recent box-icon w_46 round snbp308">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round snbn308">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-recent justify-content-center spd308" />
        </div>
      </div>
    </section>
  );
}