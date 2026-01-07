"use client";
import { products1 } from "@/data/products";
import { sortingOptions } from "@/data/shop";
import React, { useEffect, useState } from "react";

export default function Sorting({
  products = products1,
  setFinalSorted,
  currentLanguageId = "en", // เพิ่ม prop สำหรับภาษา
}) {
  const [selectedOptions, setSelectedOptions] = useState(sortingOptions[0]);

  // ข้อความแปลภาษา
  const translations = {
    th: {
      default: "ค่าเริ่มต้น",
      alphabetAZ: "เรียงตามตัวอักษร ก-ฮ",
      alphabetZA: "เรียงตามตัวอักษร ฮ-ก",
      priceLowHigh: "ราคา ต่ำไปสูง",
      priceHighLow: "ราคา สูงไปต่ำ",
    },
    en: {
      default: "Default",
      alphabetAZ: "Alphabetically, A-Z",
      alphabetZA: "Alphabetically, Z-A",
      priceLowHigh: "Price, low to high",
      priceHighLow: "Price, high to low",
    },
  };

  const t = translations[currentLanguageId] || translations.en;

  // สร้าง sorting options ตามภาษา
  const localizedSortingOptions = [
    { value: "default", text: t.default },
    { value: "alphabetAZ", text: t.alphabetAZ },
    { value: "alphabetZA", text: t.alphabetZA },
    { value: "priceLowHigh", text: t.priceLowHigh },
    { value: "priceHighLow", text: t.priceHighLow },
  ];

  useEffect(() => {
    if (selectedOptions.value === "default") {
      setFinalSorted([...products]);
    } else if (selectedOptions.value === "alphabetAZ") {
      setFinalSorted(
        [...products].sort((a, b) => a.title.localeCompare(b.title))
      );
    } else if (selectedOptions.value === "alphabetZA") {
      setFinalSorted(
        [...products].sort((a, b) => b.title.localeCompare(a.title))
      );
    } else if (selectedOptions.value === "priceLowHigh") {
      setFinalSorted([...products].sort((a, b) => a.price - b.price));
    } else if (selectedOptions.value === "priceHighLow") {
      setFinalSorted([...products].sort((a, b) => b.price - a.price));
    }
  }, [products, selectedOptions]);

  // อัพเดท selected option เมื่อเปลี่ยนภาษา
  useEffect(() => {
    const currentValue = selectedOptions.value || "default";
    const newOption = localizedSortingOptions.find(
      (opt) => opt.value === currentValue
    );
    if (newOption) {
      setSelectedOptions(newOption);
    }
  }, [currentLanguageId]);

  return (
    <>
      <div className="btn-select">
        <span className="text-sort-value">{selectedOptions.text}</span>
        <span className="icon icon-arrow-down" />
      </div>
      <div className="dropdown-menu">
        {localizedSortingOptions.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedOptions(item)}
            className={`select-item ${
              item.value === selectedOptions.value ? "active" : ""
            }`}
          >
            <span className="text-value-item">{item.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}
