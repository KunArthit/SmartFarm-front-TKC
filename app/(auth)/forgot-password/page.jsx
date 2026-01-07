import Header7 from "@/components/headers/Header7";
import Forgotpassword from "@/components/auth/Forgotpassword";
import React from "react";

export const metadata = {
  title: "Reset Password || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};

export default function page() {
  return (
    <>
      <Header7 />
      <Forgotpassword />
    </>
  );
}