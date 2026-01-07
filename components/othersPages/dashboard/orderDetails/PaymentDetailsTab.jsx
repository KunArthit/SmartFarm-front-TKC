import React from "react";

export default function PaymentDetailsTab({
  t,
  orderData,
  formatCurrency,
  getPaymentMethod,
}) {

  const isQuotation = orderData.order_status === "pending"
  if (!orderData) return null;

  return (
    <div className="payment-details">
      <h6 className="mb-3">{t("detail.paymentinfo")}</h6>
      <div className="info-grid">
        <div className="info-item mb-3">
          <strong>{t("detail.paymentmethod")}:</strong>
          <div className="mt-1">
            {getPaymentMethod(orderData.payment_method)}
          </div>
        </div>

        <div className="info-item mb-3">
          <strong>{t("detail.paymentstatus")}:</strong>
          <div className="mt-1">
            <span
              style={{
                backgroundColor:
                  orderData.order_status === "paid" || orderData.order_status === "completed"
                    ? "#28a745"
                    : "#ffc107",
                color: "white",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            >
              {orderData.order_status === "paid" ? "Paid" : orderData.order_status === "completed" ? "Completed" : "Pending"}
            </span>
          </div>
        </div>

        <div className="info-item mb-3">
          <strong>{t("detail.invoicenumber")}:</strong>
          <div className="mt-1">{isQuotation ? orderData.quotation_no : orderData.invoice_no}</div>
        </div>

        <div className="info-item mb-3">
          <strong>{t("detail.amountpaid")}:</strong>
          <div className="mt-1 fw-6" style={{ color: "#28a745" }}>
            {formatCurrency(orderData.total_amount)}
          </div>
        </div>
      </div>
    </div>
  );
}
