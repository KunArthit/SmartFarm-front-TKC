"use client";
import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import { useTranslation } from "react-i18next";

// ฟังก์ชันตรวจสอบภาษาไทย
function isThai(text) {
  return typeof text === 'string' && /[\u0E00-\u0E7F]/.test(text);
}

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [productForTabs, setProductForTabs] = useState(null);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://myfarmsuk.com/api';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/products/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
        const productDataArray = await res.json();
        
        // Check if response is array (multi-language format)
        if (!Array.isArray(productDataArray) || productDataArray.length === 0) {
          throw new Error('Invalid product data received');
        }

        if (!isMounted) return;

        // Get current language
        const currentLang = i18n.language === 'th' ? 'th' : 'en';
        
        // Find product data for current language
        let productData = productDataArray.find(p => p.lang === currentLang);
        
        // Fallback to first available language if current language not found
        if (!productData) {
          productData = productDataArray[0];
          console.warn(`Product data not found for language: ${currentLang}, using fallback`);
        }

        if (!productData || !productData.product_id) {
          throw new Error('Invalid product data structure');
        }

        // Set product for display
        setProduct({
          id: productData.product_id,
          product_id: productData.product_id,
          title: productData.name,
          name: productData.name,
          price: parseFloat(productData.sale_price || productData.price),
          originalPrice: productData.sale_price ? parseFloat(productData.price) : null,
          filterCategories: [productData.solution_category_name || "Electronics"],
          imgSrc: productData.images?.[0] || "/images/products/blank.png",
          images: productData.images || ["/images/products/blank.png"],
          videos: productData.videos || [],
          description: productData.description,
          short_description: productData.short_description,
          sku: productData.sku,
          stock_quantity: productData.stock_quantity,
          is_featured: productData.is_featured,
          solution_category_name: productData.solution_category_name,
          product_category_name: productData.product_category_name,
          is_active: productData.is_active,
          lang: productData.lang,
        });

        // Set product for tabs component
        setProductForTabs({
          product_id: productData.product_id,
          name: productData.name,
          description: productData.description,
          short_description: productData.short_description,
          sku: productData.sku,
          price: productData.price,
          sale_price: productData.sale_price,
          stock_quantity: productData.stock_quantity,
          solution_category_name: productData.solution_category_name,
          product_category_name: productData.product_category_name,
          images: productData.images || [],
          videos: productData.videos || [],
          is_featured: productData.is_featured,
          is_active: productData.is_active,
          created_at: productData.created_at,
          updated_at: productData.updated_at,
          lang: productData.lang,
        });

        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching product:', err);
        setError(err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, API_BASE_URL, i18n.language]); //เพิ่ม i18n.language เป็น dependency

  if (loading) {
    return (
      <>
        <Header7 />
        <Nav />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        </div>
        <Footer1 />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header7 />
        <Nav />
        <div className="tf-breadcrumb">
          <div className="container">
            <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
              <div className="tf-breadcrumb-list">
                <Link href={`/`} className="text">Home</Link>
                <i className="icon icon-arrow-right" />
                <span className="text">Product Not Found</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-5">
          <div className="text-center">
            <h2>Product Not Found</h2>
            <p>The product you're looking for could not be loaded.</p>
            <p className="text-muted">Error: {error?.message}</p>
            <Link href="/" className="btn btn-primary">Return to Home</Link>
          </div>
        </div>
        <Footer1 />
      </>
    );
  }

  return (
    <>
      <Header7 />
      <Nav />
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link href={`/`} className="text">Home</Link>
              <i className="icon icon-arrow-right" />
              <span className="text">{product.title || product.name || "Product Details"}</span>
            </div>
          </div>
        </div>
      </div>
      <DetailsOuterZoom product={product} />
      <ShopDetailsTab product={productForTabs} />
      <Footer1 />
    </>
  );
}