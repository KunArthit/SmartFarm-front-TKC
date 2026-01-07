import React from "react";
import { format } from "date-fns";

export default function OrderHistoryTab({ t, orderData, formatDate }) {
  if (!orderData) return null;

  const getOrderHistory = () => {
    const currentStatus = orderData.order_status;

    // จุดเริ่มต้น: Order Placed (มีเสมอทุกสถานะ)
    const history = [
      {
        title: t("detail.OrderPlaced"),
        date: formatDate(new Date(orderData.created_at), 'dd-MM-yyyy : HH:mm:ss'),
        status: "completed", // ขั้นตอนนี้ถือว่าสำเร็จแล้ว (สีเขียว)
        details: `${t("detail.Order")} #${orderData.order_id} ${t(
          "detail.wassuccessfullyplaced"
        )}`,
      },
    ];

    // --- กรณี Pending (รอชำระเงิน) ---
    // แสดงสถานะล่าสุดว่าเป็น "รอชำระเงิน" และเป็นสีเหลือง (warning)
    if (currentStatus === "pending") {
      history.push({
        title: t("detail.PaymentPending") || "Awaiting Payment",
        date: formatDate(new Date(orderData.updated_at), 'dd-MM-yyyy : HH:mm:ss'),
        status: "pending", // สีเหลือง
        details:
          t("detail.PleaseMakePayment") || "Please complete your payment.",
      });
      return history.reverse();
    }

    // --- กรณี Cancelled (ยกเลิก) ---
    // จาก JSON ตัวอย่างจะเข้าเงื่อนไขนี้
    if (currentStatus === "cancelled") {
      history.push({
        title: t("detail.OrderCancelled") || "Order Cancelled",
        date: formatDate(new Date(orderData.updated_at), 'dd-MM-yyyy : HH:mm:ss'),
        status: "cancelled", // สีแดง
        details:
          t("detail.OrderWasCancelled") || "Your order has been cancelled.",
      });
      return history.reverse();
    }

    // --- กรณี Paid และ Completed (Flow ปกติ) ---

    // ถ้าสถานะเป็น paid หรือ completed แสดงว่าผ่านการจ่ายเงินมาแล้ว
    if (["paid", "completed"].includes(currentStatus)) {
      history.push({
        title: t("detail.PaymentSuccess") || "Payment Successful",
        date: formatDate(new Date(orderData.updated_at), 'dd-MM-yyyy : HH:mm:ss'),
        status: "completed",
        details:
          t("detail.PaymentReceived") ||
          "Payment has been received successfully.",
      });
    }

    // ถ้าสถานะเป็น completed แสดงว่าจบงานส่งของเรียบร้อย
    if (currentStatus === "completed") {
      history.push({
        title: t("detail.OrderCompleted"),
        date: formatDate(new Date(orderData.updated_at), 'dd-MM-yyyy : HH:mm:ss'),
        status: "completed",
        details: t("detail.OrderFinished"),
      });
    }

    return history.reverse();
  };

  // Helper: เลือกสี Badge ตามสถานะ
  const getBadgeClass = (status) => {
    if (status === "completed") return "success"; // สีเขียว
    if (status === "cancelled") return "danger"; // สีแดง
    if (status === "pending") return "warning"; // สีเหลือง/ส้ม
    return "primary"; // สี Default
  };

  return (
    <div className="widget-timeline">
      <ul className="timeline">
        {getOrderHistory().map((historyItem, index) => (
          <li key={index}>
            <div
              className={`timeline-badge ${getBadgeClass(historyItem.status)}`}
            />
            <div className="timeline-box">
              <div className="timeline-panel">
                <div className="text-2 fw-6">{historyItem.title}</div>
                {/* <span>{formatDate(new Date(historyItem.date), 'dd-MM-yyyy : HH:mm:ss')}</span> */}
                <span>{historyItem.date}</span>
              </div>
              <p>{historyItem.details}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
