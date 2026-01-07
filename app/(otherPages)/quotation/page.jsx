"use client";
import { Suspense } from 'react';
import Quotation from "@/components/othersPages/Quotation/Quotation";
import React from "react";

export default function page() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <Quotation />
    </Suspense>
  );
}

