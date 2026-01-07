import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import ProductStyle7 from "@/components/shop/ProductStyle7";
import Nav from "@/components/headers/Nav";
import React from "react";

export const metadata = {
  title: "IoT Devices || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};

export default function page() {
  return (
    <>
      <Header7 />
      <Nav />
      <ProductStyle7 />
      <Footer1 />
    </>
  );
}