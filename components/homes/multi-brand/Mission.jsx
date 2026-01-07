import React from "react";
import { Leaf, ShoppingCart, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mui/material";
import bgImage from "../../../public/images/collections/mission.png";
import Image from "next/image";

const MissionSection = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:768px)");

  const missions = [
    {
      icon: (
        <Leaf style={{ width: "48px", height: "48px", color: "#059669" }} />
      ),
      title: t("mission.smartfarm"),
      subtitle: t("mission.subtitle1"),
      description: t("mission.description1"),
    },
    {
      icon: (
        <ShoppingCart
          style={{ width: "48px", height: "48px", color: "#2563eb" }}
        />
      ),
      title: t("mission.AgriSmartCart"),
      subtitle: t("mission.subtitle2"),
      description: t("mission.description2"),
    },
    {
      icon: <Zap style={{ width: "48px", height: "48px", color: "#ca8a04" }} />,
      title: t("mission.AgriTechInnovation"),
      subtitle: t("mission.subtitle3"),
      description: t("mission.description3"),
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "80vh",
        overflow: "hidden",
      }}
    >
      {/* Fallback background image for Next.js production */}
      <Image
        src={bgImage}
        alt="mission background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
        aria-hidden="true"
        draggable={false}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(50, 101, 50, 0.3)",
          zIndex: 1,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(50, 101, 50, 0.3)",
        }}
      ></div>

      {/* Leaf Pattern Decorations */}
      <div
        style={{
          position: "absolute",
          inset: "0",
          opacity: "0.1",
          zIndex: 2,
        }}
      >
        {!isMobile && (
          <>
            <div
              style={{
                position: "absolute",
                top: "80px",
                left: "40px",
                transform: "rotate(12deg)",
              }}
            >
              <Leaf
                style={{ width: "128px", height: "128px", color: "#166534" }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "80px",
                right: "40px",
                transform: "rotate(-12deg)",
              }}
            >
              <Leaf
                style={{ width: "160px", height: "160px", color: "#15803d" }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "25%",
                transform: "rotate(45deg)",
              }}
            >
              <Leaf
                style={{ width: "96px", height: "96px", color: "#166534" }}
              />
            </div>
          </>
        )}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "40px 16px" : "80px 24px",
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "40px" : "64px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "2rem" : "4rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "16px",
            }}
          >
            {t("mission.Mission")}
          </h1>
        </div>

        {/* Mission Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
            gap: isMobile ? "24px" : "38px 80px",
            maxWidth: "1536px",
            margin: isMobile ? "0 auto" : "0 -100px",
          }}
        >
          {missions.map((mission, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "hsla(0, 0%, 100%, 0.22)",
                backdropFilter: "blur(8px)",
                borderRadius: "24px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "inline-block",
                  marginBottom: "10px",
                }}
              >
                {mission.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#fff",
                  margin: "12px 0",
                }}
              >
                {mission.title}
              </h3>
              <h4
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px",
                  lineHeight: 1.5,
                }}
              >
                {mission.subtitle}
              </h4>
              <p
                style={{
                  color: "#fff",
                  lineHeight: 1.625,
                  fontSize: "0.875rem",
                  margin: 0,
                }}
              >
                {mission.description}
              </p>
              <div
                style={{
                  marginTop: "24px",
                  width: "64px",
                  height: "4px",
                  background: "linear-gradient(to right, #4ade80, #3b82f6)",
                  borderRadius: "9999px",
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionSection;
