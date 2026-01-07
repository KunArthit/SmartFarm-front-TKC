"use client";
import { Suspense } from 'react';
import Invoice from "@/components/othersPages/invoice/Invoice";
import React from "react";

export default function page() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <Invoice />
    </Suspense>
  );
}

