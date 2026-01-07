"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../../../public/images/logo/FarmSuk-TM.png";

export default function InvoicePage() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);       // ข้อมูลจาก /invoices/order/:id
  const [orderInfo, setOrderInfo] = useState(null); // ข้อมูลจาก /order/:id (มี payment_method)
  const [logoBase64, setLogoBase64] = useState("");

  const searchParams = useSearchParams();
  const invoiceNo = searchParams.get("invoice");
  const id = searchParams.get("id");

  const userData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user_data") || "null")
      : null;

  const { t } = useTranslation();
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // แปลง logo เป็น base64 เพื่อใช้ในการพิมพ์
  useEffect(() => {
    const convertLogoToBase64 = async () => {
      try {
        const response = await fetch("/images/logo/FarmSuk-TM.png");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error converting logo to base64:", error);
      }
    };

    convertLogoToBase64();
  }, []);

  useEffect(() => {
    autoLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoLoad = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // 1) ดึงข้อมูล invoice
      const resInvoice = await fetch(`${API_BASE_URL}/invoices/order/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const invoiceData = await resInvoice.json();
      console.log("Invoice order:", invoiceData);
      setOrder(invoiceData);

      // 2) ดึงข้อมูล order (core) ที่มี payment_method
      const resOrder = await fetch(`${API_BASE_URL}/order/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (resOrder.ok) {
        const orderData = await resOrder.json();
        console.log("Core order:", orderData);
        setOrderInfo(orderData);
      } else {
        console.warn("Failed to load /order data", resOrder.status);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // Print แบบใช้ DOM เดิม
  const handlePrintInvoice = () => {
    const printContent = document.getElementById("invoice-content");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Print เปิด window ใหม่
  const handlePrintNewWindow = () => {
    const printContent = document.getElementById("invoice-content").innerHTML;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${order?.invoice_no || ""}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              margin: 0.5in;
              size: A4;
            }

            body { 
              font-family: 'Sarabun', 'Tahoma', Arial, sans-serif; 
              margin: 0;
              padding: 20px;
              color: #000;
              background: #fff;
              line-height: 1.4;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .logo {
              max-height: 80px !important;
              height: 80px !important;
              width: auto !important;
              object-fit: contain;
              display: block;
            }

            .invoice-table { 
              width: 100%; 
              border-collapse: collapse;
              margin-top: 16px;
            }
            .invoice-table th, 
            .invoice-table td { 
              border: 1px solid #ddd; 
              padding: 6px 8px; 
              text-align: left; 
              vertical-align: top;
              font-size: 12px;
            }
            .invoice-table th { 
              background-color: #f5f5f5 !important; 
              font-weight: bold;
              color: #333 !important;
            }

            .summary-table {
              width: 260px;
              border-collapse: collapse;
              font-size: 12px;
            }
            .summary-table td {
              border: 1px solid #ddd;
              padding: 4px 8px;
            }

            .payment-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin-top: 8px;
            }
            .payment-table th,
            .payment-table td {
              border: 1px solid #ddd;
              padding: 4px 6px;
              vertical-align: top;
            }
            .payment-table th {
              background-color: #f5f5f5;
            }

            .text-right { text-align: right !important; }
            .text-center { text-align: center !important; }
            .text-left { text-align: left !important; }
            .font-bold { font-weight: bold !important; }
            .font-semibold { font-weight: 600 !important; }
            .bg-gray-50 { background-color: #f9f9f9 !important; }

            .wrap-top {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 16px;
              gap: 12px;
            }

            .info-box-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 16px;
            }
            .info-box-table td {
              border: 1px solid #ddd;
              padding: 8px 10px;
              font-size: 12px;
              vertical-align: top;
            }

            .footer {
              border-top: 1px solid #e5e7eb;
              background-color: #f9f9f9 !important;
              padding: 10px 16px;
              font-size: 11px;
            }

            .signature-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 12px;
              margin-top: 24px;
            }
            .signature-box {
              border: 1px solid #ddd;
              padding: 10px;
              min-height: 110px;
              font-size: 11px;
            }

            .checkbox-box {
              display: inline-block;
              width: 10px;
              height: 10px;
              border: 1px solid #000;
              margin-right: 4px;
            }

            @media print {
              body { 
                margin: 0; 
                padding: 15px;
                font-size: 12px;
              }
              .no-print { 
                display: none !important; 
              }
              .logo {
                max-height: 40px !important;
                height: 40px !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = function () {
      const logoElements = printWindow.document.querySelectorAll(".logo");
      logoElements.forEach((logoElement) => {
        if (logoBase64) {
          logoElement.src = logoBase64;
        } else {
          logoElement.src = `${window.location.origin}/images/logo/FarmSuk-TM.png`;
        }

        logoElement.onerror = function () {
          console.warn("Logo failed to load, hiding element");
          // @ts-ignore
          this.style.display = "none";
        };
      });

      setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 800);
      }, 600);
    };
  };

  // ====== คำนวณยอดจาก invoice ======
  const items = order?.items || [];
  const subTotal = items.reduce((sum, item) => {
    const price = Number(item.unit_price || 0);
    const qty = Number(item.quantity || 0);
    return sum + price * qty;
  }, 0);

  const vatAmount = Number(order?.tax_amount || 0);
  const totalAmount = Number(order?.total_amount || 0);
  const preVatAmount = totalAmount - vatAmount > 0 ? totalAmount - vatAmount : 0;
  const discountRaw = subTotal - preVatAmount;
  const discountAmount = discountRaw > 0 ? discountRaw : 0;

  const address = [
    order?.address,
    order?.sub_district,
    order?.district,
    order?.province,
    order?.zipcode,
    order?.country,
  ]
    .filter(Boolean)
    .join(" ");

  // ====== ข้อมูลการชำระเงินจริง ======
  const paymentInfo = getInvoicePaymentInfo(order);

  // ใช้ payment_method จาก /order เป็นหลัก
  const methodFromOrderApi =
    orderInfo?.payment_method || orderInfo?.paymentMethod || "";

  // ถ้า /order ไม่มี method ค่อย fallback ไปใช้จาก invoice / paymentInfo
  const effectiveMethod = methodFromOrderApi || paymentInfo.method || "";
  const paymentMethodLabel = getPaymentMethodLabel(effectiveMethod, t);
  const methodKey = effectiveMethod.toString().toLowerCase().trim();

  const isBankTransfer = methodKey === "bank_transfer";
  const isCard = methodKey === "credit_card";
  const isQR = methodKey === "qr_code" || methodKey === "promptpay";

  const netAmount =
    Number(paymentInfo.amountPaid || totalAmount) -
    Number(paymentInfo.withholdingAmount || 0);

  const activeRow = isBankTransfer ? "bank" : isCard ? "card" : isQR ? "qr" : "bank";
  const showRowAmounts = (row) => row === activeRow;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>{t("invoice.loading...")}</div>
      </div>
    );
  }

  return (
    <div className="wrapper-invoice">
      <section className="invoice-section">
        <div className="cus-container2 px-4 sm:px-6 lg:px-8">
          {/* ปุ่ม print */}
          <div className="top mb-4 no-print">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePrintNewWindow}
                className="tf-btn btn-fill animate-hover-btn text-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                disabled={!logoBase64}
              >
                {t("invoice.Print invoice")} {!logoBase64 && "(Loading...)"}
              </button>
            </div>
          </div>

          {/* เนื้อหา invoice */}
          <div
            id="invoice-content"
            className="box-invoice bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6"
          >
            {/* Header บนสุด */}
            <div className="wrap-top">
              <div style={{ display: "flex", gap: 12 }}>
                <div>
                  <Link href="/">
                    <Image
                      alt="Logo"
                      src={Logo}
                      className="logo"
                      width={120}
                      height={50}
                    />
                  </Link>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    TKC SERVICES CO., LTD.
                  </div>
                  <div>บริษัท ทีเคซี เซอร์วิสเซส จำกัด</div>
                  <div>123 ถนนสุขุมวิท แขวงบางจาก เขตพระโขนง กรุงเทพฯ 10260</div>
                  <div>โทรศัพท์ 0-2401-8222</div>
                  <div>เลขประจำตัวผู้เสียภาษี 0-0000-00000-00-0</div>
                </div>
              </div>

              <div style={{ textAlign: "right", fontSize: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  ใบเสร็จรับเงิน/ใบกำกับภาษี
                </div>
                <div>Receipt / Tax Invoice</div>
                <div style={{ marginTop: 12, fontSize: 12 }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>เลขที่</span>{" "}
                    {order?.invoice_no || "-"}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>Invoice No.</span>{" "}
                    {invoiceNo || "-"}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>วันที่</span>{" "}
                    {order?.created_at
                      ? formatDateTimeToThai(order.created_at)
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* กล่องข้อมูลลูกค้า + เลขที่เอกสาร */}
            <table className="info-box-table">
              <tbody>
                <tr>
                  {/* ลูกค้า */}
                  <td style={{ width: "60%" }}>
                    <div style={{ fontSize: 12 }}>
                      <div style={{ fontWeight: 600 }}>ลูกค้า / Customer</div>
                      <div style={{ marginTop: 4 }}>
                        {userData
                          ? `${userData.first_name || ""} ${
                              userData.last_name || ""
                            }`
                          : order?.customer_name ||
                            orderInfo?.customer_name ||
                            "-"}
                      </div>

                      <div style={{ fontWeight: 600, marginTop: 8 }}>
                        ที่อยู่ / Address
                      </div>
                      <div style={{ marginTop: 2, whiteSpace: "pre-wrap" }}>
                        {address || "-"}
                      </div>

                      <div style={{ fontWeight: 600, marginTop: 8 }}>
                        เลขประจำตัวผู้เสียภาษี / Tax ID
                      </div>
                      <div style={{ marginTop: 2 }}>
                        {userData?.tax_id || order?.tax_id || orderInfo?.tax_id || "-"}
                      </div>
                    </div>
                  </td>

                  {/* ข้อมูลใบกำกับ */}
                  <td style={{ width: "40%" }}>
                    <div style={{ fontSize: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Tax Invoice No.</span>
                        <span>{order?.invoice_no || "-"}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>
                          Ref. Invoice No.
                        </span>
                        <span>{invoiceNo || "-"}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Date</span>
                        <span>
                          {order?.created_at
                            ? formatDateTimeToThai(order.created_at)
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ตารางสินค้า */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>
                    รหัส <br />
                    ID No.
                  </th>
                  <th>
                    คำอธิบาย <br />
                    Description
                  </th>
                  <th style={{ width: 80 }} className="text-center">
                    จำนวน <br />
                    Quantity
                  </th>
                  <th style={{ width: 80 }} className="text-center">
                    หน่วย <br />
                    Unit
                  </th>
                  <th style={{ width: 120 }} className="text-right">
                    มูลค่าก่อนภาษี <br />
                    Pre-Tax Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      {t("invoice.No item")}
                    </td>
                  </tr>
                )}

                {items.map((item, index) => {
                  const lineAmount =
                    Number(item.unit_price || 0) *
                    Number(item.quantity || 0);
                  return (
                    <tr key={index}>
                      <td className="text-center">
                        {item.sku ||
                          item.code ||
                          String(index + 1).padStart(4, "0")}
                      </td>
                      <td>{item.description || item.name}</td>
                      <td className="text-center">
                        {Number(item.quantity || 0)}
                      </td>
                      <td className="text-center">{item.unit || "ชิ้น"}</td>
                      <td className="text-right">{formatMoney(lineAmount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* สรุปยอด */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <table className="summary-table">
                <tbody>
                  <tr>
                    <td>รวมเป็นเงิน / Sub Total</td>
                    <td className="text-right">{formatMoney(subTotal)}</td>
                  </tr>
                  <tr>
                    <td>ส่วนลด / Discount</td>
                    <td className="text-right">
                      {formatMoney(discountAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td>รวมเงินก่อนภาษี / Pre-VAT Amount</td>
                    <td className="text-right">
                      {formatMoney(preVatAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td>ภาษีมูลค่าเพิ่ม / VAT 7%</td>
                    <td className="text-right">{formatMoney(vatAmount)}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">
                      จำนวนเงินรวมทั้งสิ้น (บาท) / Grand Total
                    </td>
                    <td className="text-right font-bold">
                      {formatMoney(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ช่องทางการชำระเงิน จาก payment_method ของ /order */}
            <div
              style={{
                border: "1px solid #ddd",
                marginTop: 20,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  padding: "6px 8px",
                  borderBottom: "1px solid #ddd",
                  fontWeight: 600,
                }}
              >
                ช่องทางการชำระเงิน / Payment
              </div>
              <table className="payment-table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>การชำระเงิน / Payment</th>
                    <th style={{ width: "18%" }}>ธนาคาร / Bank</th>
                    <th style={{ width: "26%" }}>
                      เลขที่บัญชี/เลขที่บัตร / Account No./Card No.
                    </th>
                    <th style={{ width: "12%" }}>หัก ณ ที่จ่าย / Withholding</th>
                    <th style={{ width: "12%" }}>
                      วันที่ชำระเงิน / Payment Date
                    </th>
                    <th style={{ width: "12%" }}>จำนวนเงิน / Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* แถว 1: โอนเงินธนาคาร */}
                  <tr>
                    <td>
                      <span
                        className="checkbox-box"
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          border: "1px solid #000",
                          marginRight: 4,
                          textAlign: "center",
                          fontSize: 9,
                          lineHeight: "10px",
                        }}
                      >
                        {isBankTransfer ? "✓" : ""}
                      </span>
                      โอนเงิน / Money Transfer
                    </td>
                    <td>
                      {showRowAmounts("bank")
                        ? paymentInfo.bankName || "-"
                        : "-"}
                    </td>
                    <td>
                      {showRowAmounts("bank")
                        ? paymentInfo.accountNo || "-"
                        : "-"}
                    </td>
                    <td className="text-right">
                      {showRowAmounts("bank")
                        ? formatMoney(paymentInfo.withholdingAmount || 0)
                        : "-"}
                    </td>
                    <td className="text-center">
                      {showRowAmounts("bank") && paymentInfo.paymentDate
                        ? formatDateTimeToThai(paymentInfo.paymentDate)
                        : "-"}
                    </td>
                    <td className="text-right">
                      {showRowAmounts("bank")
                        ? formatMoney(netAmount >= 0 ? netAmount : 0)
                        : "-"}
                    </td>
                  </tr>

                  {/* แถว 2: 2C2P – บัตรเครดิต/เดบิต */}
                  <tr>
                    <td>
                      <span
                        className="checkbox-box"
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          border: "1px solid #000",
                          marginRight: 4,
                          textAlign: "center",
                          fontSize: 9,
                          lineHeight: "10px",
                        }}
                      >
                        {isCard ? "✓" : ""}
                      </span>
                      2C2P - บัตรเครดิต/เดบิต / Credit/Debit
                    </td>
                    <td>
                      {showRowAmounts("card")
                        ? paymentInfo.bankName || paymentMethodLabel || "-"
                        : "-"}
                    </td>
                    <td>
                      {showRowAmounts("card")
                        ? paymentInfo.accountNo || "-"
                        : "-"}
                    </td>
                    <td className="text-right">
                      {showRowAmounts("card")
                        ? formatMoney(paymentInfo.withholdingAmount || 0)
                        : "-"}
                    </td>
                    <td className="text-center">
                      {showRowAmounts("card") && paymentInfo.paymentDate
                        ? formatDateTimeToThai(paymentInfo.paymentDate)
                        : "-"}
                    </td>
                    <td className="text-right">
                      {showRowAmounts("card")
                        ? formatMoney(netAmount >= 0 ? netAmount : 0)
                        : "-"}
                    </td>
                  </tr>

                  {/* แถว 3: 2C2P – PromptPay / QR Code */}
                  <tr>
                    <td>
                      <span
                        className="checkbox-box"
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          border: "1px solid #000",
                          marginRight: 4,
                          textAlign: "center",
                          fontSize: 9,
                          lineHeight: "10px",
                        }}
                      >
                        {isQR ? "✓" : ""}
                      </span>
                      2C2P - PromptPay / QR Code
                    </td>
                    <td>
                      {showRowAmounts("qr")
                        ? paymentInfo.bankName || paymentMethodLabel || "-"
                        : "-"}
                    </td>
                    <td>
                      {showRowAmounts("qr")
                        ? paymentInfo.accountNo || "-"
                        : "-"}
                    </td>
                    <td className="text-right">
                      {showRowAmounts("qr")
                        ? formatMoney(paymentInfo.withholdingAmount || 0)
                        : "-"}
                    </td>
                    <td className="text-center">
                      {showRowAmounts("qr") && paymentInfo.paymentDate
                        ? formatDateTimeToThai(paymentInfo.paymentDate)
                        : "-"}
                    </td>
                    <td className="text-right">
                      {showRowAmounts("qr")
                        ? formatMoney(netAmount >= 0 ? netAmount : 0)
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ลายเซ็น */}
            <div className="signature-grid">
              <div className="signature-box">
                <div className="text-center font-semibold">
                  ผู้จัดทำ/ผู้รับผิดชอบรายการแทน
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    margin: "22px 30px 4px",
                  }}
                />
                <div className="text-center">
                  (......................................................)
                </div>
                <div className="text-center" style={{ marginTop: 6 }}>
                  วันที่ ....../....../.............
                </div>
              </div>
              <div className="signature-box">
                <div className="text-center font-semibold">ผู้รับเงิน</div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    margin: "22px 30px 4px",
                  }}
                />
                <div className="text-center">
                  (......................................................)
                </div>
                <div className="text-center" style={{ marginTop: 6 }}>
                  วันที่ ....../....../.............
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="footer" style={{ marginTop: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 24,
                }}
              >
                <span>www.tkc-services.com</span>
                <span>(+66) 0-2401-8222</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== helper =====

function formatMoney(amount) {
  return Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateTimeToThai(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("th-TH", options);
}

function getPaymentMethodLabel(method, t) {
  if (!method) return "-";
  const key = method.toLowerCase();

  const paymentMethods = {
    "2c2p": t ? t("order.2c2p") : "2C2P",
    qr_code: t ? t("order.promtpay") : "QR Code",
    promptpay: t ? t("order.promtpay") : "PromptPay",
    bank_transfer: t ? t("order.banktransfer") : "Bank Transfer",
    credit_card: t ? t("order.craditcard") : "Credit Card",
  };

  return paymentMethods[key] || method;
}

// ใช้ข้อมูลจาก invoice เป็นหลักสำหรับยอด/วัน/ธนาคาร
function getInvoicePaymentInfo(order) {
  if (!order) {
    return {
      method: "",
      bankName: "",
      accountNo: "",
      withholdingAmount: 0,
      amountPaid: 0,
      paymentDate: "",
    };
  }

  const method = order.payment_method || order.paymentMethod || "";

  const paymentDate =
    order.paid_at ||
    order.payment_date ||
    order.updated_at ||
    order.created_at;

  const amountPaid =
    order.paid_amount ??
    order.total_amount ??
    0;

  const withholdingAmount = Number(order.withholding_amount || 0);

  const bankName = order.bank_name || order.bank || "";
  const accountNo =
    order.bank_account_no ||
    order.account_no ||
    "";

  return {
    method,
    bankName,
    accountNo,
    withholdingAmount,
    amountPaid,
    paymentDate,
  };
}
