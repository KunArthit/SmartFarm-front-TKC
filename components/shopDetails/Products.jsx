"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "../shopCards/ProductCard";

export default function Products() {
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
    <section className="flat-spacing-1 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">People Also Bought</span>
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
              prevEl: ".snbp3070",
              nextEl: ".snbn3070",
            }}
            pagination={{ clickable: true, el: ".spd307" }}
          >
            {products.slice(0, 8).map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-product box-icon w_46 round snbp3070">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-product box-icon w_46 round snbn3070">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-product justify-content-center spd307" />
        </div>
      </div>
    </section>
  );
}