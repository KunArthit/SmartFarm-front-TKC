import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import About from "@/components/othersPages/about/About";
import TermsConditionPage from "@/components/othersPages/terms/TermsCondition";
import React from "react";

export const metadata = {
  title: "Terms And Conditions || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};

export default function page() {
  return (
    <>
      <Header7 />
      <Nav />
      <TermsConditionPage />
      <Footer1 />
    </>
  );
}
