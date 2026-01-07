import React from "react";

export default function OrderInfoTab({
  t,
  orderData,
  formatDate,
  formatCurrency,
  getPaymentMethod,
  getOrderType,
  formatPaymentDetails,
}) {
  if (!orderData) return null;
  const isQuotation = orderData.order_status === "pending";
  return (
    <>
      <p className="text-2 text_success mb-3">{t("detail.thankyou")}</p>
      <ul className="mt_20">
        <li className="mb-2">
          <strong>{t("detail.ordernumber")}:</strong>{" "}
          <span className="fw-7">#{orderData.order_id}</span>
        </li>
        <li className="mb-2">
          <strong>{t("detail.invoicenumber")}:</strong>{" "}
          <span className="fw-7">{isQuotation ? orderData.quotation_no : orderData.invoice_no}</span>
        </li>
        <li className="mb-2">
          <strong>{t("detail.date")}:</strong>{" "}
          <span className="fw-7">{formatDate(new Date(orderData.created_at), 'dd-MM-yyyy : HH:mm:ss')}</span>
        </li>
        <li className="mb-2">
          <strong>{t("detail.total")}:</strong>{" "}
          <span className="fw-7">{formatCurrency(orderData.total_amount)}</span>
        </li>
        <li className="mb-2">
          <strong>{t("detail.paymentmethod")}:</strong>{" "}
          <span className="fw-7">
            {getPaymentMethod(orderData.payment_method)}
          </span>
        </li>
        <li className="mb-2">
          <strong>{t("detail.ordertype")}:</strong>{" "}
          <span className="fw-7">{getOrderType()}</span>
        </li>
        {orderData.tracking_number && (
          <li className="mb-2">
            <strong>{t("detail.trackingnumber")}:</strong>{" "}
            <span className="fw-7">{orderData.tracking_number}</span>
          </li>
        )}
        {orderData.notes && (
          <li className="mb-2">
            <strong>{t("detail.specialnotes")}:</strong>{" "}
            <span className="fw-7">
              {formatPaymentDetails(orderData.notes)}
            </span>
          </li>
        )}
      </ul>
    </>
  );
}
