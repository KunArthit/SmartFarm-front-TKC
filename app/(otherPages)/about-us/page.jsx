import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import About from "@/components/othersPages/about/About";
import React from "react";

export const metadata = {
  title: "About Us || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};

export default function page() {
  return (
    <>
      <Header7 />
      <Nav />
      <About />
      <Footer1 />
    </>
  );
}
