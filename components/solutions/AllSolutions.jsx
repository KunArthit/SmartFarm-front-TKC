

"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "@/context/LanguageProvider";

function isThai(text) {
  return typeof text === 'string' && /[\u0E00-\u0E7F]/.test(text);
}

const SolutionDetails = () => {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [allSolutions, setAllSolutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [solutionsPerPage] = useState(4);
  const router = useRouter();

  const { t } = useTranslation();
  const { currentLanguageId } = useLanguage();

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== "undefined") {
        setIsLargeScreen(window.innerWidth >= 1024);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const res = await fetch(`${apiEndpoint}/solution-categories/`);
        const data = await res.json();
        setAllSolutions(data); 
      } catch (error) {
        console.error("Failed to fetch solutions:", error);
      }
    };
    fetchSolutions();
  }, [apiEndpoint]);

  //ใช้ useMemo ในการกรองข้อมูลตามภาษาที่เลือก
  const filteredSolutions = useMemo(() => {
    const solutionMap = {};
    allSolutions.forEach((solution) => {
      const lang = isThai(solution.name) ? "th" : "en";
      if (!solutionMap[solution.category_id]) {
        solutionMap[solution.category_id] = {};
      }
      solutionMap[solution.category_id][lang] = solution;
    });

    const filtered = Object.values(solutionMap)
      .map((solutions) => solutions[currentLanguageId])
      .filter(Boolean) // กรองค่าที่อาจเป็น undefined ออกไป
      .filter((solution) => solution.active === 1);

    return filtered;
  }, [allSolutions, currentLanguageId]); // จะทำงานใหม่เมื่อ allSolutions หรือ currentLanguageId เปลี่ยน

  const handleSolutionClick = useCallback(
    (solutionId) => {
      router.push(`/solution-detail/${solutionId}`);
    },
    [router]
  );

  //คำนวณ pagination จากข้อมูลที่กรองภาษาแล้ว
  const indexOfLastSolution = currentPage * solutionsPerPage;
  const indexOfFirstSolution = indexOfLastSolution - solutionsPerPage;
  const currentSolutions = filteredSolutions.slice(
    indexOfFirstSolution,
    indexOfLastSolution
  );
  const totalPages = Math.ceil(filteredSolutions.length / solutionsPerPage);

  const handlePageChange = (pageNumber) => {
    // Reset to page 1 if the page number is out of bounds after filtering
    if (pageNumber > totalPages && totalPages > 0) {
        setCurrentPage(1);
    } else {
        setCurrentPage(pageNumber);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Effect to reset page number when filteredSolutions change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSolutions]);


  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "2rem 1rem",
  };
  const wrapperStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };
  const sectionStyle = {
    marginBottom: "4rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "#ffffff",
    padding: "0",
    borderRadius: "12px",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };
  const imageContainerStyle = {
    width: "100%",
    maxWidth: "500px",
    overflow: "hidden",
    flex: "1",
  };
  const imageStyle = {
    width: "100%",
    height: "400px",
    minHeight: "300px",
    objectFit: "cover",
    borderRadius: "0",
  };
  const contentStyle = {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "2rem",
    flex: "1",
    justifyContent: "center",
  };
  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
    lineHeight: "1.2",
  };
  const subtitleStyle = {
    fontSize: "1.5rem",
    color: "#6b7280",
    marginBottom: "1rem",
  };
  const descriptionStyle = {
    fontSize: "1.125rem",
    color: "#374151",
    lineHeight: "1.7",
    marginBottom: "1.5rem",
  };
  const buttonStyle = {
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "0.75rem 1.5rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    alignSelf: "flex-start",
  };
  const buttonHoverStyle = {
    backgroundColor: "#1f2937",
  };
  const paginationContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "3rem",
    marginBottom: "2rem",
  };
  const paginationButtonStyle = {
    padding: "0.5rem 1rem",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  };
  const paginationButtonHoverStyle = {
    backgroundColor: "#f3f4f6",
    borderColor: "#9ca3af",
  };
  const paginationButtonActiveStyle = {
    backgroundColor: "#000000",
    borderColor: "#000000",
    color: "#ffffff",
  };
  const paginationButtonDisabledStyle = {
    opacity: "0.5",
    cursor: "not-allowed",
  };
  const paginationInfoStyle = {
    fontSize: "0.875rem",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {/* Solutions List */}
        {currentSolutions.map((solution, index) => (
          <div
            key={`${solution.category_id}-${currentLanguageId}`} // เพิ่ม currentLanguageId ใน key เพื่อให้ re-render
            style={{
              ...sectionStyle,
              ...(isLargeScreen
                ? { flexDirection: index % 2 === 0 ? "row" : "row-reverse" }
                : {}),
            }}
          >
            <div style={imageContainerStyle}>
              <img
                src={solution.image_url}
                alt={solution.name}
                style={imageStyle}
              />
            </div>

            <div style={contentStyle}>
              <div>
                <h2 style={titleStyle}>{solution.name}</h2>
                <h3 style={subtitleStyle}>{solution.name}</h3>
              </div>

              <p style={descriptionStyle}>{solution.description}</p>

              <button
                style={{
                  ...buttonStyle,
                  ...(hoveredButton === solution.category_id
                    ? buttonHoverStyle
                    : {}),
                }}
                onMouseEnter={() => setHoveredButton(solution.category_id)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleSolutionClick(solution.category_id)}
              >
                {t("navigation.readmore")}
                <svg
                  style={{ width: "16px", height: "16px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Pagination Info */}
        <div style={paginationInfoStyle}>
          {t("solution.show")} {indexOfFirstSolution + 1}-
          {Math.min(indexOfLastSolution, filteredSolutions.length)} {t("solution.of")}{" "}
          {filteredSolutions.length} {t("solution.list")}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={paginationContainerStyle}>
            {/* Previous Button */}
            <button
              style={{
                ...paginationButtonStyle,
                ...(currentPage === 1 ? paginationButtonDisabledStyle : {}),
              }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  Object.assign(e.target.style, paginationButtonHoverStyle);
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  Object.assign(e.target.style, paginationButtonStyle);
                }
              }}
            >
              <svg
                style={{ width: "16px", height: "16px" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t("blog.previous")}
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  style={{
                    ...paginationButtonStyle,
                    ...(currentPage === pageNumber
                      ? paginationButtonActiveStyle
                      : {}),
                  }}
                  onClick={() => handlePageChange(pageNumber)}
                  onMouseEnter={(e) => {
                    if (currentPage !== pageNumber) {
                      Object.assign(e.target.style, {
                        ...paginationButtonStyle,
                        ...paginationButtonHoverStyle,
                      });
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== pageNumber) {
                      Object.assign(e.target.style, paginationButtonStyle);
                    }
                  }}
                >
                  {pageNumber}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              style={{
                ...paginationButtonStyle,
                ...(currentPage === totalPages
                  ? paginationButtonDisabledStyle
                  : {}),
              }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  Object.assign(e.target.style, paginationButtonHoverStyle);
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  Object.assign(e.target.style, paginationButtonStyle);
                }
              }}
            >
              {t("blog.next")}
              <svg
                style={{ width: "16px", height: "16px" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionDetails;
