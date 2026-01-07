"use client";

import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Wegive from "@/components/homes/multi-brand/BannerCollection";
import Solution from "@/components/homes/multi-brand/Categories";
import Justforyou from "@/components/homes/multi-brand/Categories2";
import Mission from "@/components/homes/multi-brand/Mission";
import Agriculture from "@/components/homes/multi-brand/Collection";
import Hero from "@/components/homes/multi-brand/Hero";
import Farmsuk from "@/components/homes/multi-brand/Products";
import Vision from "@/components/homes/multi-brand/Testimonials";
import React, { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import PDPAConsentBanner from "@/components/homes/multi-brand/PDPAConsentBanner";
import Nav from "@/components/headers/Nav";

export default function Home() {
  const { theme } = useContext(ThemeContext);
  
  // Create main container style based on theme
  const mainContainerStyle = {
    backgroundColor: theme?.backgroundColor || '#ffffff',
    color: theme?.backgroundColor === '#121212' ? '#ffffff' : '#333333', // Use light text on dark backgrounds
    transition: 'all 0.3s ease',
  };

  return (
    <div className="kanit" style={mainContainerStyle}>
      <Header7 />
      <Nav />
      <Hero />
      <Farmsuk />
      <Agriculture />
      <Wegive />
      <br></br>
      <Vision />
      <div className="mt-5"></div>
      <Mission />
      <Solution />
      <Justforyou />
      <PDPAConsentBanner />
      <Footer1 bgColor={theme?.backgroundColor === '#ffffff' ? "background-gray" : "background-dark"} />
    </div>
  );
}