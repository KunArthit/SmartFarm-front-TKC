"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

export default function MyAccount() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadUserData = () => {
      try {
        if (typeof window !== "undefined") {
          const storedUserData = localStorage.getItem("user_data");
          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            // console.log("Loaded user data:", parsedUserData);
            setUserData(parsedUserData);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Listen for storage changes (multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === "user_data") {
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Helper functions to get user information
  const getUserDisplayName = () => {
    if (!userData) return "User";

    const firstName = userData.first_name || userData.firstName || "";
    const lastName = userData.last_name || userData.lastName || "";

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (userData.username) {
      return userData.username;
    }

    return "User";
  };

  const getAccountStatus = () => {
    if (!userData) return "Unknown";
    return userData.is_active === 1 ? t("edit.Active") : t("edit.Inactive");
  };

  if (loading) {
    return (
      <div className="my-account-content account-dashboard">
        <div className="mb_60">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #32cd32",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <span>{t("account.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="my-account-content account-dashboard">
        <div className="mb_60">
          <h5 className="fw-5 mb_20">{t("account.information")}</h5>
          <div
            className="alert alert-warning"
            style={{
              padding: "15px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "8px",
              color: "#856404",
            }}
          >
            <p className="mb-0">
              {t("account.noinformation")}{" "}
              <Link href="/login" className="text_primary">
                {t("account.login")}
              </Link>{" "}
              {t("account.toview")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-dashboard">
      <div className="mb_60">
        <h5 className="fw-5 mb_20">
          {t("account.hello")} {getUserDisplayName()}
        </h5>

        {/* User Information Card */}
        <div
          className="user-info-card"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "30px",
          }}
        >
          <div className="row">
            <div className="col-md-6">
              <div className="info-item mb-3">
                <strong style={{ color: "#495057", fontSize: "14px" }}>
                  {t("account.fullname")}:
                </strong>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#212529",
                    marginTop: "4px",
                  }}
                >
                  {getUserDisplayName()}
                </div>
              </div>

              <div className="info-item mb-3">
                <strong style={{ color: "#495057", fontSize: "14px" }}>
                  {t("account.email")}:
                </strong>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#212529",
                    marginTop: "4px",
                  }}
                >
                  {userData.email || t("account.notprovided")}
                </div>
              </div>

              <div className="info-item mb-3">
                <strong style={{ color: "#495057", fontSize: "14px" }}>
                  {t("account.username")}:
                </strong>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#212529",
                    marginTop: "4px",
                  }}
                >
                  {userData.username || t("account.notprovided")}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="info-item mb-3">
                <strong style={{ color: "#495057", fontSize: "14px" }}>
                  {t("account.phone")}:
                </strong>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#212529",
                    marginTop: "4px",
                  }}
                >
                  {userData.phone || t("account.notprovided")}
                </div>
              </div>

              <div className="info-item mb-3">
                <strong style={{ color: "#495057", fontSize: "14px" }}>
                  {t("account.status")}:
                </strong>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#212529",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        userData.is_active === 1 ? "#28a745" : "#dc3545",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {getAccountStatus()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information (if available) */}
          {userData.company_name && (
            <div
              className="company-info mt-4 pt-3"
              style={{ borderTop: "1px solid #dee2e6" }}
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="info-item mb-3">
                    <strong style={{ color: "#495057", fontSize: "14px" }}>
                      {t("account.company")}:
                    </strong>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#212529",
                        marginTop: "4px",
                      }}
                    >
                      {userData.company_name}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  {userData.tax_id && (
                    <div className="info-item mb-3">
                      <strong style={{ color: "#495057", fontSize: "14px" }}>
                        {t("account.taxid")}:
                      </strong>
                      <div
                        style={{
                          fontSize: "16px",
                          color: "#212529",
                          marginTop: "4px",
                        }}
                      >
                        {userData.tax_id}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Dates */}
          <div
            className="account-dates mt-4 pt-3"
            style={{ borderTop: "1px solid #dee2e6" }}
          >
            <div className="row">
              <div className="col-md-6">
                <div className="info-item mb-3">
                  <strong style={{ color: "#495057", fontSize: "14px" }}>
                    {t("account.membersince")}:
                  </strong>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#212529",
                      marginTop: "4px",
                    }}
                  >
                    {format(new Date(userData.created_at), 'dd-MM-yyyy : HH:mm:ss')}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-item mb-3">
                  <strong style={{ color: "#495057", fontSize: "14px" }}>
                    {t("account.lastupdated")}:
                  </strong>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#212529",
                      marginTop: "4px",
                    }}
                  >
                    {format(new Date(userData.updated_at), 'dd-MM-yyyy : HH:mm:ss')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management Links */}
        <div className="account-actions">
          <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#6c757d" }}>
            {t("account.from")}{" "}
            <Link
              className="text_primary"
              href={`/my-account-orders`}
              style={{
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              {t("account.order")}
            </Link>
            , {t("account.manage")}{" "}
            <Link
              className="text_primary"
              href={`/my-account-address`}
              style={{
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              {t("account.shipping")}
            </Link>
            , {t("account.and")}{" "}
            <Link
              className="text_primary"
              href={`/my-account-edit`}
              style={{
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              {t("account.edit")}
            </Link>
            .
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
