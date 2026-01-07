import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import Cart from "@/components/othersPages/Cart";
import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export const metadata = {
  title: "View Cart || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};
export default function page() {
  return (
    <>
    <ProtectedRoute>
      <Header7 />
      <Nav />
      <Cart />
      <Footer1 />
      </ProtectedRoute>
    </>
  );
}
