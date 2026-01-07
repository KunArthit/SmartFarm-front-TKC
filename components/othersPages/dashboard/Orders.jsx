"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import { useSnackbar } from "@/components/util/SnackbarContext";
import { format } from "date-fns";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const loadUserDataAndOrders = async () => {
      try {
        // Get user data from localStorage
        const storedUserData = localStorage.getItem("user_data");
        const token = localStorage.getItem("access_token");

        if (!storedUserData || !token) {
          setError("Please log in to view your orders");
          router.push("/login");
          return;
        }

        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);

        // Fetch orders from API
        await fetchOrders(parsedUserData.user_id, token);
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    loadUserDataAndOrders();
  }, [router]);

  const fetchOrders = async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const ordersData = await response.json();
      // console.log("Orders loaded:", ordersData);

      // Sort orders by order ID (newest first)
      const sortedOrders = Array.isArray(ordersData)
        ? ordersData.sort((a, b) => b.order_id - a.order_id)
        : [];

      setOrders(sortedOrders);
      // Reset to first page when new data is loaded
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    }
  };

  // Calculate pagination data
  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  // Pagination functions
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of table
      document
        .querySelector(".table-responsive")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      document
        .querySelector(".table-responsive")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      document
        .querySelector(".table-responsive")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates and filter out invalid values
    return rangeWithDots.filter(
      (item, index) =>
        rangeWithDots.indexOf(item) === index &&
        (item === "..." || (item >= 1 && item <= totalPages))
    );
  };

  // Helper functions
  // const formatDate = (dateString) => {
  //   if (!dateString) return "N/A";

  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     });
  //   } catch (error) {
  //     return "N/A";
  //   }
  // };

  const formatCurrency = (amount) => {
    if (!amount) return "฿0.00";
    return `฿${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadgeStyle = (status) => {
    const statusStyles = {
      paid: { backgroundColor: "#28a745", color: "#fff" },
      pending: { backgroundColor: "#ffc107", color: "#000" },
      processing: { backgroundColor: "#fd7e14", color: "#fff" },
      shipped: { backgroundColor: "#6f42c1", color: "#fff" },
      cancelled: { backgroundColor: "#dc3545", color: "#fff" },
      completed: { backgroundColor: "#28a745", color: "#fff" },
      // Legacy statuses
      confirmed: { backgroundColor: "#17a2b8", color: "#fff" },
      delivered: { backgroundColor: "#28a745", color: "#fff" },
      refunded: { backgroundColor: "#6c757d", color: "#fff" },
    };

    return (
      statusStyles[status?.toLowerCase()] || {
        backgroundColor: "#6c757d",
        color: "#fff",
      }
    );
  };

  const getOrderType = (order) => {
    if (order.is_bulk_order === 1) {
      return order.bulk_order_type
        ? `Bulk (${order.bulk_order_type})`
        : "Bulk Order";
    }
    return t("order.regularorder");
  };

  const getPaymentMethod = (method) => {
    const paymentMethods = {
      "2c2p": t("order.2c2p"),
      qr_code: t("order.promtpay"),
      bank_transfer: t("order.banktransfer"),
      credit_card: t("order.craditcard"),
    };

    return paymentMethods[method] || method || "N/A";
  };

  const updateOrderStatus = async (
    invoiceNo,
    newStatus,
    paymentDetails = {},
    options = { silent: false }
  ) => {
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return false;
      }

      const requestBody = {
        order_status: newStatus,
        payment_details: paymentDetails,
      };

      const response = await fetch(
        `${API_BASE_URL}/payment/order/status/${invoiceNo}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
          return false;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // const data = await response.json();
      // console.log("Order status updated:", data);

      // Refresh orders list
      if (userData?.user_id) {
        const token = localStorage.getItem("access_token");
        await fetchOrders(userData.user_id, token);
      }

      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      if (!options.silent) {
        alert("Failed to update order status. Please try again.");
      }
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      showSnackbar(t("Please provide a reason for cancellation"), "error");
      return;
    }

    if (!selectedOrder?.invoice_no) {
      showSnackbar(t("Invoice number not found"), "error");
      return;
    }

    const success = await updateOrderStatus(
      selectedOrder.invoice_no,
      "cancelled",
      {
        notes: cancelReason,
      }
    );

    if (success) {
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedOrder(null);
      showSnackbar(t("order.OrderCancelled"), "success");
    }
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  // Check if order can be cancelled (only pending orders)
  const canCancelOrder = (order) => {
    return order.order_status?.toLowerCase() === "pending";
  };

  const handlePayment = async (order) => {
    // แสดง Loading ทันที
    Swal.fire({
      title: t("order.CreatingPayment") || "Connecting to payment...",
      text:
        t("order.PleaseWait") || "Please wait while we prepare your payment.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // ยิงไปที่ Endpoint ใหม่สำหรับ "จ่ายซ้ำ"
      const response = await fetch(`${API_BASE_URL}/payment/retry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invoiceNo: order.invoice_no }), // ส่งแค่ Invoice No ไป
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create re-payment token");
      }

      // ได้รับ URL ใหม่สำหรับจ่ายเงิน
      if (data.webPaymentUrl) {
        Swal.close();
        // ส่งผู้ใช้ไปที่หน้าจ่ายเงิน 2C2P
        window.location.href = data.webPaymentUrl;
      } else {
        throw new Error("Payment URL not received.");
      }
    } catch (error) {
      console.error("Re-payment failed:", error);
      Swal.fire({
        icon: "error",
        title: t("order.Error") || "Error",
        text: error.message || "Could not connect to payment service.",
      });
    }
  };

  const handleView = (order) => {
    if (
      order.order_status === "pending" ||
      order.order_status === "paid" ||
      order.order_status === "completed"
    ) {
      return (
        <Link
          href={`/my-account-orders-details?id=${order.order_id}`}
          className="tf-btn btn-outline-primary btn-sm"
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          {t("order.view")}
        </Link>
      );
    } else {
      return "-";
    }
  };

  const copyTrackingNumber = (trackingNumber) => {
    const textArea = document.createElement("textarea");
    textArea.value = trackingNumber;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        Swal.fire({
          icon: "success",
          title: t("detail.Copied") || "Copied",
          text:
            t("detail.Trackingnumbercopiedtoclipboard") ||
            "Tracking number copied to clipboard",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          position: "top",
          background: "#d4edda",
          color: "#155724",
        });
      } else {
        prompt("Copy this tracking number:", trackingNumber);
      }
    } catch (err) {
      console.error("Copy failed: ", err);
      Swal.fire({
        icon: "error",
        title: "Copy failed",
        text: "Please copy manually: " + trackingNumber,
      });
    }
    document.body.removeChild(textArea);
  };

  if (loading) {
    return (
      <div className="my-account-content account-order">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="text-center">
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #0099FF",
                borderTop: "4px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <p>{t("order.Loading your orders...")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-content account-order">
        <div
          className="alert alert-danger"
          style={{
            padding: "20px",
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            color: "#721c24",
          }}
        >
          <h6>{t("order.errorload")}</h6>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        {orders.length === 0 ? (
          <div
            className="no-orders text-center"
            style={{ padding: "60px 20px" }}
          >
            <div
              style={{ fontSize: "48px", marginBottom: "20px", opacity: 0.3 }}
            >
              📦
            </div>
            <h5 style={{ marginBottom: "16px", color: "#6c757d" }}>
              {t("order.noorders")}
            </h5>
            <p style={{ color: "#6c757d", marginBottom: "24px" }}>
              {t("order.youhave")}
            </p>
            <Link
              href="/tkc-product"
              className="tf-btn btn-fill animate-hover-btn"
              style={{
                backgroundColor: "#0099FF",
                color: "white",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              {t("order.browseproducts")}
            </Link>
          </div>
        ) : (
          <>
            <div className="orders-summary mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>
                    {t("order.yourorder")} ({totalOrders})
                  </h5>
                  <p style={{ color: "#6c757d", fontSize: "14px", margin: 0 }}>
                    {t("order.track")}
                  </p>
                </div>
                <div style={{ fontSize: "14px", color: "#6c757d" }}>
                  {t("order.show")} {startIndex + 1}-
                  {Math.min(endIndex, totalOrders)} {t("order.of")}{" "}
                  {totalOrders} {t("order.list")}
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="fw-6" style={{ minWidth: "120px" }}>
                      {t("order.order")}
                    </th>
                    <th className="fw-6" style={{ minWidth: "100px" }}>
                      {t("order.date")}
                    </th>
                    <th className="fw-6" style={{ minWidth: "80px" }}>
                      {t("order.status")}
                    </th>
                    <th className="fw-6" style={{ minWidth: "80px" }}>
                      {t("order.type")}
                    </th>
                    <th className="fw-6" style={{ minWidth: "90px" }}>
                      {t("order.total")}
                    </th>
                    <th className="fw-6" style={{ minWidth: "80px" }}>
                      {t("order.payment")}
                    </th>
                    <th className="fw-6" style={{ minWidth: "80px" }}>
                      {t("order.action")}
                    </th>
                    <th className="fw-6" style={{ minWidth: "140px" }}>
                      {t("order.trackingnumber")}
                    </th>
                    <th className="fw-6" style={{ minWidth: "80px" }}>
                      {t("order.manage")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.order_id} className="tf-order-item">
                      <td>
                        <div>
                          <div className="fw-6">#{order.order_id}</div>
                          {order.invoice_no && (
                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                              {order.order_status === "pending"
                                ? `${order.quotation_no}`
                                : order.order_status === "paid" ||
                                  order.order_status === "completed"
                                ? `${order.invoice_no}`
                                : `-`}
                            </div>
                          )}
                        </div>
                      </td>

                      <td>{format(new Date(order.created_at), 'dd-MM-yyyy : HH:mm:ss')}</td>

                      <td>
                        <span
                          className="status-badge"
                          style={{
                            ...getStatusBadgeStyle(order.order_status),
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                            textTransform: "capitalize",
                          }}
                        >
                          {order.order_status}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: "13px" }}>
                          {getOrderType(order)}
                        </span>
                      </td>

                      <td>
                        <div>
                          <div className="fw-6">
                            {formatCurrency(order.total_amount)}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: "13px" }}>
                          {getPaymentMethod(order.payment_method)}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2 flex-column flex-md-row justify-content-center">
                          {handleView(order)}
                        </div>
                      </td>

                      <td>
                        {order.tracking_number ? (
                          <button
                            onClick={() =>
                              copyTrackingNumber(order.tracking_number)
                            }
                            className="tf-btn btn-outline-secondary btn-sm"
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              borderRadius: "4px",
                              border: "1px solid #6c757d",
                              background: "none",
                              color: "#6c757d",
                              cursor: "pointer",
                              maxWidth: "120px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={order.tracking_number}
                          >
                            📋{" "}
                            {order.tracking_number.length > 8
                              ? `${order.tracking_number.substring(0, 8)}...`
                              : order.tracking_number}
                          </button>
                        ) : (
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#6c757d",
                              justifyContent: "center",
                              display: "flex",
                            }}
                          >
                            -
                          </span>
                        )}
                      </td>

                      <td>
                        {/* Action buttons for pending orders (Pay / Cancel) */}
                        {canCancelOrder(order) ? (
                          <div
                            className="d-flex gap-2"
                            style={{
                              flexDirection: "column ",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              fullWidth
                              sx={{ fontSize: "11px", textTransform: "none" }}
                              variant="outlined"
                              color="success"
                              onClick={() => handlePayment(order)}
                              title={t("order.paynow")}
                            >
                              {t("order.paynow")}
                            </Button>

                            {/* Cancel button */}

                            <Button
                              fullWidth
                              sx={{ fontSize: "11px", textTransform: "none" }}
                              variant="outlined"
                              color="error"
                              onClick={() => openCancelModal(order)}
                            >
                              {isUpdatingStatus ? "..." : t("order.cancel")}
                            </Button>
                          </div>
                        ) : (
                          // Show '-' if not pending
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#6c757d",
                              justifyContent: "center",
                              display: "flex",
                            }}
                          >
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="pagination-wrapper"
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {/* Previous button */}
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #dee2e6",
                    backgroundColor: currentPage === 1 ? "#f8f9fa" : "white",
                    color: currentPage === 1 ? "#6c757d" : "#0099FF",
                    borderRadius: "4px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  ← {t("order.previous")}
                </button>

                {/* Page numbers */}
                {totalPages <= 7
                  ? // Show all pages if total pages is 7 or less
                    Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #dee2e6",
                            backgroundColor:
                              currentPage === page ? "#0099FF" : "white",
                            color: currentPage === page ? "white" : "#495057",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            minWidth: "40px",
                          }}
                        >
                          {page}
                        </button>
                      );
                    })
                  : // Show page numbers with ellipsis for more than 7 pages
                    getPageNumbers().map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            style={{
                              padding: "8px 4px",
                              color: "#6c757d",
                              fontSize: "14px",
                            }}
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #dee2e6",
                            backgroundColor:
                              currentPage === page ? "#0099FF" : "white",
                            color: currentPage === page ? "white" : "#495057",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            minWidth: "40px",
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}

                {/* Next button */}
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #dee2e6",
                    backgroundColor:
                      currentPage === totalPages ? "#f8f9fa" : "white",
                    color: currentPage === totalPages ? "#6c757d" : "#0099FF",
                    borderRadius: "4px",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {t("order.next")} →
                </button>
              </div>
            )}

            {/* Pagination info */}
            {totalPages > 1 && (
              <div
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#6c757d",
                }}
              >
                {t("order.page")} {currentPage} {t("order.of")} {totalPages}{" "}
                {t("order.pages")}
              </div>
            )}
          </>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: "20px" }}>
              <h5 style={{ margin: 0, marginBottom: "8px" }}>
                {t("order.cancel")}
              </h5>
              <p style={{ color: "#6c757d", margin: 0, fontSize: "14px" }}>
                {t("order.order")} #{selectedOrder?.order_id} -{" "}
                {selectedOrder?.invoice_no}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#495057",
                }}
              >
                {t("order.reason")} <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={t("order.enterreason")}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  resize: "vertical",
                  minHeight: "100px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <Button
                // color="inherit"
                sx={{ textTransform: "none" }}
                disabled={isUpdatingStatus}
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedOrder(null);
                }}
              >
                {t("order.close")}
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{ textTransform: "none" }}
                disabled={isUpdatingStatus || !cancelReason.trim()}
                onClick={() => {
                  handleCancelOrder();
                }}
              >
                {isUpdatingStatus ? t("order.Cancelling") : t("confirm")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
        }

        .table th,
        .table td {
          padding: 12px 8px;
          border-bottom: 1px solid #dee2e6;
          vertical-align: middle;
          white-space: nowrap;
        }

        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
          border-top: 1px solid #dee2e6;
          font-size: 13px;
        }

        .tf-order-item:hover {
          background-color: #f8f9fa;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .pagination-wrapper button:hover:not(:disabled) {
          background-color: #0099ff !important;
          color: white !important;
          border-color: #0099ff !important;
        }

        .tf-btn.btn-outline-danger:hover {
          background-color: #dc3545 !important;
          color: white !important;
        }

        @media (max-width: 768px) {
          .table th,
          .table td {
            padding: 8px 4px;
            font-size: 12px;
          }

          /* Hide some columns on mobile to save space */
          .table th:nth-child(4), /* Type */
          .table td:nth-child(4),
          .table th:nth-child(6), /* Payment */
          .table td:nth-child(6) {
            display: none;
          }

          .d-flex.gap-2 {
            flex-direction: column;
            gap: 4px !important;
          }

          .pagination-wrapper {
            gap: 4px !important;
          }

          .pagination-wrapper button {
            padding: 6px 8px !important;
            font-size: 12px !important;
            min-width: 32px !important;
          }

          .orders-summary .d-flex {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 8px;
          }

          .modal-content {
            padding: 16px !important;
            margin: 16px !important;
          }
        }

        @media (max-width: 480px) {
          /* Further reduce columns on very small screens */
          .table th:nth-child(3), /* Status */
          .table td:nth-child(3) {
            display: none;
          }

          .table th,
          .table td {
            padding: 6px 3px;
            font-size: 11px;
          }
        }

        .orders-summary h5 {
          margin: 0;
          line-height: 1.4;
          padding-top: 4px;
        }
      `}</style>
    </div>
  );
}
