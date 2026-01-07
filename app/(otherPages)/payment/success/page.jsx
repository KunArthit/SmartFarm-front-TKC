"use client";

import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import PaymentSuccessPage from "@/components/othersPages/PaymentSuccess";
import React from "react";

export default function page() {
  return (
    <>
      <Header7 />
      <Nav />
      <PaymentSuccessPage />
      <Footer1 />
    </>
  );
}
