"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

function PaymentSuccessContent() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Safely get search params, handling null/undefined cases
        const searchParams = window.location.search || "";
        let invoice = "";
        
        if (searchParams && searchParams.length > 0) {
          const params = new URLSearchParams(searchParams);
          invoice = params.get("invoiceNo") || "";
        }
        
        setInvoiceNo(invoice);
        setMounted(true);

        // Redirect after 5 seconds
        setTimeout(() => {
          window.location.href = "/my-account-orders";
        }, 5000);
      } catch (error) {
        console.error("Error parsing URL search params:", error);
        // Set mounted anyway so the component renders
        setMounted(true);
        setInvoiceNo("unknown");
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="text-center p-5">
        <Loader2 className="animate-spin mb-2" size={48} />
        <h3>{t("payment.Loading...")}</h3>
      </div>
    );
  }

  return (
    <section className="text-center p-5">
      <CheckCircle className="text-success mb-3" size={64} />
      <h2 className="text-success">{t("payment.Payment Successful")}</h2>
      <p>{t("payment.You will be redirected to your orders shortly...")}</p>
      <Link href="/my-account-orders" className="btn btn-primary mt-4">
      {t("payment.Go to My Orders Now")}
      </Link>
    </section>
  );
}

// Disable SSR
const PaymentSuccessPage = dynamic(() => Promise.resolve(PaymentSuccessContent), {
  ssr: false,
});

export default PaymentSuccessPage;