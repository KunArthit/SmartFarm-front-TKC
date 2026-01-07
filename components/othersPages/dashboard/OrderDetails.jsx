"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

import orderDetailsStyles from "./orderDetails/orderDetailsStyles";
import OrderHeaderAndSummary from "./orderDetails/OrderHeaderAndSummary";
import OrderItemsTab from "./orderDetails/OrderItemsTab";
import OrderHistoryTab from "./orderDetails/OrderHistoryTab";
import PackageTrackingTab from "./orderDetails/PackageTrackingTab";
import OrderSummaryTab from "./orderDetails/OrderSummaryTab";
import PaymentDetailsTab from "./orderDetails/PaymentDetailsTab";
import OrderInfoTab from "./orderDetails/OrderInfoTab";

// Create a separate component for the search params logic
function OrderDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemsError, setItemsError] = useState("");
  const [productsError, setProductsError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0]; // จะได้ "th" หรือ "en"

  const uniqueItemIds = [...new Set(orderItems.map((item) => item.item_id))];

  // วนลูป ID ที่ไม่ซ้ำกันนี้ เพื่อเลือก item ที่ดีที่สุดสำหรับแต่ละ ID
  const filteredOrderItems = uniqueItemIds
    .map((id) => {
      // หา item ทั้งหมดที่มี ID นี้ (เช่น ทั้ง th และ en ของ item_id 263)
      const allVersions = orderItems.filter((item) => item.item_id === id);

      // พยายามหาอันที่ตรงกับภาษาปัจจุบัน
      let bestMatch = allVersions.find((item) => item.lang === currentLang);
      if (bestMatch) return bestMatch;

      // ถ้าไม่เจอ ให้ใช้ภาษาอังกฤษ "en" เป็นภาษาสำรอง (Fallback)
      bestMatch = allVersions.find((item) => item.lang === "en");
      if (bestMatch) return bestMatch;

      // ถ้าไม่มีภาษาอังกฤษอีก ให้เอาตัวแรกที่เจอมาแสดง (กันหน้าโล่ง)
      return allVersions[0];
    })
    .filter(Boolean);

  // Tracking-related state
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const THAI_POST_TOKEN = process.env.NEXT_PUBLIC_THAI_POST_TOKEN;

  useEffect(() => {
    const orderId = searchParams.get("id");

    if (!orderId) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    // โหลดรายละเอียดออเดอร์ก่อน แล้วค่อยตัดสินใจว่าจะโหลด /order-items ไหม
    fetchOrderDetails(orderId);
  }, [searchParams]);

  // Thailand Post tracking functionality
  useEffect(() => {
    const fetchTrackingStatus = async () => {
      if (!orderData?.tracking_number || !THAI_POST_TOKEN) return;

      setTrackingLoading(true);
      setTrackingError("");
      try {
        const response = await axios.post(
          "https://trackapi.thailandpost.co.th/post/api/v1/track",
          {
            status: "all",
            language: "TH",
            barcode: [orderData.tracking_number],
          },
          {
            headers: {
              Authorization: `Token ${THAI_POST_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const items = response.data.response.items[orderData.tracking_number];
        if (items) {
          setTrackingData(items);
        } else {
          setTrackingError("No tracking data found for this tracking number.");
        }
      } catch (err) {
        console.error("Tracking API error:", err);
        setTrackingError("Failed to fetch tracking status. Please try again.");
      } finally {
        setTrackingLoading(false);
      }
    };

    if (orderData?.tracking_number) {
      fetchTrackingStatus();
    }
  }, [orderData?.tracking_number, THAI_POST_TOKEN]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("Order details loaded:", data);
      setOrderData(data);

      // ใช้รายการ items จากรายละเอียดออเดอร์ก่อน (มี product_name/sku)
      const itemsFromOrder = Array.isArray(data.items) ? data.items : [];
      if (itemsFromOrder.length > 0) {
        setOrderItems(itemsFromOrder);
        fetchProductDetails(itemsFromOrder); // ยังดึงข้อมูลสินค้าเพื่องานรูป/stock ได้
      } else {
        // ถ้าไม่มีรายการในรายละเอียด ค่อย fallback ไปดึง /order-items
        fetchOrderItems(orderId);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId) => {
    setItemsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/order-items/order/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("Order items loaded:", data);
      const items = Array.isArray(data) ? data : [];

      // enrich: ผูก product_name/sku จาก orderData.items ถ้ามี
      const index =
        orderData?.items?.reduce((acc, x) => {
          acc[x.product_id] = x;
          return acc;
        }, {}) || {};
      const enriched = items.map((it) => ({
        ...it,
        product_name: it.product_name ?? index[it.product_id]?.product_name,
        sku: it.sku ?? index[it.product_id]?.sku,
      }));

      setOrderItems(enriched);
      // console.log("Order items set:", enriched);

      if (enriched.length > 0) {
        fetchProductDetails(enriched);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      setItemsError("Failed to load order items.");
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchProductDetails = async (items) => {
    setProductsLoading(true);
    setProductsError("");

    try {
      const token = localStorage.getItem("access_token"); // items ที่รับเข้ามา คือ array ที่กรองภาษาแล้ว

      const productPromises = items.map(async (item) => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/products/${item.product_id}`,
            {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            console.warn(
              `Failed to fetch product ${item.product_id}: ${res.status}`
            );
            const fallbackData = {
              id: item.product_id,
              name: item.product_name ?? null,
              image: item.images ?? null, // item.images จาก JSON คือ string URL
              images: item.images ? [item.images] : [],
              sku: item.sku ?? null,
              short_description: "",
              stock_quantity: undefined,
              is_featured: 0,
              price: item.unit_price ?? null,
            };
            return {
              productId: item.product_id,
              data: fallbackData,
              error: false,
            }; 
          }

          const raw = await res.json(); 

          let allImages = [];
          if (Array.isArray(raw.images) && raw.images.length > 0) {
            allImages = raw.images;
          } else if (raw.image) {
            allImages = [raw.image];
          } else if (item.images) {
            allImages = [item.images];
          } 

          const mainImage = raw.image ?? allImages[0] ?? null;

          const normalized = {
            id: raw.product_id ?? raw.id ?? item.product_id,
            name: raw.product_name ?? raw.name ?? item.product_name ?? null,
            image: mainImage,
            images: allImages,

            sku: raw.sku ?? item.sku ?? null,
            short_description: raw.short_description ?? "",
            stock_quantity: raw.stock_quantity ?? undefined,
            is_featured: Number(raw.is_featured) === 1 ? 1 : 0,
            price: raw.price ?? raw.product_price ?? item.unit_price ?? null,
          };

          return { productId: item.product_id, data: normalized, error: false };
        } catch (e) {
          console.error(`Error fetching product ${item.product_id}:`, e);
          const fallbackData = {
            id: item.product_id,
            name: item.product_name ?? null,
            image: item.images ?? null,
            images: item.images ? [item.images] : [],
            sku: item.sku ?? null,
            short_description: "",
            stock_quantity: undefined,
            is_featured: 0,
            price: item.unit_price ?? null,
          };
          return {
            productId: item.product_id,
            data: fallbackData,
            error: false,
          };
        }
      });

      const results = await Promise.all(productPromises);
      const map = {};
      results.forEach((r) => {
        if (r.data) {
          map[r.productId] = r.data;
        }
      });
      // console.log("Final ProductDetails Map:", map);
      setProductDetails(map);
    } catch (e) {
      console.error("Error fetching product details:", e);
      setProductsError("Failed to load product details");
    } finally {
      setProductsLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus, paymentDetails = {}) => {
    if (!orderData?.invoice_no) {
      alert("Invoice number not found");
      return false;
    }

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
        `${API_BASE_URL}/order/status/${orderData.invoice_no}`,
        {
          method: "PUT",
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

      const data = await response.json();
      // console.log("Order status updated:", data);

      // Refresh order details
      const orderId = searchParams.get("id");
      if (orderId) {
        await fetchOrderDetails(orderId);
      }

      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    const success = await updateOrderStatus("cancelled", {
      notes: cancelReason,
    });

    if (success) {
      setShowCancelModal(false);
      setCancelReason("");
      alert("Order has been cancelled successfully");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "฿0.00";
    return `฿${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      paid: "#28a745",
      pending: "#ffc107",
      processing: "#fd7e14",
      shipped: "#6f42c1",
      cancelled: "#dc3545",
      completed: "#28a745",
      // Legacy statuses for backward compatibility
      confirmed: "#17a2b8",
      delivered: "#28a745",
      refunded: "#6c757d",
    };
    return statusColors[status?.toLowerCase()] || "#6c757d";
  };

  const getOrderType = () => {
    if (!orderData) return "";
    if (orderData.is_bulk_order === 1) {
      return orderData.bulk_order_type
        ? `Bulk (${orderData.bulk_order_type})`
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

  const parsePaymentDetails = (notes) => {
    if (!notes) return null;

    if (notes.includes("Payment Status:") || notes.includes('"status"')) {
      try {
        const jsonMatch = notes.match(/\{.*\}/);
        if (jsonMatch) {
          const paymentData = JSON.parse(jsonMatch[0]);
          return {
            status: paymentData.status,
            transactionRef: paymentData.transaction_ref,
            approvalCode: paymentData.approval_code,
            amountPaid: paymentData.amount_paid,
            paymentDate: paymentData.payment_date,
            paymentMethod: paymentData.payment_method,
          };
        }
      } catch (error) {
        console.warn("Could not parse payment details from notes:", error);
      }
    }

    return null;
  };

  const formatPaymentDetails = (notes) => {
    const paymentDetails = parsePaymentDetails(notes);

    if (paymentDetails) {
      return (
        <div className="payment-details-formatted">
          <div className="payment-status">
            <strong>{t("detail.paymentstatus")}:</strong>{" "}
            <span className={`status-badge ${paymentDetails.status}`}>
              {paymentDetails.status === "completed"
                ? "Completed"
                : paymentDetails.status}
            </span>
          </div>
          {paymentDetails.transactionRef && (
            <div className="payment-ref">
              <strong>{t("detail.transaction")}:</strong>{" "}
              {paymentDetails.transactionRef}
            </div>
          )}
          {paymentDetails.approvalCode && (
            <div className="approval-code">
              <strong>{t("detail.approvalcode")}:</strong>{" "}
              {paymentDetails.approvalCode}
            </div>
          )}
          {paymentDetails.amountPaid && (
            <div className="amount-paid">
              <strong>{t("detail.amountpaid")}:</strong>{" "}
              {formatCurrency(paymentDetails.amountPaid)}
            </div>
          )}
          {paymentDetails.paymentDate && (
            <div className="payment-date">
              <strong>{t("detail.paymentdate")}:</strong>{" "}
              {formatDate(paymentDetails.paymentDate)}
            </div>
          )}
          {paymentDetails.paymentMethod && (
            <div className="payment-method-detail">
              <strong>{t("detail.paymentmethod")}:</strong>{" "}
              {paymentDetails.paymentMethod}
            </div>
          )}
        </div>
      );
    }

    return notes;
  };

  const refreshTracking = async () => {
    if (!orderData?.tracking_number || !THAI_POST_TOKEN) return;

    setTrackingLoading(true);
    setTrackingError("");
    try {
      const response = await axios.post(
        "https://trackapi.thailandpost.co.th/post/api/v1/track",
        {
          status: "all",
          language: "EN",
          barcode: [orderData.tracking_number],
        },
        {
          headers: {
            Authorization: `Token ${THAI_POST_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const items = response.data.response.items[orderData.tracking_number];
      if (items) {
        setTrackingData(items);
        setTrackingError("");
      } else {
        setTrackingError("No tracking data found for this tracking number.");
      }
    } catch (err) {
      console.error("Tracking API error:", err);
      setTrackingError("Failed to fetch tracking status. Please try again.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  // ---------- helper to choose product name/sku from item first ----------
  const getItemName = (item, product) =>
    item?.product_name || product?.name || `Product ID: ${item.product_id}`;

  const getItemSku = (item, product) => item?.sku || product?.sku || "";

  if (loading) {
    return (
      <div className="wd-form-order">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #32cd32",
                borderTop: "4px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="wd-form-order">
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
          <h6>Error Loading Order</h6>
          <p className="mb-0">{error || "Order not found"}</p>
          <button
            onClick={() => router.back()}
            className="btn btn-sm btn-outline-danger mt-3"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabNames = orderData.tracking_number
    ? [
        t("order.orderitems"),
        t("order.orderhistory"),
        t("order.packagetracking"),
        t("order.paymentdetails"),
        t("order.orderinfo"),
      ]
    : [
        t("order.orderitems"),
        t("order.orderhistory"),
        t("order.ordersummary"),
        t("order.paymentdetails"),
        t("order.orderinfo"),
      ];

      return (
        <div className="wd-form-order">
          {/* ✅ ส่วนหัว + grid summary แยกออกไปแล้ว */}
          <OrderHeaderAndSummary
            t={t}
            orderData={orderData}
            router={router}
            formatDate={format}
            formatCurrency={formatCurrency}
            getStatusColor={getStatusColor}
            getOrderType={getOrderType}
            getPaymentMethod={getPaymentMethod}
            formatPaymentDetails={formatPaymentDetails}
          />
    
          {/* ✅ ส่วน Tabs */}
          <div className="widget-tabs style-has-border widget-order-tab">
            <ul className="widget-menu-tab">
              {tabNames.map((tabName, index) => (
                <li
                  key={index}
                  className={`item-title ${activeTab === index ? "active" : ""}`}
                  onClick={() => handleTabClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="inner">{tabName}</span>
                </li>
              ))}
            </ul>
    
            <div className="widget-content-tab">
              {/* TAB 0: Order Items */}
              <div
                className={`widget-content-inner ${
                  activeTab === 0 ? "active" : ""
                }`}
                style={{ display: activeTab === 0 ? "block" : "none" }}
              >
                <OrderItemsTab
                  t={t}
                  currentLang={currentLang}
                  itemsLoading={itemsLoading}
                  productsLoading={productsLoading}
                  itemsError={itemsError}
                  productsError={productsError}
                  orderItems={filteredOrderItems}
                  productDetails={productDetails}
                  formatCurrency={formatCurrency}
                />
              </div>
    
              {/* TAB 1: Order History */}
              <div
                className={`widget-content-inner ${
                  activeTab === 1 ? "active" : ""
                }`}
                style={{ display: activeTab === 1 ? "block" : "none" }}
              >
                <OrderHistoryTab
                  t={t}
                  orderData={orderData}
                  formatDate={format}
                />
              </div>
    
              {/* TAB 2: Package Tracking (เฉพาะตอนมี tracking_number) */}
              {orderData.tracking_number && (
                <div
                  className={`widget-content-inner ${
                    activeTab === 2 ? "active" : ""
                  }`}
                  style={{ display: activeTab === 2 ? "block" : "none" }}
                >
                  <PackageTrackingTab
                    t={t}
                    orderData={orderData}
                    trackingData={trackingData}
                    trackingLoading={trackingLoading}
                    trackingError={trackingError}
                    formatDate={formatDate}
                    refreshTracking={refreshTracking}
                  />
                </div>
              )}
    
              {/* TAB 3 หรือ 2: Order Summary (ยอดเงิน) */}
              <div
                className={`widget-content-inner ${
                  activeTab === (orderData.tracking_number ? 3 : 2)
                    ? "active"
                    : ""
                }`}
                style={{
                  display:
                    activeTab === (orderData.tracking_number ? 3 : 2)
                      ? "block"
                      : "none",
                }}
              >
                <OrderSummaryTab
                  t={t}
                  orderData={orderData}
                  formatCurrency={formatCurrency}
                />
              </div>
    
              {/* TAB 4 หรือ 3: Payment Details */}
              <div
                className={`widget-content-inner ${
                  activeTab === (orderData.tracking_number ? 4 : 3)
                    ? "active"
                    : ""
                }`}
                style={{
                  display:
                    activeTab === (orderData.tracking_number ? 4 : 3)
                      ? "block"
                      : "none",
                }}
              >
                <PaymentDetailsTab
                  t={t}
                  orderData={orderData}
                  formatCurrency={formatCurrency}
                  getPaymentMethod={getPaymentMethod}
                />
              </div>
    
              {/* TAB 5 หรือ 4: Order Info / Thank you */}
              <div
                className={`widget-content-inner ${
                  activeTab === (orderData.tracking_number ? 5 : 4)
                    ? "active"
                    : ""
                }`}
                style={{
                  display:
                    activeTab === (orderData.tracking_number ? 5 : 4)
                      ? "block"
                      : "none",
                }}
              >
                <OrderInfoTab
                  t={t}
                  orderData={orderData}
                  formatDate={format}
                  formatCurrency={formatCurrency}
                  getPaymentMethod={getPaymentMethod}
                  getOrderType={getOrderType}
                  formatPaymentDetails={formatPaymentDetails}
                />
              </div>
            </div>
          </div>
        <style jsx global>{orderDetailsStyles}</style>
    </div>
  );
}

// Loading fallback component
function OrderDetailsLoading() {
  const { t } = useTranslation();
  return (
    <div className="wd-form-order">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #32cd32",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p>{t("order.Loading order details...")}</p>
        </div>
      </div>
      <style jsx global>{orderDetailsStyles}</style>
    </div>
  );
}

// Main component with Suspense wrapper
export default function OrderDetails() {
  return (
    <Suspense fallback={<OrderDetailsLoading />}>
      <OrderDetailsContent />
    </Suspense>
  );
}
