"use client";
import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageProvider";
import { Tabs, Tab, Box } from "@mui/material";
import Link from "next/link";

// ฟังก์ชันตรวจสอบภาษาไทย
function isThai(text) {
  return /[\u0E00-\u0E7F]/.test(text);
}

export default function Header7() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const themeContext = useContext(ThemeContext);
  const { currentLanguageId } = useLanguage();
  const [allSolutions, setAllSolutions] = useState([]);
  const [showSolutionsDropdown, setShowSolutionsDropdown] = useState(false);
  const dropdownTimerRef = useRef(null);

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const MAX_DESKTOP_SOLUTIONS = 9;

  const handleEnterSolutions = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setShowSolutionsDropdown(true);
  };

  const handleLeaveSolutions = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setShowSolutionsDropdown(false);
    }, 150);
  };

  const isActivePath = (path) => {
    if (path === "/") return pathname === "/";
    if (path === "/all-solution")
      return (
        pathname === "/all-solution" || pathname.startsWith("/solution-detail/")
      );
    return pathname.startsWith(path);
  };

  // กรองและจัดกลุ่ม solutions ตามภาษา
  const solutionMenu = useMemo(() => {
    // สร้าง map category_id -> [solutionTH, solutionEN]
    const solutionMap = {};
    allSolutions.forEach((solution) => {
      const lang = isThai(solution.name) ? "th" : "en";
      if (!solutionMap[solution.category_id]) {
        solutionMap[solution.category_id] = {};
      }
      solutionMap[solution.category_id][lang] = solution;
    });

    // เลือก solution ตามภาษาปัจจุบัน
    const filtered = Object.values(solutionMap)
      .map((solutions) => solutions[currentLanguageId])
      .filter(Boolean)
      .filter((solution) => solution.active === 1);

    return filtered;
  }, [allSolutions, currentLanguageId]);

  const limitedDesktopSolutions = solutionMenu.slice(0, MAX_DESKTOP_SOLUTIONS);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/solution-categories/`);
        if (!response.ok) throw new Error("Failed to fetch solutions");
        const data = await response.json();
        setAllSolutions(data);
      } catch (error) {
        console.error("Error fetching solution categories:", error);
      }
    };
    fetchSolutions();
  }, [apiEndpoint]);

  // ปรับปรุง cleanup effect
  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  if (!themeContext || !themeContext.theme) return null;
  const { theme } = themeContext;

  const tabSx = (active) => ({
    fontWeight: active ? 700 : 600,
    borderRadius: "10px",
    px: 4.5,
    py: 1.5,
    fontSize: "1rem",
    minHeight: "48px",
    lineHeight: 1.2,
    transition: "all 0.35s ease",
    margin: "10px",
    height: "60px",
    "&:hover": {
      transform: "translateY(-3px) scale(1.06)",
    },
    "&:active": {
      transform: "scale(0.97)",
    },
    ...(active && {
      backgroundColor: theme.primaryColor,
      color: "#fff",
      boxShadow: "0 0 16px rgba(0,0,0,0.15)",
    }),
  });

  // ฟังก์ชันจัดการ image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/default-solution.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/")) return imageUrl;
    return "/" + imageUrl;
  };

  return (
    <header
      id="header"
      className="header-default header-style-2 kanit-font-header d-none d-xl-block"
      style={{ position: "static", backgroundColor: theme.backgroundColor }}
    >
      <div className="main-header line">
        <div className="container-full px_15 lg-px_40">
          <div className="row wrapper-header align-items-center">
            <div className="col-12">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Tabs
                  value={false}
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    alignItems: "center",
                    margin: "20px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    "& .MuiTab-root": {
                      fontWeight: 600,
                      textTransform: "uppercase",
                    },
                  }}
                >
                  <Tab
                    label={t("navigation.home")}
                    component={Link}
                    href="/"
                    sx={tabSx(isActivePath("/"))}
                  />

                  <Tab
                    label={
                      <Box display="flex" alignItems="center">
                        {t("navigation.solutions")}
                        <ChevronDown size={12} style={{ marginLeft: 4 }} />
                      </Box>
                    }
                    component={Link}
                    href="/all-solution"
                    onMouseEnter={handleEnterSolutions}
                    onMouseLeave={handleLeaveSolutions}
                    sx={tabSx(isActivePath("/all-solution"))}
                  />

                  <Tab
                    label={t("navigation.products")}
                    component={Link}
                    href="/tkc-product"
                    sx={tabSx(isActivePath("/tkc-product"))}
                  />
                  <Tab
                    label={t("navigation.blog")}
                    component={Link}
                    href="/blog-sidebar-right"
                    sx={tabSx(isActivePath("/blog-sidebar-right"))}
                  />
                  <Tab
                    label={t("navigation.contact")}
                    component={Link}
                    href="/store-locations"
                    sx={tabSx(isActivePath("/store-locations"))}
                  />
                  <Tab
                    label={t("navigation.about")}
                    component={Link}
                    href="/about-us"
                    sx={tabSx(isActivePath("/about-us"))}
                  />
                </Tabs>

                {showSolutionsDropdown && solutionMenu.length > 0 && (
                  <Box
                    onMouseEnter={handleEnterSolutions}
                    onMouseLeave={handleLeaveSolutions}
                    sx={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      p: 3,
                      borderRadius: 2,
                      minWidth: "800px",
                      maxWidth: "1000px",
                      zIndex: 10,
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: 2,
                      }}
                    >
                      {limitedDesktopSolutions.map((solution) => (
                        <Link
                          key={`${solution.category_id}-${currentLanguageId}`}
                          href={`/solution-detail/${solution.category_id}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <Box
                            sx={{
                              padding: "12px",
                              borderRadius: "8px",
                              display: "flex",
                              gap: "12px",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "#f8f9fa",
                                transform: "translateY(-2px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: 100,
                                maxWidth: 100,
                                height: 80,
                                borderRadius: 1,
                                overflow: "hidden",
                                border: "1px solid #ddd",
                                bgcolor: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={getImageUrl(solution.image_url)}
                                alt={solution.name}
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                  display: "block",
                                  borderRadius: "8px",
                                }}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/images/default-solution.png";
                                }}
                                loading="lazy"
                              />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  mb: 0.5,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {solution.name}
                              </Box>
                              <Box
                                sx={{
                                  fontSize: 12,
                                  color: "#666",
                                  lineHeight: 1.4,
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  wordBreak: "break-word",
                                }}
                              >
                                {solution.description}
                              </Box>
                            </Box>
                          </Box>
                        </Link>
                      ))}
                    </Box>

                    {/* แสดงข้อความหากไม่มีข้อมูล */}
                    {limitedDesktopSolutions.length === 0 && (
                      <Box sx={{ textAlign: "center", py: 3, color: "#666" }}>
                        {t("navigation.noSolutionsFound", "No solutions found")}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
