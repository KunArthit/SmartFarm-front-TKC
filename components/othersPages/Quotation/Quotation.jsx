"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../../../public/images/logo/FarmSuk-TM.png";

export default function Quotation() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");
  const [hasPrinted, setHasPrinted] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null); // จาก /order/:id


  const searchParams = useSearchParams();
  const quotationNo = searchParams.get("quotation_no");
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
          setLogoBase64(String(reader.result || ""));
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
  }, []);

  const autoLoad = async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) {
        router.push("/login");
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
  
      // ดึงสอง API พร้อมกัน
      const [resQuotation, resOrderInfo] = await Promise.all([
        fetch(`${API_BASE_URL}/quotation/order/${id}`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_BASE_URL}/order/${id}`, {
          method: "GET",
          headers,
        }),
      ]);
  
      const quotationData = await resQuotation.json();
      const orderInfoData = await resOrderInfo.json();
  
      setOrder(quotationData);
      setOrderInfo(orderInfoData);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };
  

  const getExpireDate = () => {
    if (!order || !order.created_at) return "-";
    try {
      const base = new Date(order.created_at);
      const days = Number(order.valid_days || 7);
      base.setDate(base.getDate() + days);
      return formatDateTimeToThai(base.toISOString());
    } catch {
      return "-";
    }
  };

  // helper คำนวณราคารวมก่อนภาษี (หลังหักส่วนลดในแต่ละบรรทัด)
  const getSubTotal = () => {
    if (!order || !order.items) return 0;
    return order.items.reduce((sum, item) => {
      const qty = Number(item.quantity || 0);
      const price = Number(item.unit_price || 0);
      const discount = Number(item.discount || 0); // ถ้าไม่มีให้เป็น 0
      return sum + qty * price - discount;
    }, 0);
  };

  const subTotal = getSubTotal();
  const taxAmount = Number((order && order.tax_amount) || 0);
  const grandTotal = Number((order && order.total_amount) || 0);

  // พิมพ์แบบเปิดหน้าต่างใหม่
  const handlePrintNewWindow = () => {
    const contentElement = document.getElementById("quotation-content");
    if (!contentElement) return;

    const printContent = contentElement.innerHTML;
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      console.error("Unable to open print window (popup blocked by browser)");
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation ${
            order && order.quotation_no ? order.quotation_no : quotationNo || ""
          }</title>
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

            /* เลียนแบบ layout แบบโปรซอฟต์ */
            #quotation-content {
              border: 1px solid #0f4ab8;
              padding: 12px 16px;
            }

            .logo {
              max-height: 70px !important;
              height: 70px !important;
              width: auto !important;
              object-fit: contain;
              display: block;
            }

            /* utility ที่เราใช้ใน content (จำลองจาก tailwind) */
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .justify-between { justify-content: space-between; }
            .items-start { align-items: flex-start; }
            .items-center { align-items: center; }
            .gap-4 { gap: 1rem; }
            .gap-3 { gap: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-1 { margin-bottom: 0.25rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .ml-auto { margin-left: auto; }
            .w-full { width: 100%; }
            .w-48 { width: 12rem; }
            .w-64 { width: 16rem; } 
            .nowrap { white-space: nowrap; }
            .text-xs { font-size: 11px; }
            .text-sm { font-size: 12px; }
            .text-base { font-size: 13px; }
            .text-lg { font-size: 16px; }
            .leading-snug { line-height: 1.35; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .text-right { text-align: right !important; }
            .text-center { text-align: center !important; }
            .border { border: 1px solid #0f4ab8; }
            .border-blue-700 { border-color: #0f4ab8; }
            .border-b { border-bottom: 1px solid #0f4ab8; }
            .rounded-md { border-radius: 4px; }
            .box-quotation { background-color: #fff; }
            .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .bg-gray-50 { background-color: #f9fafb; }

            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

            .flex-1 { flex: 1; }
            .flex-\\[1\\.5\\] { flex: 1.5; }

            .quotation-table { 
              width: 100%; 
              border-collapse: collapse;
              margin-top: 16px;
            }
            .quotation-table th, 
            .quotation-table td { 
              border: 1px solid #0f4ab8; 
              padding: 6px 8px; 
              text-align: left; 
              vertical-align: top;
              font-size: 12px;
            }
            .quotation-table th { 
              background-color: #f3f4ff !important; 
              font-weight: bold;
              text-align: center;
            }

            .label-cell {
              flex: 0 0 30px;             
              border-right: 1px solid #0f4ab8;
            }

            .value-cell {
              flex: 1;                    
            }

            .header-box {
              border: 1px solid #0f4ab8;
              padding: 8px 10px;
              font-size: 12px;
              min-height: 80px;
            }

            .summary-table {
              width: 45%;
              margin-left: auto;
              border-collapse: collapse;
              font-size: 12px;
            }
            .summary-table td {
              border: 1px solid #0f4ab8;
              padding: 4px 6px;
            }

            .signature-grid {
              width: 100%;
              margin-top: 24px;
              border-collapse: collapse;
              font-size: 11px;
            }
            .signature-grid td {
              border: 1px solid #0f4ab8;
              padding: 12px 8px 6px 8px;
              text-align: center;
              height: 100px;
            }

            /* หมายเหตุสไตล์เหมือนรูป */
            .remark-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              margin-top: 12px;
            }
            .remark-table td {
              border: 1px solid #0f4ab8;
              padding: 4px 6px;
              height: 70px;
              vertical-align: top;
            }
            .remark-label {
              width: 90px;
              font-weight: 600;
            }

            .small-text { font-size: 11px; }

            @media print {
              body { 
                margin: 0; 
                padding: 15px;
                font-size: 11px;
              }
              .logo {
                max-height: 50px !important;
                height: 50px !important;
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

      logoElements.forEach(function (logoElement) {
        if (logoBase64) {
          logoElement.src = logoBase64;
        } else {
          logoElement.src =
            window.location.origin + "/images/logo/FarmSuk-TM.png";
        }

        logoElement.onerror = function () {
          this.style.display = "none";
        };
      });

      setTimeout(function () {
        printWindow.print();
        setTimeout(function () {
          printWindow.close();
        }, 800);
      }, 800);
    };
  };

  // auto ปริ้นครั้งแรก
  useEffect(() => {
    if (!loading && order && logoBase64 && !hasPrinted) {
      handlePrintNewWindow();
      setHasPrinted(true);
    }
  }, [loading, order, logoBase64, hasPrinted]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div>{t("quotation.loading...")}</div>
        </div>
      ) : (
        <div className="wrapper-quotation">
          <section className="quotation-section">
            <div className="cus-container2 px-4 sm:px-6 lg:px-8">
              {/* ปุ่มสั่งพิมพ์ซ้ำ */}
              <div className="top mb-4 no-print">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handlePrintNewWindow}
                    className="tf-btn btn-fill animate-hover-btn text-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    disabled={!logoBase64 || !order}
                  >
                    {t("quotation.PrintQuotation")}{" "}
                    {(!logoBase64 || !order) && "(Loading...)"}
                  </button>
                </div>
              </div>

              {/* เนื้อหาใบเสนอราคา */}
              <div
                id="quotation-content"
                className="box-quotation bg-white rounded-lg shadow-sm p-4 sm:p-6"
              >
                {/* แถบบนสุด: โลโก้ / ข้อมูลบริษัท / เลขที่ใบเสนอราคา / หน้า */}
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex items-start gap-3">
                    <Image
                      alt="logo"
                      src={Logo}
                      width={80}
                      height={80}
                      className="logo"
                    />
                    <div className="text-xs sm:text-sm leading-snug">
                      <div className="font-bold text-base">
                        บริษัท ทีเคซี เซอร์วิสเซส จำกัด
                      </div>
                      <div>
                        123 ถนนสุขุมวิท แขวงบางจาก เขตพระโขนง กรุงเทพฯ 10260
                      </div>
                      <div>
                        โทรศัพท์ 0-2401-8222 
                      </div>
                      <div>
                        เลขประจำตัวผู้เสียภาษี 0000000000000
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div>หน้า 1 / 1</div>
                    <div className="border border-blue-700 rounded-md text-xs sm:text-sm w-60 mt-2">
                      <div className="flex items-center border-b border-blue-700">
                        <div className="label-cell px-2 py-2 bg-gray-50 font-semibold">
                          เลขที่
                        </div>
                        <div className="value-cell px-3 py-2 text-right nowrap">
                          {order && order.quotation_no
                            ? order.quotation_no
                            : quotationNo}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="label-cell px-2 py-2 bg-gray-50 font-semibold">
                          วันที่
                        </div>
                        <div className="value-cell px-3 py-2 text-right nowrap">
                          {order && order.created_at
                            ? formatDateTimeToThai(order.created_at)
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ชื่อเอกสาร */}
                <div className="text-center mb-4">
                  <div className="text-lg sm:text-xl font-bold">
                    ใบเสนอราคา
                  </div>
                </div>

                {/* กล่องข้อมูลลูกค้า / เงื่อนไข / วันครบกำหนด */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs sm:text-sm">
                <div className="header-box border border-blue-700 rounded-md">
  <div className="mb-1">
    <span className="font-semibold">ชื่อผู้ติดต่อ:&nbsp;</span>
    <span>
      {/* ลองใช้จาก orderInfo.customer_name ก่อน ถ้าไม่มีค่อย fallback เป็น userData */}
      {orderInfo?.customer_name ||
        `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim() ||
        "-"}
    </span>
  </div>

  <div className="mb-1">
    <span className="font-semibold">ชื่อบริษัท:&nbsp;</span>
    <span>
      {orderInfo?.company_name ||          // จาก api/order
       order?.customer_company ||          // เผื่อ backend เดิมใช้ชื่อนี้
       userData?.company_name ||           // ถ้าเคยเก็บใน localStorage
       "-"}
    </span>
  </div>

  <div className="mb-1">
    <span className="font-semibold">โทร.:&nbsp;</span>
    <span>
      {orderInfo?.phone_number ||          // จาก api/order
       orderInfo?.phone ||                 // เผื่อใช้ชื่อ phone
       order?.customer_phone ||            // จาก quotation api ถ้ามี
       "-"}
    </span>
    <span>&nbsp;&nbsp;โทรสาร:&nbsp;</span>
    <span>{order?.customer_fax || "-"}</span>
  </div>

  <div>
    <span className="font-semibold">ที่อยู่:&nbsp;</span>
    <span>
      {order && order.address} {order && order.sub_district}{" "}
      {order && order.district} {order && order.province}{" "}
      {order && order.zipcode} {order && order.country}
    </span>
  </div>
</div>
                </div>

                {/* ตารางสินค้า (ไม่มีคอลัมน์หน่วยแล้ว) */}
                <table className="quotation-table w-full text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="text-center w-20">รหัสสินค้า</th>
                      <th className="text-center">รายการ</th>
                      <th className="text-center w-16">จำนวน</th>
                      <th className="text-center w-24">ราคาหน่วยละ</th>
                      <th className="text-center w-20">ส่วนลด</th>
                      <th className="text-center w-28">จำนวนเงิน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order &&
                      order.items &&
                      order.items.map((item, index) => {
                        const qty = Number(item.quantity || 0);
                        const price = Number(item.unit_price || 0);
                        const discount = Number(item.discount || 0);
                        const lineAmount = qty * price - discount;

                        return (
                          <tr key={index}>
                            <td className="text-center">
                              {item.code ||
                                item.sku ||
                                "IC-" + String(index + 1)}
                            </td>
                            <td>{item.description || item.name}</td>
                            <td className="text-center">
                              {qty.toLocaleString()}
                            </td>
                            <td className="text-right">
                              {price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="text-right">
                              {discount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="text-right">
                              {lineAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        );
                      })}

                    {/* เติมแถวว่างให้หน้าสวย */}
                    {Array.from({
                      length: Math.max(
                        0,
                        6 - ((order && order.items && order.items.length) || 0)
                      ),
                    }).map((_, idx) => (
                      <tr key={"empty-" + String(idx)}>
                        <td>&nbsp;</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* หมายเหตุ + สรุปราคา */}
                <div className="mt-4 flex flex-col gap-3">
                  {/* กล่องหมายเหตุสไตล์เหมือนภาพ */}
                  <table className="remark-table">
                    <tbody>
                      <tr>
                        <td className="remark-label">หมายเหตุ</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-center small-text mt-1">
                    ( ราคาเสนอข้างต้นยังไม่รวมค่าขนส่ง และมีอายุการเสนอราคา
                    ภายในระยะเวลาที่กำหนดข้างต้น )
                  </div>

                  {/* สรุปราคา */}
                  <div className="ml-auto w-full sm:w-1/2">
                    <table className="summary-table rounded-md">
                      <tbody>
                        <tr>
                          <td className="font-semibold">รวมเงิน</td>
                          <td className="text-right">
                            {subTotal.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold">ส่วนลดการค้า</td>
                          <td className="text-right">
                            {order && order.discount_amount
                              ? Number(order.discount_amount).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )
                              : "0.00"}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold">
                            เงินหลังหักส่วนลด
                          </td>
                          <td className="text-right">
                            {(
                              subTotal -
                              Number(
                                (order && order.discount_amount) || 0
                              )
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold">
                            ภาษีมูลค่าเพิ่ม 7%
                          </td>
                          <td className="text-right">
                            {taxAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold">
                            จำนวนเงินรวมทั้งสิ้น
                          </td>
                          <td className="text-right font-semibold">
                            {grandTotal.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ลายเซ็น 3 ช่อง */}
                <table className="signature-grid mt-6 small-text">
                  <tbody>
                    <tr>
                      <td>
                        ลงชื่อ ____________________________ ผู้อนุมัติสั่งซื้อ
                        <br />
                        วันที่ ______/______/________
                      </td>
                      <td>
                        ลงชื่อ ____________________________ ผู้เสนอราคา
                        <br />
                        วันที่ ______/______/________
                      </td>
                      <td>
                        ลงชื่อ ____________________________ ผู้จัดทำใบเสนอราคา
                        <br />
                        วันที่ ______/______/________
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* footer */}
              <div className="footer p-4 border-t bg-gray-50 mt-4 text-center text-xs text-gray-600">
                www.tkc-services.com &nbsp; | &nbsp; (+66) 0-2401-8222
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function formatDateTimeToThai(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear() + 543; // พ.ศ.
  return `${day}/${month}/${year}`;
}
