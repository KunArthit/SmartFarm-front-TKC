import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";
import LoginForm from "@/components/auth/Login";
import React from "react";

export const metadata = {
  title: "Login || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};

export default function page() {
  return (
    <>
      <Header7 />
      <Nav />
      <LoginForm />
    </>
  );
}
