"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { useSnackbar } from "@/components/util/SnackbarContext";
import { format } from "date-fns";

export default function AccountEdit() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useTranslation();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { showSnackbar } = useSnackbar();

  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    tax_id: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const storedUserData = localStorage.getItem("user_data");
      const token = localStorage.getItem("access_token");

      if (!storedUserData || !token) {
        router.push("/login");
        return;
      }

      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);

      // Populate form with user data
      setProfileForm({
        first_name: parsedUserData.first_name || "",
        last_name: parsedUserData.last_name || "",
        email: parsedUserData.email || "",
        phone: parsedUserData.phone || "",
        company_name: parsedUserData.company_name || "",
        tax_id: parsedUserData.tax_id || "",
      });
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user information");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!userData) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/users/${userData.user_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileForm),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();

      // Update localStorage with new user data (รวม company_name + tax_id)
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUserData(updatedUser);

      // setSuccess(t("account.updatesuccess"));
      showSnackbar(t("account.updatesuccess"), "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      // setError(error.message || "Failed to update profile");
      showSnackbar(t("Fail Saved"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!userData) return;

    if (
      !passwordForm.current_password ||
      !passwordForm.new_password ||
      !passwordForm.confirm_password
    ) {
      // setError("All password fields are required");
      showSnackbar(t("All password fields are required"), "error");
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      // setError(t("account.passwordnotmatch"));
      showSnackbar(t("account.passwordnotmatch"), "error");
      return;
    }

    if (passwordForm.new_password.length < 6) {
      // setError(t("account.newpasswordmustbeatleast"));
      showSnackbar(t("account.newpasswordmustbeatleast"), "error");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/users/change-password/${userData.user_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: passwordForm.current_password,
            newPassword: passwordForm.new_password,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
          return;
        }
        const errorData = await response.json();

        if (
          errorData.message?.toLowerCase().includes("incorrect") ||
          errorData.message?.toLowerCase().includes("invalid")
        ) {
          // setError(t("account.oldpasswordincorrect"));
          showSnackbar(t("account.oldpasswordincorrect"), "error");
          return;
        }

        throw new Error(errorData.message || "Failed to change password");
      }

      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      // setSuccess(t("account.PasswordChange"));
            showSnackbar(t("account.PasswordChange"), "success");

    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="my-account-content account-edit">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="text-center">
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #32cd32",
                borderTop: "4px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <p>{t("edit.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  const isCompanyCustomer =
    userData?.type_name === "company_customer" || userData?.user_type_id === 3;

  return (
    <div className="my-account-content account-edit">
      <div className="">
        {/* Success/Error Messages */}
        {error && (
          <div
            className="alert alert-danger mb-3"
            style={{
              padding: "12px",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "8px",
              color: "#721c24",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="alert alert-success mb-3"
            style={{
              padding: "12px",
              backgroundColor: "#d4edda",
              border: "1px solid #c3e6cb",
              borderRadius: "8px",
              color: "#155724",
            }}
          >
            {success}
          </div>
        )}

        {/* Profile Information Form */}
        <form onSubmit={handleProfileSubmit} className="mb-5">
          <h5 className="mb-4">{t("edit.ProfileInformation")}</h5>

          <div className="row">
            <div className="col-md-6">
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={handleProfileChange}
                  required
                  disabled={isSubmitting}
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="first_name"
                >
                  {t("edit.FirstName")}
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={handleProfileChange}
                  required
                  disabled={isSubmitting}
                />
                <label
                  className="tf-field-label fw-4 text_black-2"
                  htmlFor="last_name"
                >
                  {t("edit.LastName")}
                </label>
              </div>
            </div>
          </div>

          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="email"
              id="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              required
              disabled={isSubmitting}
            />
            <label className="tf-field-label fw-4 text_black-2" htmlFor="email">
              {t("edit.Email")}
            </label>
          </div>

          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="tel"
              id="phone"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
              disabled={isSubmitting}
            />
            <label className="tf-field-label fw-4 text_black-2" htmlFor="phone">
              {t("edit.Phone")}
            </label>
          </div>

          {/* เฉพาะลูกค้าที่เป็นบริษัท */}
          {isCompanyCustomer && (
            <div className="row">
              <div className="col-md-6">
                <div className="tf-field style-1 mb_15">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={profileForm.company_name}
                    onChange={handleProfileChange}
                    disabled={isSubmitting}
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="company_name"
                  >
                    {t("edit.CompanyName")}
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="tf-field style-1 mb_15">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="text"
                    id="tax_id"
                    name="tax_id"
                    value={profileForm.tax_id}
                    onChange={handleProfileChange}
                    disabled={isSubmitting}
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="tax_id"
                  >
                    {t("edit.TaxID")}
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="mb_20">

            <Button
              type="submit"
              sx={{ textTransform: "none" }}
              fullWidth
              color="primary"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("edit.UpdatingProfile")
                : t("edit.UpdateProfile")}
            </Button>
          </div>
        </form>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordSubmit} className="">
          <h6 className="mb_20">{t("edit.PasswordChange")}</h6>

          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="current_password"
              name="current_password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="current_password"
            >
              {t("edit.CurrentPassword")}
            </label>
          </div>

          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="new_password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="new_password"
            >
              {t("edit.NewPassword")}
            </label>
          </div>

          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="confirm_password"
            >
              {t("edit.ConfirmNewPassword")}
            </label>
          </div>

          <div className="mb_20">

            <Button
              type="submit"
              sx={{ textTransform: "none" }}
              fullWidth
              color="primary"
              variant="contained"
              disabled={
                isSubmitting ||
                !passwordForm.current_password ||
                !passwordForm.new_password ||
                !passwordForm.confirm_password
              }
            >
              {isSubmitting
                ? t("edit.ChangingPassword")
                : t("edit.ChangePassword")}
            </Button>
          </div>
        </form>

        {/* User Information Display */}
        {userData && (
          <div
            className="user-info-display mt-4 p-3"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <h6 className="mb-3">{t("edit.AccountInformation")}</h6>
            <div className="row">
              <div className="col-md-6">
                <small className="text-muted">{t("edit.Email")}:</small>
                <div className="fw-6">{userData.email}</div>
              </div>
              <div className="col-md-6">
                <small className="text-muted">{t("edit.UserName")}:</small>
                <div className="fw-6">{userData.username}</div>
              </div>

              <div className="col-md-6 mt-2">
                <small className="text-muted">{t("edit.AccountStatus")}:</small>
                <div>
                  <span
                    style={{
                      backgroundColor:
                        userData.is_active === 1 ? "#28a745" : "#dc3545",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  >
                    {userData.is_active === 1
                      ? t("edit.Active")
                      : t("edit.Inactive")}
                  </span>
                </div>
              </div>

              <div className="col-md-6 mt-2">
                <small className="text-muted">{t("edit.MemberSince")}:</small>
                <div className="fw-6">
                  {format(new Date(userData.created_at), 'dd-MM-yyyy : HH:mm:ss')}
                </div>
              </div>

              {isCompanyCustomer &&
                (userData.company_name || userData.tax_id) && (
                  <>
                    <div className="col-md-6 mt-2">
                      <small className="text-muted">
                        {t("edit.CompanyName")}:
                      </small>
                      <div className="fw-6">{userData.company_name || "-"}</div>
                    </div>
                    <div className="col-md-6 mt-2">
                      <small className="text-muted">{t("edit.TaxID")}:</small>
                      <div className="fw-6">{userData.tax_id || "-"}</div>
                    </div>
                  </>
                )}
            </div>
          </div>
        )}
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

        .tf-field-input:disabled {
          background-color: #f8f9fa;
          opacity: 0.7;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .row {
            margin: 0;
          }
          .col-md-6 {
            padding: 0;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
}
