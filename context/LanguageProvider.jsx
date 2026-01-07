// contexts/LanguageContext.jsx

"use client";
import React, { createContext, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
// ขั้นต้อนการทำส่วนนี้

// 1. สร้าง "Context" หรือ "กระดานข่าว" ที่ว่างเปล่าขึ้นมาก่อน
const LanguageContext = createContext(null);

// 2. สร้าง "Provider" หรือ "ผู้ดูแลกระดานข่าว"
export function LanguageProvider({ children }) {
  // ดึง i18n มาใช้เพื่อจัดการภาษาของ UI ที่เป็นข้อความ fix ไว้
  const { i18n } = useTranslation();

  // สร้าง state เพื่อเก็บรหัสภาษาปัจจุบัน ('th', 'en', etc.)
  // โดยให้ค่าเริ่มต้นตรงกับภาษาของ i18next
  const [currentLanguageId, setCurrentLanguageId] = useState(
    i18n.language || "th"
  );

  // สร้างฟังก์ชันสำหรับเปลี่ยนภาษา
  const changeLanguage = (langId) => {
    i18n.changeLanguage(langId); // สั่งให้ i18next เปลี่ยนภาษา (สำหรับ UI)
    setCurrentLanguageId(langId); // อัปเดต state ของเรา (สำหรับ Content)
  };

  // เตรียม "ข้อมูล" ที่จะแปะบนกระดานข่าวให้คนอื่นมาใช้
  const value = { currentLanguageId, changeLanguage };

  // 3. นำข้อมูลไปแปะบนกระดานข่าว และส่งต่อให้ children
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// 4. สร้าง "ทางลัด" (Custom Hook) เพื่อให้เรียกใช้ง่ายขึ้น
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
