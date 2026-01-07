import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import Checkout from "@/components/othersPages/Checkout";
import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata = {
  title: "Checkout || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};
export default function page() {
  return (
    <>
    <ProtectedRoute>
      <Header7 />
      <Nav />
      <Checkout />
      <Footer1 />
    </ProtectedRoute>
    </>
  );
}
