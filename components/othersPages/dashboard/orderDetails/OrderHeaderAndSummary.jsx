import React from "react";
import Swal from "sweetalert2";

export default function OrderHeaderAndSummary({
  t,
  orderData,
  router,
  formatDate,
  formatCurrency,
  getStatusColor,
  getOrderType,
  getPaymentMethod,
  formatPaymentDetails,
}) {
  if (!orderData) return null;

  const isQuotation = orderData.order_status === "pending";

  const docUrl = isQuotation
    ? `/quotation?id=${orderData.order_id}&quotation=${orderData.quotation_no}`
    : `/invoice?id=${orderData.order_id}&invoice=${orderData.invoice_no}`;

  return (
    <>
      {/* Header */}
      <div className="order-head">
        <figure className="img-product">
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            {orderData.is_bulk_order === 1 ? "📦" : "🛍️"}
          </div>
        </figure>
        <div className="content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              className="badge"
              style={{
                backgroundColor: getStatusColor(orderData.order_status),
                color: "white",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "500",
                textTransform: "capitalize",
              }}
            >
              {orderData.order_status}
            </div>
          </div>

          <h6 className="mt-8 fw-5">
            {t("detail.Order")} #{orderData.order_id}
          </h6>

          {orderData.invoice_no && (
            <p
              style={{
                fontSize: "14px",
                color: "#6c757d",
                margin: "4px 0 0 0",
              }}
            >
              {isQuotation ? t("detail.quotation") : t("detail.invoice")}:{" "}
              {isQuotation ? orderData.quotation_no : orderData.invoice_no}:{" "}
            </p>
          )}
        </div>
      </div>

      {/* Summary Grid */}
      <div className="tf-grid-layout md-col-2 gap-15">
        <div className="item">
          <div className="text-2 text_black-2">{t("order.ordertype")}</div>
          <div className="text-2 mt_4 fw-6">{getOrderType()}</div>
        </div>

        <div className="item">
          <div className="text-2 text_black-2">{t("order.paymentmethod")}</div>
          <div className="text-2 mt_4 fw-6">
            {getPaymentMethod(orderData.payment_method)}
          </div>
        </div>

        <div className="item">
          <div className="text-2 text_black-2">{t("order.orderdate")}</div>
          <div className="text-2 mt_4 fw-6">
            {formatDate(new Date(orderData.created_at), 'dd-MM-yyyy : HH:mm:ss')}
          </div>
        </div>

        <div className="item">
          <div className="text-2 text_black-2">{t("order.totalamount")}</div>
          <div className="text-2 mt_4 fw-6">
            {formatCurrency(orderData.total_amount)}
          </div>
        </div>

        {/* Tracking number */}
        {orderData.tracking_number && (
          <div className="item" style={{ gridColumn: "span 2" }}>
            <div className="text-2 text_black-2">
              {t("order.trackingnumber")}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              <div
                className="text-2 mt_4 fw-6"
                style={{ cursor: "pointer", color: "#007bff", flex: 1 }}
                onClick={() => {
                  const textArea = document.createElement("textarea");
                  textArea.value = orderData.tracking_number;
                  document.body.appendChild(textArea);
                  textArea.select();
                  try {
                    const successful = document.execCommand("copy");
                    if (successful) {
                      Swal.fire({
                        icon: "success",
                        title: t("detail.Copied"),
                        text: t("detail.Trackingnumbercopiedtoclipboard"),
                        showConfirmButton: false,
                        timer: 2000,
                        toast: true,
                        position: "top",
                        background: "#d4edda",
                        color: "#155724",
                      });
                    } else {
                      prompt(
                        "Copy this tracking number:",
                        orderData.tracking_number
                      );
                    }
                  } catch (err) {
                    console.error("Copy failed: ", err);
                    Swal.fire({
                      icon: "error",
                      title: "Copy failed",
                      text:
                        "Please copy manually: " + orderData.tracking_number,
                    });
                  }
                  document.body.removeChild(textArea);
                }}
                title={t("detail.Clicktocopytrackingnumber")}
              >
                {orderData.tracking_number}
              </div>
            </div>
          </div>
        )}

        {/* Invoice / Quotation */}
        {orderData.invoice_no && (
          <>
            <div className="item">
              <div className="text-2 text_black-2">
                {isQuotation ? t("order.quotation") : t("order.invoice")}
              </div>
              <div className="text-2 fw-6 mt_4" style={{ color: "#333" }}>
                #{isQuotation ? orderData.quotation_no : orderData.invoice_no}:{" "}
              </div>
            </div>

            <div className="item">
              <div className="text-2 text_black-2">{t("order.action")}</div>
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => {
                    window.open(docUrl, '_blank');
                  }}
                  style={{
                    background: "linear-gradient(135deg, #0099FF)",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 4px rgba(40, 167, 69, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(40, 167, 69, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 4px rgba(40, 167, 69, 0.2)";
                  }}
                >
                  <span>📄</span>
                  {isQuotation
                    ? t("order.viewquotation")
                    : t("order.viewinvoice")}
                </button>
              </div>
            </div>
          </>
        )}

        {orderData.notes && (
          <div className="item">
            <div className="text-2 text_black-2">{t("order.specialnotes")}</div>
            <div className="text-2 mt_4 fw-6">
              {formatPaymentDetails(orderData.notes)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
