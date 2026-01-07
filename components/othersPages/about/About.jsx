"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import HuaweiLogo from "../../../public/images/logo/huawei.jpg";
import EricssonLogo from "../../../public/images/logo/Ericsson.jpg";
import CiscoLogo from "../../../public/images/logo/Cisco.png";
import OracleLogo from "../../../public/images/logo/Oracle.png";
import NokiaLogo from "../../../public/images/logo/Nokie.png";
import DtacLogo from "../../../public/images/logo/Dtac.png";
import TrueLogo from "../../../public/images/logo/True.png";
import AisLogo from "../../../public/images/logo/Ais.jpg";
import VerintLogo from "../../../public/images/logo/Verint.png";
import XovisLogo from "../../../public/images/logo/Xovis.jpg";
import NetkaLogo from "../../../public/images/logo/Netka.jpg";

const AboutUs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    experience: 0,
    projects: 0,
    certifications: 0,
    employees: 0,
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    const timer = setTimeout(() => {
      setAnimatedNumbers({
        experience: 22,
        projects: 100,
        certifications: 5,
        employees: 150,
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const businessLines = [
    {
      title: t("aboutUs.btitle1"),
      subtitle: t("aboutUs.bsubtitle1"),
      description: t("aboutUs.bdescription1"),
      services: [
        t("aboutUs.bservices1"),
        t("aboutUs.bservices2"),
        t("aboutUs.bservices3"),
        t("aboutUs.bservices4"),
        t("aboutUs.bservices5"),
        t("aboutUs.bservices6"),
        t("aboutUs.bservices7"),
        t("aboutUs.bservices8"),
      ],
    },
    {
      title: t("aboutUs.btitle2"),
      subtitle: t("aboutUs.bsubtitle2"),
      description: t("aboutUs.bdescription2"),
      services: [
        t("aboutUs.bservices9"),
        t("aboutUs.bservices10"),
        t("aboutUs.bservices11"),
        t("aboutUs.bservices12"),
        t("aboutUs.bservices13"),
        t("aboutUs.bservices14"),
        t("aboutUs.bservices15"),
        t("aboutUs.bservices16"),
        t("aboutUs.bservices17"),
        t("aboutUs.bservices18"),
      ],
    },
    {
      title: t("aboutUs.btitle3"),
      subtitle: t("aboutUs.bsubtitle3"),
      description: t("aboutUs.bdescription3"),
      services: [
        t("aboutUs.bservices19"),
        t("aboutUs.bservices20"),
        t("aboutUs.bservices21"),
        t("aboutUs.bservices22"),
        t("aboutUs.bservices23"),
        t("aboutUs.bservices24"),
        t("aboutUs.bservices25"),
      ],
    },
  ];

  const majorProjects = [
    {
      year: t("aboutUs.myear1"),
      project: t("aboutUs.mproject1"),
      client: t("aboutUs.mclient1"),
      description: t("aboutUs.mdescription1"),
    },
    {
      year: t("aboutUs.myear2"),
      project: t("aboutUs.mproject2"),
      client: t("aboutUs.mclient2"),
      description: t("aboutUs.mdescription2"),
    },
    {
      year: t("aboutUs.myear3"),
      project: t("aboutUs.mproject3"),
      client: t("aboutUs.mclient3"),
      description: t("aboutUs.mdescription3"),
    },
    {
      year: t("aboutUs.myear4"),
      project: t("aboutUs.mproject4"),
      client: t("aboutUs.mclient4"),
      description: t("aboutUs.mdescription4"),
    },
    {
      year: t("aboutUs.myear5"),
      project: t("aboutUs.mproject5"),
      client: t("aboutUs.mclient5"),
      description: t("aboutUs.mdescription5"),
    },
    {
      year: t("aboutUs.myear6"),
      project: t("aboutUs.mproject6"),
      client: t("aboutUs.mclient6"),
      description: t("aboutUs.mdescription6"),
    },
  ];

  const partnerships = [
    {
      name: "Huawei",
      status: "Value Added Partner (VAP) & Certified Service Partner 5 ดาว",
      logo: HuaweiLogo,
      color: "#FF0000",
    },
    {
      name: "Ericsson",
      status: "Approved Partner & Top 3 Installation Partner",
      logo: EricssonLogo,
      color: "#0082F0",
    },
    {
      name: "Cisco",
      status: "Certified Premier Partner",
      logo: CiscoLogo,
      color: "#1BA0D7",
    },
    {
      name: "Oracle",
      status: "Gold Partner",
      logo: OracleLogo,
      color: "#F80000",
    },
    {
      name: "Nokia",
      status: "Authorized Partner",
      logo: NokiaLogo,
      color: "#124191",
    },
    {
      name: "DTAC",
      status: "Top 3 Installation Partner",
      logo: DtacLogo,
      color: "#00A651",
    },
    {
      name: "True",
      status: "Approved Vendor List",
      logo: TrueLogo,
      color: "#C5282F",
    },
    {
      name: "AIS",
      status: "Approved Vendor List",
      logo: AisLogo,
      color: "#00B14F",
    },
    {
      name: "Verint",
      status: "Top Partner Award Winner",
      logo: VerintLogo,
      color: "#0066CC",
    },
    {
      name: "XOVIS",
      status: "Certified Partner",
      logo: XovisLogo,
      color: "#FF6B35",
    },
    {
      name: "Netka System",
      status: "Authorized Partner",
      logo: NetkaLogo,
      color: "#333333",
    },
  ];

  const subsidiaries = [
    {
      name: t("aboutUs.sname1"),
      ownership: "98%",
      business: t("aboutUs.sbusiness1"),
      established: t("aboutUs.sestablished1"),
    },
    {
      name: t("aboutUs.sname2"),
      ownership: "99.60%",
      business: t("aboutUs.sbusiness2"),
      established: t("aboutUs.sestablished2"),
    },
    {
      name: t("aboutUs.sname3"),
      ownership: t("aboutUs.sownership3"),
      business: t("aboutUs.sbusiness3"),
      established: t("aboutUs.sestablished3"),
    },
    {
      name: t("aboutUs.sname4"),
      ownership: t("aboutUs.sownership4"),
      business: t("aboutUs.sbusiness4"),
      established: t("aboutUs.sestablished4"),
    },
  ];

  // Responsive styles object
  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: "1.6",
      color: "#333",
      backgroundColor: "#ffffff",
    },

    // Header Section
    header: {
      background: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white",
      padding: isMobile ? "40px 0" : "80px 0",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      minHeight: isMobile ? "300px" : "400px",
    },

    headerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },

    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: isMobile ? "0 15px" : "0 20px",
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: isMobile ? "300px" : "400px",
    },

    headerTitle: {
      fontSize: isMobile ? "2.2rem" : "4rem",
      fontWeight: "800",
      color: "#ffffff",
      margin: "0 0 15px 0",
      letterSpacing: isMobile ? "1px" : "2px",
      animation: "slideInUp 1s ease-out",
    },

    headerSubtitle: {
      fontSize: isMobile ? "1rem" : "1.8rem",
      fontWeight: "400",
      color: "#ffffff",
      margin: "0 0 20px 0",
      animation: "slideInUp 1s ease-out 0.2s both",
      lineHeight: isMobile ? "1.3" : "1.4",
    },

    headerDescription: {
      fontSize: isMobile ? "0.9rem" : "1.3rem",
      fontWeight: "300",
      margin: "0",
      opacity: "0.9",
      animation: "slideInUp 1s ease-out 0.4s both",
    },

    // Stats Section
    statsSection: {
      padding: isMobile ? "30px 0" : "80px 0",
      backgroundColor: "#fafafa",
    },

    statsContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: isMobile ? "0 15px" : "0 20px",
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      gap: isMobile ? "15px" : "30px",
    },

    statCard: {
      backgroundColor: "white",
      padding: isMobile ? "20px 10px" : "40px 20px",
      borderRadius: isMobile ? "10px" : "15px",
      border: "1px solid #e6ebff",
      textAlign: "center",
      boxShadow: "0 2px 10px rgba(0, 28, 231, 0.05)",
    },

    statNumber: {
      fontSize: isMobile ? "1.5rem" : "3rem",
      fontWeight: "800",
      color: "#001ce7",
      margin: "0 0 8px 0",
      lineHeight: "1",
    },

    statLabel: {
      fontSize: isMobile ? "0.8rem" : "1.1rem",
      fontWeight: "500",
      color: "#666",
      lineHeight: "1.2",
    },

    // Section Headers
    sectionHeader: {
      textAlign: "center",
      marginBottom: isMobile ? "30px" : "60px",
    },

    sectionTitle: {
      fontSize: isMobile ? "1.8rem" : "3rem",
      fontWeight: "700",
      color: "#001ce7",
      margin: "0 0 20px 0",
    },

    sectionDivider: {
      width: "120px",
      height: "4px",
      backgroundColor: "#001ce7",
      margin: "0 auto",
      borderRadius: "2px",
    },

    // Tab Navigation
    tabContainer: {
      display: "flex",
      justifyContent: isMobile ? "flex-start" : "center",
      marginBottom: isMobile ? "25px" : "50px",
      borderBottom: "1px solid #e6ebff",
      gap: isMobile ? "5px" : "10px",
      overflowX: isMobile ? "auto" : "visible",
      padding: isMobile ? "0 0 10px 0" : "0",
      WebkitOverflowScrolling: "touch",
    },

    tabButton: (isActive) => ({
      padding: isMobile ? "10px 15px" : "15px 30px",
      border: "none",
      backgroundColor: isActive ? "#001ce7" : "transparent",
      color: isActive ? "white" : "#666",
      fontSize: isMobile ? "0.85rem" : "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      borderRadius: isMobile ? "20px" : "25px",
      transition: "all 0.3s ease",
      marginBottom: "10px",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }),

    // Content Cards
    contentCard: {
      backgroundColor: "white",
      padding: isMobile ? "20px 15px" : "30px",
      borderRadius: isMobile ? "10px" : "15px",
      border: "1px solid #e6ebff",
      marginBottom: isMobile ? "20px" : "30px",
      boxShadow: "0 2px 10px rgba(0, 28, 231, 0.05)",
    },

    cardTitle: {
      fontSize: isMobile ? "1.1rem" : "1.3rem",
      fontWeight: "600",
      color: "#001ce7",
      margin: "0 0 10px 0",
      lineHeight: "1.3",
    },

    cardText: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      margin: "0 0 15px 0",
      lineHeight: "1.6",
      textAlign: "justify",
    },

    // Grid Layouts
    twoColumnGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: isMobile ? "20px" : "30px",
    },

    threeColumnGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(300px, 1fr))",
      gap: isMobile ? "15px" : "25px",
    },

    // Service Lists
    serviceGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(280px, 1fr))",
      gap: isMobile ? "10px" : "15px",
      marginTop: "20px",
    },

    serviceItem: {
      backgroundColor: "#f8f9ff",
      padding: isMobile ? "10px 12px" : "15px 20px",
      borderRadius: isMobile ? "8px" : "10px",
      border: "1px solid #e6ebff",
      fontSize: isMobile ? "0.85rem" : "1rem",
      lineHeight: "1.4",
    },

    // Partner Cards
    partnerCard: {
      backgroundColor: "white",
      padding: isMobile ? "15px" : "20px",
      borderRadius: isMobile ? "10px" : "12px",
      border: "1px solid #e6ebff",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "12px" : "20px",
      boxShadow: "0 2px 10px rgba(0, 28, 231, 0.05)",
      transition: "transform 0.3s ease",
    },

    partnerLogo: {
      width: isMobile ? "50px" : "70px",
      height: isMobile ? "50px" : "70px",
      backgroundColor: "#f8f9ff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      border: "2px solid #e6ebff",
      overflow: "hidden",
      padding: "4px",
    },

    partnerName: {
      fontSize: isMobile ? "0.95rem" : "1.2rem",
      fontWeight: "600",
      margin: "0 0 5px 0",
      color: "#333",
    },

    partnerStatus: {
      fontSize: isMobile ? "0.75rem" : "0.9rem",
      margin: "0",
      color: "#666",
      lineHeight: "1.3",
    },

    // Timeline
    timelineContainer: {
      position: "relative",
    },

    timelineItem: {
      marginBottom: isMobile ? "30px" : "50px",
      position: "relative",
    },

    timelineCard: {
      backgroundColor: "white",
      padding: isMobile ? "20px 15px" : "30px",
      borderRadius: isMobile ? "10px" : "15px",
      border: "1px solid #e6ebff",
      boxShadow: "0 5px 15px rgba(0, 28, 231, 0.1)",
      borderLeft: isMobile ? "4px solid #001ce7" : "5px solid #001ce7",
    },

    timelineYear: {
      fontSize: isMobile ? "1.3rem" : "2rem",
      fontWeight: "700",
      color: "#001ce7",
      marginBottom: "8px",
    },

    timelineTitle: {
      fontSize: isMobile ? "1rem" : "1.3rem",
      fontWeight: "600",
      margin: "0 0 15px 0",
      color: "#333",
    },

    timelineList: {
      margin: "0",
      padding: "0",
      listStyle: "none",
    },

    timelineListItem: {
      fontSize: isMobile ? "0.85rem" : "1rem",
      margin: "0 0 8px 0",
      paddingLeft: "15px",
      position: "relative",
      lineHeight: "1.4",
    },
  };

  return (
    <div style={styles.container}>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes countUp {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
          }
          
          /* Mobile scrollbar styling */
          .mobile-scroll::-webkit-scrollbar {
            height: 4px;
          }
          .mobile-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 2px;
          }
          .mobile-scroll::-webkit-scrollbar-thumb {
            background: #001ce7;
            border-radius: 2px;
          }
        `}
      </style>

      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>TKC</h1>
          <h2 style={styles.headerSubtitle}>{t("aboutUs.headerSubtitle")}</h2>
          <p style={styles.headerDescription}>
            {t("aboutUs.headerDescription")}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={styles.statsGrid}>
            {[
              {
                number: animatedNumbers.experience,
                label: t("aboutUs.experience"),
                suffix: "+",
              },
              {
                number: animatedNumbers.projects,
                label: t("aboutUs.projects"),
                suffix: "+",
              },
              {
                number: animatedNumbers.certifications,
                label: t("aboutUs.certifications"),
                suffix: "",
              },
              {
                number: animatedNumbers.employees,
                label: t("aboutUs.employees"),
                suffix: "+",
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  ...styles.statCard,
                  animation: `countUp 1s ease-out ${index * 0.1}s both`,
                }}
              >
                <div style={styles.statNumber}>
                  {stat.number}
                  {stat.suffix}
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Overview with Tabs */}
      <div
        style={{
          padding: isMobile ? "30px 0" : "80px 0",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "0 15px" : "0 20px",
          }}
        >
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>{t("aboutUs.aboutTKC")}</h2>
            <div style={styles.sectionDivider}></div>
          </div>

          {/* Tab Navigation */}
          <div
            style={styles.tabContainer}
            className={isMobile ? "mobile-scroll" : ""}
          >
            {[
              { id: "overview", label: t("aboutUs.overview") },
              { id: "business", label: t("aboutUs.business") },
              { id: "projects", label: t("aboutUs.projects") },
              { id: "partners", label: t("aboutUs.partners") },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={styles.tabButton(activeTab === tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: isMobile ? "200px" : "400px" }}>
            {activeTab === "overview" && (
              <div style={{ animation: "fadeInLeft 0.5s ease-out" }}>
                <div
                  style={{
                    backgroundColor: "#f8f9ff",
                    padding: isMobile ? "20px 15px" : "50px",
                    borderRadius: isMobile ? "10px" : "20px",
                    border: "1px solid #e6ebff",
                    marginBottom: isMobile ? "25px" : "40px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: isMobile ? "1.3rem" : "2rem",
                      fontWeight: "600",
                      color: "#001ce7",
                      margin: "0 0 20px 0",
                    }}
                  >
                    {t("aboutUs.history")}
                  </h3>
                  <p
                    style={{
                      fontSize: isMobile ? "0.9rem" : "1.2rem",
                      margin: "0 0 20px 0",
                      textAlign: "justify",
                      lineHeight: "1.7",
                    }}
                  >
                    {t("aboutUs.TKC")}
                  </p>

                  <p
                    style={{
                      fontSize: isMobile ? "0.9rem" : "1.2rem",
                      margin: "0 0 20px 0",
                      textAlign: "justify",
                      lineHeight: "1.7",
                    }}
                  >
                    {t("aboutUs.TKC2")}
                  </p>

                  <p
                    style={{
                      fontSize: isMobile ? "0.9rem" : "1.2rem",
                      margin: "0",
                      textAlign: "justify",
                      lineHeight: "1.7",
                    }}
                  >
                    {t("aboutUs.TKC3")}
                  </p>
                </div>

                <div style={styles.twoColumnGrid}>
                  <div style={styles.contentCard}>
                    <h4 style={styles.cardTitle}>{t("aboutUs.vision")}</h4>
                    <p style={styles.cardText}>
                      {t("aboutUs.visionDescription")}
                    </p>
                  </div>

                  <div style={styles.contentCard}>
                    <h4 style={styles.cardTitle}>{t("aboutUs.mission")}</h4>
                    <p style={styles.cardText}>
                      {t("aboutUs.missionDescription")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "business" && (
              <div style={{ animation: "fadeInRight 0.5s ease-out" }}>
                {businessLines.map((line, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "white" : "#f8f9ff",
                      padding: isMobile ? "20px 15px" : "40px",
                      borderRadius: isMobile ? "10px" : "20px",
                      marginBottom: isMobile ? "25px" : "40px",
                      border: "1px solid #e6ebff",
                      boxShadow: "0 2px 10px rgba(0, 28, 231, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: isMobile ? "1.1rem" : "1.8rem",
                        fontWeight: "600",
                        color: "#001ce7",
                        margin: "0 0 8px 0",
                        lineHeight: "1.3",
                      }}
                    >
                      {line.title}
                    </h3>
                    <p
                      style={{
                        fontSize: isMobile ? "0.8rem" : "1rem",
                        color: "#666",
                        margin: "0 0 15px 0",
                        fontStyle: "italic",
                      }}
                    >
                      {line.subtitle}
                    </p>
                    <p
                      style={{
                        fontSize: isMobile ? "0.9rem" : "1.1rem",
                        margin: "0 0 20px 0",
                        textAlign: "justify",
                        lineHeight: "1.6",
                      }}
                    >
                      {line.description}
                    </p>

                    <h4
                      style={{
                        fontSize: isMobile ? "1rem" : "1.3rem",
                        fontWeight: "600",
                        color: "#001ce7",
                        margin: "0 0 15px 0",
                      }}
                    >
                      {t("aboutUs.mainservices")}
                    </h4>
                    <div style={styles.serviceGrid}>
                      {line.services.map((service, idx) => (
                        <div key={idx} style={styles.serviceItem}>
                          • {service}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "projects" && (
              <div style={{ animation: "fadeInLeft 0.5s ease-out" }}>
                <h3
                  style={{
                    fontSize: isMobile ? "1.3rem" : "2rem",
                    fontWeight: "600",
                    color: "#001ce7",
                    margin: "0 0 30px 0",
                    textAlign: "center",
                  }}
                >
                  {t("aboutUs.previousProjects")}
                </h3>
                <div style={styles.twoColumnGrid}>
                  {majorProjects.map((project, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "white",
                        padding: isMobile ? "20px 15px" : "25px",
                        borderRadius: isMobile ? "10px" : "15px",
                        boxShadow: "0 5px 15px rgba(0, 28, 231, 0.1)",
                        border: "1px solid #e6ebff",
                        borderLeft: isMobile
                          ? "4px solid #001ce7"
                          : "5px solid #001ce7",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        !isMobile &&
                        (e.currentTarget.style.transform = "translateY(-5px)")
                      }
                      onMouseLeave={(e) =>
                        !isMobile &&
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      <div
                        style={{
                          fontSize: isMobile ? "1.1rem" : "1.5rem",
                          fontWeight: "700",
                          color: "#001ce7",
                          margin: "0 0 8px 0",
                        }}
                      >
                        {project.year}
                      </div>
                      <h4
                        style={{
                          fontSize: isMobile ? "0.95rem" : "1.2rem",
                          fontWeight: "600",
                          margin: "0 0 8px 0",
                          color: "#333",
                          lineHeight: "1.3",
                        }}
                      >
                        {project.project}
                      </h4>
                      <p
                        style={{
                          fontSize: isMobile ? "0.85rem" : "1rem",
                          color: "#666",
                          margin: "0 0 12px 0",
                          fontWeight: "500",
                        }}
                      >
                        {t("aboutUs.customer")} {project.client}
                      </p>
                      <p
                        style={{
                          fontSize: isMobile ? "0.85rem" : "1rem",
                          margin: "0",
                          lineHeight: "1.5",
                          textAlign: "justify",
                        }}
                      >
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "partners" && (
              <div style={{ animation: "fadeInRight 0.5s ease-out" }}>
                <h3
                  style={{
                    fontSize: isMobile ? "1.3rem" : "2rem",
                    fontWeight: "600",
                    color: "#001ce7",
                    margin: "0 0 30px 0",
                    textAlign: "center",
                  }}
                >
                  {t("aboutUs.part")}
                </h3>
                <div style={styles.threeColumnGrid}>
                  {partnerships.map((partner, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.partnerCard,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        !isMobile &&
                        (e.currentTarget.style.transform = "translateY(-3px)")
                      }
                      onMouseLeave={(e) =>
                        !isMobile &&
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      <div style={styles.partnerLogo}>
                        <Image
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            borderRadius: "50%",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.innerHTML = `
                              <div style="
                                width: 100%; 
                                height: 100%; 
                                background-color: ${partner.color}; 
                                color: white; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-weight: bold; 
                                font-size: ${isMobile ? "1rem" : "1.3rem"};
                                border-radius: 50%;
                              ">
                                ${partner.name.charAt(0)}
                              </div>
                            `;
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={styles.partnerName}>{partner.name}</h4>
                        <p style={styles.partnerStatus}>{partner.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subsidiaries & Investments */}
      <div
        style={{
          padding: isMobile ? "30px 0" : "80px 0",
          backgroundColor: "#fafafa",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "0 15px" : "0 20px",
          }}
        >
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              {t("aboutUs.Affiliatedcompanies")}
            </h2>
            <div style={styles.sectionDivider}></div>
          </div>

          <div style={styles.twoColumnGrid}>
            {subsidiaries.map((sub, index) => (
              <div key={index} style={styles.contentCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "8px" : "0",
                  }}
                >
                  <h4
                    style={{
                      fontSize: isMobile ? "1rem" : "1.2rem",
                      fontWeight: "600",
                      margin: "0",
                      color: "#001ce7",
                      flex: 1,
                      lineHeight: "1.3",
                    }}
                  >
                    {sub.name}
                  </h4>
                  <span
                    style={{
                      backgroundColor: "#001ce7",
                      color: "white",
                      padding: isMobile ? "4px 12px" : "6px 15px",
                      borderRadius: "15px",
                      fontSize: isMobile ? "0.75rem" : "0.85rem",
                      fontWeight: "600",
                      alignSelf: isMobile ? "flex-start" : "auto",
                    }}
                  >
                    {sub.ownership}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: isMobile ? "0.85rem" : "0.95rem",
                    margin: "0 0 8px 0",
                    color: "#666",
                    lineHeight: "1.4",
                  }}
                >
                  <strong>{t("aboutUs.business2")}:</strong> {sub.business}
                </p>
                <p
                  style={{
                    fontSize: isMobile ? "0.85rem" : "0.95rem",
                    margin: "0",
                    color: "#666",
                    lineHeight: "1.4",
                  }}
                >
                  <strong>{t("aboutUs.founded")}:</strong> {sub.established}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications & Awards */}
      <div
        style={{
          padding: isMobile ? "30px 0" : "80px 0",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "0 15px" : "0 20px",
          }}
        >
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>{t("aboutUs.standards")}</h2>
            <div style={styles.sectionDivider}></div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(auto-fit, minmax(250px, 1fr))",
              gap: isMobile ? "15px" : "25px",
              marginBottom: isMobile ? "30px" : "50px",
            }}
          >
            {[
              {
                title: "ISO 9001:2015",
                description: t("aboutUs.iso9001"),
                year: t("aboutUs.iso9001year"),
                icon: "🏆",
              },
              {
                title: "ISO 29110-4-1:2018",
                description: t("aboutUs.iso2911"),
                year: t("aboutUs.iso2911year"),
                icon: "💻",
              },
              {
                title: "ISO 27001:2022",
                description: t("aboutUs.iso27001"),
                year: t("aboutUs.iso27001year"),
                icon: "🔒",
              },
              {
                title: t("aboutUs.ncsa"),
                description: t("aboutUs.ncsaDescription"),
                year: t("aboutUs.ncsayear"),
                icon: "📋",
              },
            ].map((cert, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#f8f9ff",
                  padding: isMobile ? "20px 15px" : "25px",
                  borderRadius: isMobile ? "10px" : "15px",
                  border: "1px solid #e6ebff",
                  textAlign: "center",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  !isMobile &&
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  !isMobile &&
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  style={{
                    fontSize: isMobile ? "1.5rem" : "2.5rem",
                    marginBottom: isMobile ? "12px" : "20px",
                  }}
                >
                  {cert.icon}
                </div>
                <h4
                  style={{
                    color: "#001ce7",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                    fontSize: isMobile ? "0.95rem" : "1.2rem",
                    lineHeight: "1.3",
                  }}
                >
                  {cert.title}
                </h4>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    color: "#666",
                    lineHeight: "1.4",
                  }}
                >
                  {cert.description}
                </p>
                <span
                  style={{
                    backgroundColor: "#001ce7",
                    color: "white",
                    padding: isMobile ? "4px 10px" : "5px 12px",
                    borderRadius: "12px",
                    fontSize: isMobile ? "0.75rem" : "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  {cert.year}
                </span>
              </div>
            ))}
          </div>

          {/* Awards Section */}
          <div
            style={{
              backgroundColor: "#f8f9ff",
              padding: isMobile ? "25px 15px" : "40px",
              borderRadius: isMobile ? "10px" : "20px",
              border: "1px solid #e6ebff",
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "1.3rem" : "1.8rem",
                fontWeight: "600",
                color: "#001ce7",
                margin: "0 0 25px 0",
                textAlign: "center",
              }}
            >
              {t("aboutUs.awards")}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(300px, 1fr))",
                gap: isMobile ? "10px" : "15px",
              }}
            >
              {[
                t("aboutUs.toppartners"),
                t("aboutUs.ranked"),
                t("aboutUs.ranked2"),
                t("aboutUs.value"),
                t("aboutUs.certifiedHuawei"),
                t("aboutUs.goldPartner"),
                t("aboutUs.certifiedPremier"),
              ].map((award, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "white",
                    padding: isMobile ? "12px 15px" : "15px 20px",
                    borderRadius: isMobile ? "8px" : "10px",
                    border: "1px solid #e6ebff",
                    textAlign: "center",
                    fontSize: isMobile ? "0.85rem" : "0.95rem",
                    lineHeight: "1.4",
                  }}
                >
                  🏅 {award}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Timeline */}
      <div
        style={{
          padding: isMobile ? "30px 0" : "80px 0",
          backgroundColor: "#fafafa",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "0 15px" : "0 20px",
          }}
        >
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>{t("aboutUs.growthpath")}</h2>
            <div style={styles.sectionDivider}></div>
          </div>

          <div style={styles.timelineContainer}>
            {[
              {
                year: t("aboutUs.year1"),
                title: t("aboutUs.title1"),
                events: [t("aboutUs.event1"), t("aboutUs.event2")],
              },
              {
                year: t("aboutUs.year2"),
                title: t("aboutUs.title2"),
                events: [
                  t("aboutUs.event3"),
                  t("aboutUs.event4"),
                  t("aboutUs.event5"),
                  t("aboutUs.event6"),
                ],
              },
              {
                year: t("aboutUs.year3"),
                title: t("aboutUs.title3"),
                events: [t("aboutUs.event7"), t("aboutUs.event8")],
              },
              {
                year: t("aboutUs.year4"),
                title: t("aboutUs.title4"),
                events: [
                  t("aboutUs.event9"),
                  t("aboutUs.event10"),
                  t("aboutUs.event11"),
                  t("aboutUs.event12"),
                ],
              },
              {
                year: t("aboutUs.year5"),
                title: t("aboutUs.title5"),
                events: [
                  t("aboutUs.event13"),
                  t("aboutUs.event14"),
                  t("aboutUs.event15"),
                ],
              },
              {
                year: t("aboutUs.year6"),
                title: t("aboutUs.title6"),
                events: [
                  t("aboutUs.event16"),
                  t("aboutUs.event17"),
                  t("aboutUs.event18"),
                ],
              },
              {
                year: t("aboutUs.year7"),
                title: t("aboutUs.title7"),
                events: [
                  t("aboutUs.event19"),
                  t("aboutUs.event20"),
                  t("aboutUs.event21"),
                  t("aboutUs.event22"),
                ],
              },
            ].map((period, index) => (
              <div key={index} style={styles.timelineItem}>
                <div style={styles.timelineCard}>
                  <div style={styles.timelineYear}>{period.year}</div>
                  <h4 style={styles.timelineTitle}>{period.title}</h4>
                  <ul style={styles.timelineList}>
                    {period.events.map((event, eventIndex) => (
                      <li key={eventIndex} style={styles.timelineListItem}>
                        <span
                          style={{
                            position: "absolute",
                            left: "0",
                            color: "#001ce7",
                            fontWeight: "bold",
                          }}
                        >
                          •
                        </span>
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
