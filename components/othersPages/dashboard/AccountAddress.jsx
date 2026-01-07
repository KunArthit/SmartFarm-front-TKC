"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Box, Typography, Button, Alert } from "@mui/material";
import { Close, Warning, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import {
  PlusIcon,
  MapPinIcon,
  CreditCardIcon,
  PackageIcon,
  StarIcon,
  EditIcon,
  TrashIcon,
  AlertTriangleIcon,
  XIcon,
  MailboxIcon,
} from "lucide-react";
import { useSnackbar } from "@/components/util/SnackbarContext";

export default function AccountAddress() {
  const router = useRouter();
  const [activeEdit, setActiveEdit] = useState(false);
  const [activeAdd, setActiveAdd] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    addressId: null,
    addressInfo: "",
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // Form states
  const [newAddressForm, setNewAddressForm] = useState({
    address_type: "billing",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Thailand",
    is_default: false,
  });

  const [editAddressForm, setEditAddressForm] = useState({
    address_type: "billing",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Thailand",
    is_default: false,
  });

  useEffect(() => {
    loadUserAndAddresses();
  }, []);

  const loadUserAndAddresses = async () => {
    try {
      const storedUserData = localStorage.getItem("user_data");
      const token = localStorage.getItem("access_token");

      if (!storedUserData || !token) {
        router.push("/login");
        return;
      }

      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);

      await fetchAddresses(parsedUserData.user_id, token);
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user information");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async (userId, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user-address/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const addressesData = await response.json();
      // console.log("Addresses loaded:", addressesData);
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError(t("address.Failtoload"));
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    if (!userData) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/user-address/user/${userData.user_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddressForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add address");
      }

      // const newAddress = await response.json();
      // console.log("New address added:", newAddress);

      // Refresh addresses
      await fetchAddresses(userData.user_id, token);

      // Reset form and close
      setNewAddressForm({
        address_type: "billing",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "Thailand",
        is_default: false,
      });
      setActiveEdit(false);
      showSnackbar(t("account.addressadded"), "success");
    } catch (error) {
      console.error("Error adding address:", error);
      setError(error.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setEditAddressForm({
      user_id: userData.user_id || null,
      address_type: address.address_type || "billing",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "Thailand",
      is_default: !!address.is_default || false,
    });
    setActiveAdd(true);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    if (!userData || !editingAddress) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/user-address/${editingAddress.address_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editAddressForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update address");
      }

      // Refresh addresses
      await fetchAddresses(userData.user_id, token);

      // Reset form and close
      setEditingAddress(null);
      setActiveAdd(false);
      showSnackbar(t("address.Addressupdate"), "success");
    } catch (error) {
      console.error("Error updating address:", error);
      setError(error.message || "Failed to update address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/user-address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete address");
      }

      // Refresh addresses
      await fetchAddresses(userData.user_id, token);
      showSnackbar(t("account.addressdeleted"), "success");
    } catch (error) {
      console.error("Error deleting address:", error);
      setError(error.message || "Failed to delete address");
    }
  };

  const confirmDeleteAddress = (address) => {
    setDeleteModal({
      open: true,
      addressId: address.address_id,
      addressInfo: `${address.address_line1}, ${address.city}`,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.addressId) {
      handleDeleteAddress(deleteModal.addressId);
      setDeleteModal({ open: false, addressId: null, addressInfo: "" });
    }
  };

  const getAddressTypeLabel = (type) => {
    const types = {
      billing: t("address.Billing"),
      shipping: t("address.Shipping"),
    };
    return types[type] || type;
  };

  const getAddressTypeIcon = (type) => {
    const iconProps = { size: 18, className: "type-icon-svg" };
    const icons = {
      billing: <CreditCardIcon {...iconProps} />,
      shipping: <PackageIcon {...iconProps} />,
    };
    return icons[type] || <MapPinIcon {...iconProps} />;
  };

  const formatAddress = (address) => {
    const parts = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state,
      address.postal_code,
      address.country,
    ].filter(Boolean);

    return parts.join(", ");
  };

  if (loading) {
    return (
      <div className="my-account-content account-address">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>{t("address.Loadingyouraddresses")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-address">
      <div className="address-manager">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-content">
            <h4 className="page-title">{t("address.myaddress")}</h4>
            <p className="page-subtitle">{t("address.deliveryaddress")}</p>
          </div>
          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            color="primary"
            onClick={() => setActiveEdit(true)}
            disabled={isSubmitting}
          >
            <PlusIcon size={18} />
            {t("address.AddNewAddress")}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <AlertTriangleIcon size={20} className="alert-icon" />
            <span className="alert-text">{error}</span>
            <button className="alert-close" onClick={() => setError("")}>
              <XIcon size={16} />
            </button>
          </div>
        )}

        {/* Add New Address Form */}
        {activeEdit && (
          <div className="address-form-container">
            <div
              className="form-overlay"
              onClick={() => setActiveEdit(false)}
            />

            <div
              className="address-form"
              style={{
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <form
                onSubmit={handleAddNewAddress}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <div className="form-header" style={{ flexShrink: 0 }}>
                  <div className="form-header-content">
                    <PlusIcon size={20} />
                    <h5>{t("address.AddNewAddress")}</h5>
                  </div>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setActiveEdit(false)}
                  >
                    <XIcon size={18} />
                  </button>
                </div>

                <div
                  className="form-body"
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "15px",
                    minHeight: 0,
                  }}
                >
                  <div className="form-group">
                    <label>{t("address.AddressType")}</label>
                    <select
                      name="address_type"
                      value={newAddressForm.address_type}
                      onChange={handleNewAddressChange}
                      className="form-select"
                      required
                    >
                      <option value="billing">
                        {t("address.BillingAddress")}
                      </option>
                      <option value="shipping">
                        {t("address.ShippingAddress")}
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t("address.AddressLine1")} *</label>
                    <input
                      type="text"
                      name="address_line1"
                      value={newAddressForm.address_line1}
                      onChange={handleNewAddressChange}
                      className="form-input"
                      placeholder={t("address.StreedAddress")}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("address.AddressLine2")}</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={newAddressForm.address_line2}
                      onChange={handleNewAddressChange}
                      className="form-input"
                      placeholder={t("address.Apartment")}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t("address.City")} *</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddressForm.city}
                        onChange={handleNewAddressChange}
                        className="form-input"
                        placeholder={t("address.City")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("address.State")} *</label>
                      <input
                        type="text"
                        name="state"
                        value={newAddressForm.state}
                        onChange={handleNewAddressChange}
                        className="form-input"
                        placeholder={t("address.State2")}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t("address.PostalCode")} *</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={newAddressForm.postal_code}
                        onChange={handleNewAddressChange}
                        className="form-input"
                        placeholder={t("address.PostalCode2")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("address.Country")} *</label>
                      <input
                        type="text"
                        name="country"
                        value={newAddressForm.country}
                        onChange={handleNewAddressChange}
                        className="form-input"
                        placeholder={t("address.Country")}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label
                      className="checkbox-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={newAddressForm.is_default}
                        onChange={handleNewAddressChange}
                        className="form-checkbox"
                      />
                      <span className="checkmark"></span>
                      {t("address.Setasdefaultaddress")}
                    </label>
                  </div>
                </div>

                <div
                  className="form-footer"
                  style={{
                    flexShrink: 0,
                    padding: "15px",
                    borderTop: "1px solid #eee",
                    backgroundColor: "#fff",
                  }}
                >
                  <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => setActiveEdit(false)}
                    disabled={isSubmitting}
                  >
                    {t("address.Cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    sx={{ textTransform: "none", marginLeft: "10px" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="btn-spinner" />
                        {t("address.Adding")}
                      </>
                    ) : (
                      t("confirm")
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Address Form */}
        {activeAdd && editingAddress && (
          <div className="address-form-container">
            <div
              className="form-overlay"
              onClick={() => {
                setActiveAdd(false);
                setEditingAddress(null);
              }}
            />
            <div
              className="address-form"
              style={{
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <form
                onSubmit={handleUpdateAddress}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <div className="form-header" style={{ flexShrink: 0 }}>
                  <div className="form-header-content">
                    <EditIcon size={20} />
                    <h5>{t("address.EditAddress")}</h5>
                  </div>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => {
                      setActiveAdd(false);
                      setEditingAddress(null);
                    }}
                  >
                    <XIcon size={18} />
                  </button>
                </div>

                <div
                  className="form-body"
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "15px",
                    minHeight: 0,
                  }}
                >
                  <div className="form-group">
                    <label>{t("address.AddressType")}</label>
                    <select
                      name="address_type"
                      value={editAddressForm.address_type}
                      onChange={handleEditAddressChange}
                      className="form-select"
                      required
                    >
                      <option value="billing">
                        {t("address.BillingAddress")}
                      </option>
                      <option value="shipping">
                        {t("address.ShippingAddress")}
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t("address.AddressLine1")} *</label>
                    <input
                      type="text"
                      name="address_line1"
                      value={editAddressForm.address_line1}
                      onChange={handleEditAddressChange}
                      className="form-input"
                      placeholder={t("address.StreedAddress")}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("address.AddressLine2")}</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={editAddressForm.address_line2}
                      onChange={handleEditAddressChange}
                      className="form-input"
                      placeholder={t("address.Apartment")}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t("address.City")} *</label>
                      <input
                        type="text"
                        name="city"
                        value={editAddressForm.city}
                        onChange={handleEditAddressChange}
                        className="form-input"
                        placeholder={t("address.City")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("address.State")} *</label>
                      <input
                        type="text"
                        name="state"
                        value={editAddressForm.state}
                        onChange={handleEditAddressChange}
                        className="form-input"
                        placeholder={t("address.State2")}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t("address.PostalCode")} *</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={editAddressForm.postal_code}
                        onChange={handleEditAddressChange}
                        className="form-input"
                        placeholder={t("address.PostalCode2")}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("address.Country")} *</label>
                      <input
                        type="text"
                        name="country"
                        value={editAddressForm.country}
                        onChange={handleEditAddressChange}
                        className="form-input"
                        placeholder={t("address.Country")}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label
                      className="checkbox-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {/* Note: เช็คตรงนี้ด้วยนะครับ ตรงนี้ใช้ newAddressForm ซึ่งอาจจะผิด (ควรเป็น editAddressForm หรือเปล่า?) */}
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={newAddressForm.is_default}
                        onChange={handleNewAddressChange}
                        className="form-checkbox"
                      />
                      <span className="checkmark"></span>
                      {t("address.Setasdefaultaddress")}
                    </label>
                  </div>
                </div>

                <div
                  className="form-footer"
                  style={{
                    flexShrink: 0,
                    padding: "15px",
                    borderTop: "1px solid #eee",
                    backgroundColor: "#fff",
                  }}
                >
                  <Button
                    type="button"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setActiveAdd(false);
                      setEditingAddress(null);
                    }}
                    disabled={isSubmitting}
                  >
                    {t("address.Cancel")}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "none" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="btn-spinner" />
                        {t("address.Updating")}
                      </>
                    ) : (
                      t("address.UpdateAddress")
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteModal.open}
          onClose={() =>
            setDeleteModal({ open: false, addressId: null, addressInfo: "" })
          }
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 450 },
              bgcolor: "background.paper",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
              p: 0,
              outline: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderBottom: "1px solid #f0f0f0",
                background: "linear-gradient(135deg, #ffeaea, #fff0f0)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Warning sx={{ color: "#e74c3c", fontSize: 28 }} />
                <Typography
                  id="delete-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{
                    margin: 0,
                    fontWeight: 600,
                    color: "#2c3e50",
                    fontSize: "18px",
                  }}
                >
                  {t("account.confirmdelete")}
                </Typography>
              </Box>
              <Button
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    addressId: null,
                    addressInfo: "",
                  })
                }
                sx={{
                  minWidth: "auto",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  color: "#7f8c8d",
                  "&:hover": {
                    backgroundColor: "#e74c3c",
                    color: "white",
                  },
                }}
              >
                <Close />
              </Button>
            </Box>

            <Box sx={{ p: 3 }}>
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  "& .MuiAlert-icon": {
                    fontSize: "24px",
                  },
                }}
              >
                <Typography
                  id="delete-modal-description"
                  sx={{
                    color: "#2c3e50",
                    fontSize: "15px",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("account.areyousure")}
                </Typography>
                <Typography
                  sx={{
                    color: "#e74c3c",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {deleteModal.addressInfo}
                </Typography>
              </Alert>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  sx={{ textTransform: "none" }}
                  onClick={() =>
                    setDeleteModal({
                      open: false,
                      addressId: null,
                      addressInfo: "",
                    })
                  }
                >
                  {t("account.cancel")}
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  sx={{ textTransform: "none" }}
                  color="error"
                  variant="contained"
                  startIcon={<Delete />}
                >
                  {t("account.delete")}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* Addresses List */}
        <div className="addresses-grid">
          {addresses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MailboxIcon size={64} />
              </div>
              <h6>{t("address.Noaddressesyet")}</h6>
              <p>{t("address.Addyourfirstaddress")}</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.address_id}
                className={`address-card ${
                  !!address.is_default ? "default" : ""
                }`}
              >
                {!!address.is_default && (
                  <div className="default-badge">
                    <StarIcon size={14} />
                    {t("address.Default")}
                  </div>
                )}
                <div className="address-header">
                  <div className="address-type">
                    {getAddressTypeIcon(address.address_type)}
                    <span className="type-label">
                      {getAddressTypeLabel(address.address_type)}
                    </span>
                  </div>
                </div>

                <div className="address-content">
                  <div className="address-text">
                    <div className="address-line">{address.address_line1}</div>
                    {address.address_line2 && (
                      <div className="address-line">
                        {address.address_line2}
                      </div>
                    )}
                    <div className="address-line">
                      {address.city}, {address.state} {address.postal_code}
                    </div>
                    <div className="address-line country">
                      {address.country}
                    </div>
                  </div>
                </div>

                <div className="address-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEditAddress(address)}
                    disabled={isSubmitting}
                  >
                    <EditIcon size={16} />
                    {t("address.Edit")}
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => confirmDeleteAddress(address)}
                    disabled={isSubmitting}
                  >
                    <TrashIcon size={16} />
                    {t("address.Delete")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .my-account-content {
          padding: 0;
        }

        .address-manager {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Header Section */
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .header-content {
          flex: 1;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          color: #7f8c8d;
          margin: 0;
          font-size: 16px;
        }

        .add-address-btn {
          background: #3498db;
          color: white;
          border: 1px solid #3498db;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-address-btn:hover {
          background: #2980b9;
          border-color: #2980b9;
        }

        .btn-icon {
          font-size: 18px;
          font-weight: bold;
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Alert */
        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          position: relative;
        }

        .alert-error {
          border: 1px solid #fcc;
          color: #c33;
        }

        .alert-icon {
          color: #c33;
          flex-shrink: 0;
        }

        .alert-text {
          flex: 1;
        }

        .alert-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #c33;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Form Container */
        .address-form-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .form-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .address-form {
          position: relative;
          background: white;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }

        .form-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .form-header h5 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #7f8c8d;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #e74c3c;
          color: white;
        }

        .form-body {
          padding: 20px 24px;
          overflow-y: auto;
          flex: 1;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #3498db;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .form-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 20px 24px;
          border-top: 1px solid #f0f0f0;
          flex-shrink: 0;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .btn-cancel {
          background: transparent;
          color: #6c757d;
          border: 1px solid #dee2e6;
        }

        .btn-cancel:hover {
          background: #f8f9fa;
        }

        .btn-primary {
          background: #28a745;
          color: white;
          border: 1px solid #28a745;
        }

        .btn-primary:hover {
          background: #218838;
          border-color: #218838;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Addresses Grid */
        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-top: 30px;
        }

        .address-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 24px;
          transition: all 0.3s ease;
          position: relative;
        }

        .address-card:hover {
          border-color: #3498db;
        }

        .address-card.default {
          border-color: #f39c12;
        }

        .default-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f39c12;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .address-header {
          margin-bottom: 16px;
        }

        .address-type {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .type-icon-svg {
          color: #3498db;
          flex-shrink: 0;
        }

        .type-label {
          font-weight: 600;
          font-size: 16px;
          color: #2c3e50;
          text-transform: capitalize;
        }

        .address-content {
          margin-bottom: 20px;
        }

        .address-text {
          line-height: 1.6;
        }

        .address-line {
          color: #5a6c7d;
          margin-bottom: 4px;
          font-size: 15px;
        }

        .address-line:first-child {
          font-weight: 600;
          color: #2c3e50;
          font-size: 16px;
        }

        .country {
          font-weight: 600;
          color: #3498db;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .address-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }

        .btn-edit {
          background: #3498db;
          color: white;
          flex: 1;
          justify-content: center;
          border: 1px solid #3498db;
        }

        .btn-edit:hover {
          background: #2980b9;
          border-color: #2980b9;
        }

        .btn-delete {
          background: #e74c3c;
          color: white;
          flex: 1;
          justify-content: center;
          border: 1px solid #e74c3c;
        }

        .btn-delete:hover {
          background: #c0392b;
          border-color: #c0392b;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          border-radius: 8px;
          border: 1px dashed #dee2e6;
        }

        .empty-icon {
          margin-bottom: 20px;
          opacity: 0.7;
          color: #94a3b8;
        }

        .empty-state h6 {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 12px;
        }

        .empty-state p {
          color: #7f8c8d;
          margin-bottom: 24px;
          font-size: 16px;
        }

        /* Animations */
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .address-card {
          animation: fadeIn 0.5s ease-out;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .address-manager {
            padding: 16px;
          }

          .header-section {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .page-title {
            font-size: 24px;
          }

          .addresses-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .address-form {
            margin: 10px;
            max-height: 95vh;
            max-width: calc(100vw - 20px);
          }

          .form-body {
            padding: 16px 20px;
          }

          .form-header {
            padding: 16px 20px;
          }

          .form-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .address-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .address-manager {
            padding: 12px;
          }

          .page-title {
            font-size: 20px;
          }

          .address-card {
            padding: 20px;
          }

          .address-form {
            max-width: calc(100vw - 20px);
            margin: 10px;
          }

          .form-header h5 {
            font-size: 16px;
          }

          .form-body {
            padding: 16px;
          }

          .form-header,
          .form-footer {
            padding: 16px;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .address-card {
            border-width: 3px;
          }

          .btn {
            border: 2px solid currentColor;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Print styles */
        @media print {
          .add-address-btn,
          .address-actions,
          .form-overlay,
          .address-form-container {
            display: none !important;
          }

          .address-card {
            break-inside: avoid;
            box-shadow: none;
            border: 1px solid #000;
          }
        }
      `}</style>
    </div>
  );
}
