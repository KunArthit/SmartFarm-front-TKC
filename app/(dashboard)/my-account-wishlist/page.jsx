import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import Wishlist from "@/components/othersPages/dashboard/Wishlist";
import React from "react";

export const metadata = {
  title: "My Account Wishlist || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};
export default function page() {
  return (
    <>
      <Header7 />
      <Nav />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Account Wishlist</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <Wishlist />
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
