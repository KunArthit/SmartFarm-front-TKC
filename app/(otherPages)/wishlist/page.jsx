import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import Wishlist from "@/components/othersPages/Wishlist";
import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";  

export const metadata = {
  title: "Wishlist || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};
export default function page() {
  return (
    <>
    <ProtectedRoute>
      {/* <Topbar1 /> */}
      <Header7 />
      <Nav />
      <Wishlist />
      <Footer1 />
      </ProtectedRoute>
    </>
  );
}
