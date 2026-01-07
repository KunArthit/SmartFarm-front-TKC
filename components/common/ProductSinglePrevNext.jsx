import { allProducts } from "@/data/products";
import Link from "next/link";
import React from "react";

export default function ProductSinglePrevNext({ currentId = 1 }) {
  const currentIndex = allProducts.findIndex(p => p.id === currentId);
  const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null;
  const nextProduct = currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : null;

  return (
    <div className="tf-breadcrumb-prev-next">
      {prevProduct && (
        <Link
          href={`/product-detail/${prevProduct.id}`}
          className="tf-breadcrumb-prev hover-tooltip center"
        >
          <i className="icon icon-arrow-left" />
        </Link>
      )}
      <a href="#" className="tf-breadcrumb-back hover-tooltip center">
        <i className="icon icon-shop" />
      </a>
      {nextProduct && (
        <Link
          href={`/product-detail/${nextProduct.id}`}
          className="tf-breadcrumb-next hover-tooltip center"
        >
          <i className="icon icon-arrow-right" />
        </Link>
      )}
    </div>
  );
}
