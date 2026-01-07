"use client";

import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import AccountAddress from "@/components/othersPages/dashboard/AccountAddress";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import React from "react";
import { useTranslation } from "react-i18next";


export default function page() {
  const { t } = useTranslation();

  return (
    <>
      <Header7 />
      <Nav />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{t("auth.myaccountaddress")}</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <AccountAddress />
            </div>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
