"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XCircle, Loader2, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

function CancelPaymentContent() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const { t } = useTranslation();
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Safely get search params, handling null/undefined cases
        const searchParams = window.location.search || "";
        let invoice = "";
        let error = "";
        
        if (searchParams && searchParams.length > 0) {
          const params = new URLSearchParams(searchParams);
          invoice = params.get("invoiceNo") || "";
          error = params.get("error") || t("payment.Payment was canceled");
        }
        setInvoiceNo(invoice);
        // setErrorMessage(error || t("payment.Payment was canceled"));
        setMounted(true);
      } catch (error) {
        console.error("Error parsing URL search params:", error);
        // Set mounted anyway so the component renders
        setMounted(true);
        setInvoiceNo("unknown");
        // setErrorMessage("An unexpected error occurred");
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          // Redirect when countdown reaches 0
          window.location.href = "/my-account-orders";
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

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
      <XCircle className="text-danger mb-3" size={64} />
      <h2 className="text-danger">{t("payment.The transaction was canceled.")}</h2>
      <p className="mt-2 text-muted">
      {t("payment.Payment has been successfully cancelled. If you wish to pay again, please make a new payment.")}
      </p>
      {invoiceNo && (
        <p className="mt-2">
          {t("payment.Reference")}: <strong>{invoiceNo}</strong>
        </p>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3 mx-auto" style={{maxWidth: '400px'}}>
          <small>{errorMessage}</small>
        </div>
      )}
      
      {/* Countdown Animation */}
      <div className="mt-4">
        <p className="text-muted small">
        {t("payment.You will be redirected to your orders in")}{' '}
          <span className="fw-bold text-primary">{countdown}</span>{' '}
          {t("payment.seconds")}{countdown !== 1 ? '' : ''}...
        </p>
      </div>

      {/* Manual redirect button */}
      <div className="mt-4">
        <Link 
          href="/my-account-orders" 
          className="btn btn-outline-primary btn-sm"
        >
          <RefreshCw size={16} className="me-1" />
          {t("payment.Go to Orders Now")}
        </Link>
      </div>
    </section>
  );
}

// Disable SSR
const CancelPaymentPage = dynamic(() => Promise.resolve(CancelPaymentContent), {
  ssr: false,
});

export default CancelPaymentPage;