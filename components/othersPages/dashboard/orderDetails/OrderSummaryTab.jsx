import React from "react";

export default function OrderSummaryTab({ t, orderData, formatCurrency }) {
  if (!orderData) return null;

  return (
    <div className="order-summary">
      <h6 className="mb-3">{t("detail.ordersummary")}</h6>
      <ul>
        <li className="d-flex justify-content-between text-2">
          <span>{t("detail.subtotal")}</span>
          <span className="fw-6">
            {formatCurrency(orderData.subtotal)}
          </span>
        </li>

        {orderData.shipping_cost &&
          Number(orderData.shipping_cost) > 0 && (
            <li className="d-flex justify-content-between text-2 mt_4">
              <span>{t("detail.shippingcost")}</span>
              <span className="fw-6">
                {formatCurrency(orderData.shipping_cost)}
              </span>
            </li>
          )}

        {orderData.tax_amount &&
          Number(orderData.tax_amount) > 0 && (
            <li className="d-flex justify-content-between text-2 mt_4 pb_8 line">
              <span>{t("detail.taxamount")}</span>
              <span className="fw-6">
                {formatCurrency(orderData.tax_amount)}
              </span>
            </li>
          )}

        <li className="d-flex justify-content-between text-2 mt_8">
          <span className="fw-6">{t("detail.totalamount")}</span>
          <span className="fw-6" style={{ color: "#28a745" }}>
            {formatCurrency(orderData.total_amount)}
          </span>
        </li>
      </ul>
    </div>
  );
}
