"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Newspaper,
  TruckElectric,
  Star,
  CreditCard,
  Smartphone,
  Banknote,
  Shield,
  Lock,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
} from "lucide-react";
import { Button } from "@mui/material";
import { useSnackbar } from "../util/SnackbarContext";

export default function Checkout() {
  const { cartProducts, setCartProducts, clearCartAfterOrder, totalPrice } =
    useContextElement();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [stockCheckLoading, setStockCheckLoading] = useState(false);
  const [stockValidation, setStockValidation] = useState({});
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  // Enhanced Add Address Modal States
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    address_type: "shipping",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Thailand",
    is_default: false,
  });

  // Enhanced Billing Address States
  const [useSameAsBilling, setUseSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState(null);

  // Separate addresses by type
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    province: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    note: "",
  });
  const [agreeChecked, setAgreeChecked] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const FRONT_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

  // Calculate total price from cart products
  const calculatedTotal = cartProducts.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  // Calculate shipping cost (you can implement your own logic)
  const shippingCost = calculatedTotal > 1000 ? 0 : 50; // Free shipping over 1000 THB
  const taxAmount = calculatedTotal * 0.07; // 7% VAT
  const subtotal = calculatedTotal;
  const finalTotal = subtotal + shippingCost + taxAmount;

  // Load user data from localStorage and fetch addresses
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("user_data");

      // console.log("Loading user data from localStorage:", storedUserData);
      if (storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          setUserData(user);

          // Pre-fill user info
          setFormData((prev) => ({
            ...prev,
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
          }));

          // Fetch user addresses using the correct API
          if (user.user_id) {
            fetchUserAddresses(user.user_id);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (cartProducts.length > 0) {
      checkStockAvailability().catch((error) => {
        console.warn(
          "Stock check failed, but allowing order to continue:",
          error
        );
      });
    }
  }, [cartProducts]);

  useEffect(() => {
    const cameFrom2c2p = searchParams.get("2c2p_status");
    if (cameFrom2c2p === "true") {
      setPaymentMethod("credit_card");
      // console.log(
      //   "Default payment method set to Credit Card from URL parameter."
      // );
    }
  }, [searchParams]); // ให้ effect นี้ทำงานเมื่อ searchParams พร้อมใช้งาน

  // Enhanced fetchUserAddresses to separate by type
  const fetchUserAddresses = async (userId) => {
    setAddressLoading(true);
    try {
      const token = localStorage.getItem("access_token");
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

      if (response.ok) {
        const addressData = await response.json();
        // console.log("Fetched addresses:", addressData);

        // Ensure we have an array
        const addresses = Array.isArray(addressData)
          ? addressData
          : [addressData];
        setUserAddresses(addresses);

        // Separate addresses by type
        const shipping = addresses.filter(
          (addr) => addr.address_type === "shipping"
        );
        const billing = addresses.filter(
          (addr) => addr.address_type === "billing"
        );

        setShippingAddresses(shipping);
        setBillingAddresses(billing);

        // Auto-select default shipping address or first shipping address
        if (shipping.length > 0) {
          const defaultShippingAddress =
            shipping.find((addr) => addr.is_default === 1) || shipping[0];
          selectShippingAddress(defaultShippingAddress);
        }

        // Auto-select default billing address if not using same as shipping
        if (!useSameAsBilling && billing.length > 0) {
          const defaultBillingAddress =
            billing.find((addr) => addr.is_default === 1) || billing[0];
          setBillingAddress(defaultBillingAddress);
        }
      } else {
        console.error("Failed to fetch addresses:", response.status);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setAddressLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Enhanced Add new address function
  const handleAddAddress = async () => {
    if (!userData?.user_id) {
      alert("Please login to add an address");
      return;
    }

    // Validation
    if (
      !newAddressData.address_line1 ||
      !newAddressData.city ||
      !newAddressData.state ||
      !newAddressData.postal_code
    ) {
      showSnackbar(
        t(
          "Please fill in all required address fields (Address Line 1, City, Province, Postal Code)"
        ),
        "error"
      );
      return;
    }

    setAddingAddress(true);
    try {
      const token = localStorage.getItem("access_token");
      const addressPayload = {
        user_id: userData.user_id,
        address_type: newAddressData.address_type,
        address_line1: newAddressData.address_line1,
        address_line2: newAddressData.address_line2,
        city: newAddressData.city,
        state: newAddressData.state,
        postal_code: newAddressData.postal_code,
        country: newAddressData.country,
        is_default:
          newAddressData.is_default ||
          (newAddressData.address_type === "shipping"
            ? shippingAddresses.length === 0
            : billingAddresses.length === 0),
      };

      // console.log("Adding new address:", addressPayload);

      const response = await fetch(`${API_BASE_URL}/user-address/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressPayload),
      });

      let result;
      const responseText = await response.text();
      // console.log("Raw response:", responseText);

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
        throw new Error(`Invalid response format: ${responseText}`);
      }

      if (response.ok && (result.success || result.address_id)) {
        // console.log("Address added successfully:", result);

        // Refresh addresses list
        await fetchUserAddresses(userData.user_id);

        // Close modal and reset form
        setShowAddAddressModal(false);
        setNewAddressData({
          address_type: "shipping",
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "Thailand",
          is_default: false,
        });

        // Auto-select the newly added address if it's the first one or default
        setTimeout(() => {
          if (result.address_id || result.address) {
            const newAddressId =
              result.address_id || result.address?.address_id;
            const newAddress = userAddresses.find(
              (addr) => addr.address_id === newAddressId
            );

            if (newAddress) {
              if (newAddress.address_type === t("address.Shipping")) {
                selectShippingAddress(newAddress);
              } else if (newAddress.address_type === t("address.Billing")) {
                setBillingAddress(newAddress);
              }
            }
          }
        }, 1000);

        // alert(t("address.Addressaddedsuccessfully"));
        showSnackbar(t("address.Addressaddedsuccessfully"), "success");
      } else {
        console.error("❌ API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          result: result,
        });
        throw new Error(
          result.message ||
            result.error ||
            `Server error: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("❌ Error adding address:", error);

      let errorMessage = "Failed to add address. ";

      if (error.message.includes("fetch")) {
        errorMessage +=
          "Network connection issue. Please check your internet connection.";
      } else if (error.message.includes("401")) {
        errorMessage += "Authentication failed. Please login again.";
      } else if (error.message.includes("403")) {
        errorMessage +=
          "Permission denied. You may not have access to add addresses.";
      } else if (error.message.includes("400")) {
        errorMessage +=
          "Invalid data sent to server. Please check all required fields.";
      } else if (error.message.includes("500")) {
        errorMessage += "Server error. Please try again later.";
      } else {
        errorMessage += error.message;
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      setAddingAddress(false);
    }
  };

  // 🆕 Handle new address input changes
  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const checkStockAvailability = async () => {
    if (cartProducts.length === 0) return;
    setStockCheckLoading(true);

    try {
      // ✅ ใช้ product_id เท่านั้น
      const productIds = cartProducts
        .map((item) => item.product_id) // ← ใช้ product_id โดยตรง
        .filter(Boolean) // กรองค่า null/undefined ออก
        .join(",");

      // console.log("Checking stock for product IDs:", productIds);
      // console.log(
      //   "Cart products:",
      //   cartProducts.map((item) => ({
      //     cartId: item.id,
      //     productId: item.product_id,
      //     name: item.name,
      //   }))
      // );

      if (!productIds) {
        console.warn("⚠️ No valid product IDs found for stock check");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/payment/stock/check?product_ids=${productIds}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const stockData = await response.json();
        // console.log("Stock check result:", stockData);

        if (stockData.success && stockData.stock_info) {
          const stockMap = {};
          let hasStockIssues = false;

          stockData.stock_info.forEach((item) => {
            if (!item.error) {
              // ✅ ใช้ product_id ในการหา cart item
              const cartItem = cartProducts.find(
                (p) => p.product_id === item.product_id // ← ใช้ product_id เปรียบเทียบ
              );

              const hasInsufficientStock =
                cartItem && item.stock_quantity < cartItem.quantity;

              stockMap[item.product_id] = {
                available: item.stock_quantity,
                requested: cartItem?.quantity || 0,
                sufficient: !hasInsufficientStock,
                product_name: item.product_name,
                sku: item.sku,
                is_active: item.is_active,
              };

              if (hasInsufficientStock || !item.is_active) {
                hasStockIssues = true;
              }
            }
          });

          setStockValidation(stockMap);

          // if (hasStockIssues) {
          //   console.warn(t("checkout.stockissues"));
          // } else {
          //   // console.log(t("checkout.allproduct"));
          //   console.warn(t("checkout.allproduct"));
          // }
        }
      } else {
        console.error("Failed to check stock availability, but continuing...");
      }
    } catch (error) {
      console.error("Stock check error (continuing anyway):", error);
    } finally {
      setStockCheckLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `INV-${timestamp}-${random}`;
  };

  const validateOrderData = () => {
    // Basic validation
    if (cartProducts.length === 0) {
      throw new Error(
        "Your cart is empty. Please add items to your cart before checkout."
      );
    }

    // Payment method validation
    if (!paymentMethod) {
      throw new Error("Please select a payment method.");
    }

    // Stock validation for all online payments
    const stockIssues = [];
    Object.entries(stockValidation).forEach(([productId, stock]) => {
      if (!stock.sufficient) {
        stockIssues.push(
          `${stock.product_name}: Available ${stock.available}, Requested ${stock.requested}`
        );
      }
      if (!stock.is_active) {
        stockIssues.push(`${stock.product_name}: Product is no longer active`);
      }
    });

    if (stockIssues.length > 0) {
      throw new Error(`Stock validation failed:\n${stockIssues.join("\n")}`);
    }

    // Address validation
    if (
      !selectedAddress &&
      (!formData.address || !formData.city || !formData.province)
    ) {
      throw new Error(
        "Please select a shipping address or fill in the address information."
      );
    }

    // Billing address validation
    if (!useSameAsBilling && !billingAddress) {
      throw new Error(
        "Please select a billing address or use the same address as shipping."
      );
    }

    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone
    ) {
      throw new Error("Please fill in all required billing information.");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error("Please enter a valid email address.");
    }

    // Phone validation (basic)
    if (formData.phone.length < 10) {
      throw new Error("Please enter a valid phone number.");
    }

    return true;
  };

  const mapPaymentMethodToDB = (method) => {
    const methodMap = {
      credit_card: "2c2p",
      qr_code: "2c2p",
      bank_transfer_manual: "manual",
    };

    // console.log(`Mapping payment method: ${method} -> ${methodMap[method]}`);
    return methodMap[method] || "manual";
  };

  const handlePayment = async (invoiceNo) => {
    try {
      // console.log(
      //   `Processing ${paymentMethod} payment for invoice ${invoiceNo}`
      // );

      // Set payment channels based on selected method
      let paymentChannels;
      if (paymentMethod === "credit_card") {
        paymentChannels = ["CC"];
      } else if (paymentMethod === "qr_code") {
        paymentChannels = ["PPQR"];
      }

      // Prepare the main payload to send to your backend
      const basePayload = {
        invoiceNo: invoiceNo,
        amount: parseFloat(finalTotal.toFixed(2)),
        currency: "THB",
        description: `Order #${invoiceNo} - ${cartProducts.length} item(s)`,

        // ที่อยู่เต็ม = [API_BASE_URL] + [/api] + [/payment] + [/callback]
        frontendReturnUrl: `${API_BASE_URL}/payment/callback`,
        backendReturnUrl: `${API_BASE_URL}/payment/webhook/backend`,

        paymentChannel: paymentChannels,
      };

      // Add detailed order data if the user is logged in
      if (userData?.user_id || userData?.id) {
        const userId = userData.user_id || userData.id;

        basePayload.orderData = {
          user_id: parseInt(userId),
          customer_name: `${formData.firstName} ${formData.lastName}`,
          phone_number: formData.phone,
          is_bulk_order: false,
          bulk_order_type: "solution",
          shipping_address_id: selectedAddress?.address_id
            ? parseInt(selectedAddress.address_id)
            : null,
          billing_address_id: useSameAsBilling
            ? selectedAddress?.address_id
              ? parseInt(selectedAddress.address_id)
              : null
            : billingAddress?.address_id
            ? parseInt(billingAddress.address_id)
            : null,
          subtotal: parseFloat(subtotal.toFixed(2)),
          shipping_cost: parseFloat(shippingCost.toFixed(2)),
          tax_amount: parseFloat(taxAmount.toFixed(2)),
          notes: formData.note || "",
          items: cartProducts.map((item) => ({
            product_id: parseInt(item.product_id),
            quantity: parseInt(item.quantity),
            unit_price: parseFloat(item.price),
            subtotal: parseFloat((item.price * item.quantity).toFixed(2)),
          })),
        };
      }

      // console.log(
      //   "Payment token request payload:",
      //   JSON.stringify(basePayload, null, 2)
      // );

      // ที่อยู่เต็ม = [API_BASE_URL] + [/api] + [/payment] + [/token]
      const response = await fetch(`${API_BASE_URL}/payment/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basePayload),
      });

      const responseText = await response.text();
      // console.log("Raw API response:", responseText);

      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("❌ Failed to parse response as JSON:", parseError);
          throw new Error("Invalid response format from payment service");
        }
      }

      if (response.status === 422) {
        console.error("❌ 422 Validation Error in Payment:", data);
        let errorMessage = "Payment validation failed:\n";
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            errorMessage += `• ${field}: ${
              Array.isArray(messages) ? messages.join(", ") : messages
            }\n`;
          });
        } else if (data.message) {
          errorMessage = data.message;
        }
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        console.error("❌ Payment API Error Details:", response.status, data);
        throw new Error(
          data.message || `Payment processing failed (${response.status})`
        );
      }

      // console.log(" Payment token response:", data);

      if (!data.paymentToken || (!data.webPaymentUrl && !data.redirectUrl)) {
        throw new Error("Missing payment token or redirect URL from response");
      }

      // if (data.stockReserved) {
      //   console.log(
      //     `Order created successfully with ${data.itemsProcessed} items processed`
      //   );
      // }

      const paymentUrl = data.webPaymentUrl || data.redirectUrl;

      const orderInfo = {
        invoiceNo,
        orderId: data.orderId || null,
        amount: finalTotal,
        currency: "THB",
        paymentToken: data.paymentToken,
        paymentMethod: paymentMethod,
        paymentChannel: paymentChannels[0],
        orderStatus: data.orderStatus,
        stockReserved: data.stockReserved,
        items: cartProducts.map((item) => ({
          product_id: item.product_id,
          title: item.name || item.title,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
          image: item.image || item.imgSrc,
        })),
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        timestamp: new Date().toISOString(),
      };

      sessionStorage.setItem("pendingOrder", JSON.stringify(orderInfo));
      localStorage.setItem(`order_${invoiceNo}`, JSON.stringify(orderInfo));

      // console.log("Redirecting to 2C2P payment page:", paymentUrl);

      localStorage.setItem("cartBackup", JSON.stringify(cartProducts));

      const clearResult = await clearCartAfterOrder(data.orderId);

      if (clearResult.success) {
        // console.log("Cart cleared before redirect");
      } else {
        console.warn(
          "Cart clear failed, but continuing with payment:",
          clearResult.message
        );
      }

      window.location.href = paymentUrl;
    } catch (error) {
      console.error(`❌ Payment processing error:`, error);
      throw error;
    }
  };

  const addOrderItems = async (orderId, items) => {
    try {
      const orderItemsData = {
        items: items.map((item) => ({
          product_id: item.id || item.product_id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/order/${orderId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderItemsData),
      });

      if (response.ok) {
        console.log("Order items added successfully");
      } else {
        console.error("⚠️ Failed to add order items, but order was created");
      }
    } catch (error) {
      console.error("❌ Error adding order items:", error);
      throw error;
    }
  };

  // Main order handler - routes to appropriate payment method
  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // Re-check stock before placing order for all payments
      // console.log("Final stock validation before order...");
      await checkStockAvailability();

      // Validate order data (including stock for all payments)
      validateOrderData();

      const invoiceNo = generateInvoiceNumber();
      // console.log(
      //   `Processing order ${invoiceNo} with method: ${paymentMethod}`
      // );

      // Route to appropriate payment handler
      if (paymentMethod === "credit_card" || paymentMethod === "qr_code") {
        // Go directly to 2C2P payment (no confirmation)
        await handlePayment(invoiceNo);
      } else if (paymentMethod === "bank_transfer_manual") {
        await handleBankTransferManual(invoiceNo);
      } else {
        throw new Error("Please select a valid payment method");
      }
    } catch (error) {
      console.error("Order processing error:", error);

      // Restore cart if it was cleared
      const cartBackup = localStorage.getItem("cartBackup");
      if (cartBackup && cartProducts.length === 0) {
        try {
          setCartProducts(JSON.parse(cartBackup));
        } catch (e) {
          console.error("Failed to restore cart backup");
        }
      }

      // Show user-friendly error message
      let errorMessage =
        "An unexpected error occurred while processing your order.";

      if (error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to our servers. Please check your internet connection and try again.";
      } else if (error.message.includes("Stock validation failed")) {
        errorMessage = `Stock Validation Error:\n${error.message.replace(
          "Stock validation failed:",
          ""
        )}`;
      } else if (error.message.includes("Stock Error:")) {
        errorMessage = error.message;
      } else if (error.message.includes("Validation")) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransferManual = async (invoiceNo) => {
    try {
      // console.log(`Creating Bank Transfer order for invoice ${invoiceNo}`);

      const orderData = {
        invoice_no: invoiceNo,
        user_id: userData?.user_id || 0,
        order_status: "pending",
        is_bulk_order: false,
        bulk_order_type: "solution",
        payment_method: mapPaymentMethodToDB(paymentMethod),
        shipping_address_id: selectedAddress?.address_id || null,
        billing_address_id: useSameAsBilling
          ? selectedAddress?.address_id || null
          : billingAddress?.address_id || selectedAddress?.address_id || null,
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        tax_amount: parseFloat(taxAmount.toFixed(2)),
        total_amount: parseFloat(finalTotal.toFixed(2)),
        notes: `Bank Transfer Manual - Customer: ${formData.firstName} ${formData.lastName}`,
      };

      // console.log("Bank transfer order data:", orderData);
      // console.log(
      //   "Payment method mapping:",
      //   paymentMethod,
      //   "->",
      //   mapPaymentMethodToDB(paymentMethod)
      // );

      const response = await fetch(`${API_BASE_URL}/order/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(
          result.message || "Failed to create manual transfer order"
        );
      }

      // console.log("Bank Transfer Order created successfully:", result);

      // Add order items if the backend supports it
      if (result.order_id && cartProducts.length > 0) {
        try {
          await addOrderItems(result.order_id, cartProducts);
        } catch (itemsError) {
          console.error("⚠️ Failed to add order items:", itemsError);
        }
      }

      // Clear cart
      setCartProducts([]);
      localStorage.removeItem("cartBackup");

      // Store order info for bank transfer page
      const orderInfo = {
        invoiceNo,
        orderId: result.order_id,
        totalAmount: finalTotal,
        method: paymentMethod,
        status: orderData.order_status,
        items: cartProducts,
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
      };

      sessionStorage.setItem(
        "pendingBankTransferOrder",
        JSON.stringify(orderInfo)
      );

      // Show enhanced success message with better styling
      const showSuccessModal = () => {
        // Create modal backdrop
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop fade show";
        backdrop.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        // Create modal content
        const modal = document.createElement("div");
        modal.style.cssText = `
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          text-align: center;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        `;

        // Add animation keyframes
        const style = document.createElement("style");
        style.textContent = `
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `;
        document.head.appendChild(style);

        modal.innerHTML = `
          <div style="margin-bottom: 24px;">
            <div style="
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            ">
              <svg width="40" height="40" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 style="
              color: #1f2937;
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 12px;
              line-height: 1.2;
            ">Order Created Successfully!</h2>
            <div style="
              background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              font-weight: 600;
              font-size: 14px;
              margin-bottom: 20px;
              box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
            ">
              📄 Invoice #\${invoiceNo}
            </div>
          </div>
          
          <div style="
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;
            border-left: 4px solid #3b82f6;
          ">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <h3 style="margin: 0; color: #1e40af; font-size: 18px; font-weight: 600;">
                Next Step: Upload Bank Transfer Slip
              </h3>
            </div>
            <p style="
              margin: 0;
              color: #1e40af;
              font-size: 14px;
              line-height: 1.5;
            ">
              You'll be redirected to upload your payment slip.<br>
              We'll verify your payment and process your order quickly.
            </p>
          </div>
          
          <div style="
            display: flex;
            gap: 12px;
            justify-content: center;
          ">
            <button id="proceedBtn" style="
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              border: none;
              padding: 14px 28px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 8px;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
              transition: all 0.2s ease;
            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(59, 130, 246, 0.4)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
              Proceed to Upload
            </button>
          </div>
          
          <p style="
            margin: 16px 0 0;
            color: #6b7280;
            font-size: 12px;
          ">
            💡 Keep this page open until your payment is confirmed
          </p>
        `;

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Handle button click
        const proceedBtn = modal.querySelector("#proceedBtn");
        proceedBtn.addEventListener("click", () => {
          document.body.removeChild(backdrop);
          router.push(
            `/payment/banktransfer?orderId=${result.order_id}&invoiceNo=${invoiceNo}`
          );
        });

        // Auto redirect after 5 seconds
        setTimeout(() => {
          if (document.body.contains(backdrop)) {
            document.body.removeChild(backdrop);
            router.push(
              `/payment/banktransfer?orderId=${result.order_id}&invoiceNo=${invoiceNo}`
            );
          }
        }, 50000);
      };

      showSuccessModal();
    } catch (error) {
      console.error("❌ Error creating bank transfer order:", error);
      throw error;
    }
  };

  // 🆕 Enhanced selectShippingAddress function
  const selectShippingAddress = (address) => {
    setSelectedAddress(address);
    setFormData((prev) => ({
      ...prev,
      province: address.state || "",
      city: address.city || "",
      address: `${address.address_line1 || ""} ${
        address.address_line2 || ""
      }`.trim(),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStockStatus = (productId) => {
    // ✅ ใช้ product_id แทน cart item id
    const stock = stockValidation[productId];
    if (!stock) return null;

    if (!stock.is_active) {
      return { status: "inactive", message: "Product no longer available" };
    }

    if (!stock.sufficient) {
      return {
        status: "insufficient",
        message: (
          <>
            {t("checkout.only")} {stock.available} {t("checkout.available")}
            {t("checkout.requested")} {stock.requested}
            {")"}
          </>
        ),
      };
    }

    return {
      status: "ok",
      message: `${stock.available} ${t("checkout.instock")} `,
    };
  };

  const canPlaceOrder = () => {
    // ถ้าไม่มีสินค้าในตะกร้า
    if (cartProducts.length === 0) {
      return false;
    }

    // ถ้ายังไม่มีการเช็ค stock หรือกำลังโหลดอยู่
    if (stockCheckLoading) {
      return false;
    }

    // ถ้าไม่มีข้อมูล stock validation หรือเป็น object ว่าง
    if (!stockValidation || Object.keys(stockValidation).length === 0) {
      // อนุญาตให้ทำงานได้ถ้าไม่มี stock validation
      return true;
    }

    // ถ้ามี stock validation แล้ว ให้เช็คว่าทุกสินค้าผ่านการตรวจสอบ
    return Object.values(stockValidation).every(
      (stock) => stock.sufficient && stock.is_active
    );
  };

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <h5 className="fw-5 mb_20">{t("product.addressdetails")}</h5>

            {/* 🆕 Enhanced Shipping Address Section */}
            {userData && (
              <div className="shipping-addresses mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-5 mb-0 d-flex align-items-center gap-2">
                    <TruckElectric size={18} /> {t("product.shippingaddress")}
                  </h6>
                  <div className="d-flex align-items-center gap-2">
                    {addressLoading && (
                      <small className="text-muted">
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                        ></span>
                        {t("product.loadingaddress")}
                      </small>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                      onClick={() => {
                        setNewAddressData((prev) => ({
                          ...prev,
                          address_type: "shipping",
                        }));
                        setShowAddAddressModal(true);
                      }}
                    >
                      <Plus size={16} /> {t("product.addshippingaddress")}
                    </button>
                  </div>
                </div>

                {shippingAddresses.length > 0 ? (
                  <div className="address-options">
                    {shippingAddresses.map((address, index) => (
                      <div
                        key={address.address_id || index}
                        className={`address-option p-3 mb-3 border rounded-3 ${
                          selectedAddress?.address_id === address.address_id
                            ? "border-primary bg-primary bg-opacity-10"
                            : "border-light-subtle"
                        }`}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow:
                            selectedAddress?.address_id === address.address_id
                              ? "0 0 0 2px rgba(13, 110, 253, 0.25)"
                              : "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        onClick={() => selectShippingAddress(address)}
                      >
                        <div className="d-flex align-items-start">
                          <input
                            type="radio"
                            name="shippingAddress"
                            checked={
                              selectedAddress?.address_id === address.address_id
                            }
                            onChange={() => selectShippingAddress(address)}
                            className="me-3 mt-1 form-check-input"
                            style={{ fontSize: "16px" }}
                          />
                          <div className="address-details flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <span className="fw-bold text-dark d-flex align-items-center gap-1">
                                <TruckElectric
                                  size={16}
                                  className="text-primary"
                                />{" "}
                                {t("checkout.shipingaddress")}
                              </span>
                              {address.is_default === 1 && (
                                <span
                                  className="badge bg-success text-white d-flex align-items-center gap-1"
                                  style={{ fontSize: "10px" }}
                                >
                                  <Star size={10} /> {t("checkout.default")}
                                </span>
                              )}
                            </div>
                            <div className="text-muted small mb-1">
                              <strong>
                                {userData.first_name} {userData.last_name}
                              </strong>
                            </div>
                            <div className="text-dark small mb-1">
                              {address.address_line1}
                              {address.address_line2 &&
                                `, ${address.address_line2}`}
                            </div>
                            <div className="text-muted small mb-1">
                              {address.city}, {address.state}{" "}
                              {address.postal_code}
                            </div>
                            <div className="text-muted small">
                              {address.country}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !addressLoading && (
                    <div className="text-center p-4 bg-light rounded-3">
                      <div className="mb-2">
                        <TruckElectric size={32} className="text-muted" />
                      </div>
                      <p className="text-muted mb-2">
                        {t("product.noshippingaddress")}
                      </p>
                      <small className="text-muted">
                        {t("product.pleaseaddashippingaddress")}
                      </small>
                    </div>
                  )
                )}
              </div>
            )}

            {/* 🆕 Enhanced Billing Address Section */}
            {userData && (
              <div className="billing-address-section mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="useSameAsBilling"
                    className="form-check-input"
                    checked={useSameAsBilling}
                    onChange={(e) => {
                      setUseSameAsBilling(e.target.checked);
                      if (e.target.checked) {
                        setBillingAddress(null); // Clear billing address when using same as shipping
                      }
                    }}
                  />
                  <label
                    htmlFor="useSameAsBilling"
                    className="form-check-label d-flex align-items-center gap-2"
                  >
                    <Newspaper size={16} /> {t("product.usesameaddress")}
                  </label>
                </div>

                {!useSameAsBilling && (
                  <div className="billing-address-options">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-5 mb-0 d-flex align-items-center gap-2">
                        <Newspaper size={18} /> {t("product.billingaddress")}
                      </h6>
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                        onClick={() => {
                          setNewAddressData((prev) => ({
                            ...prev,
                            address_type: "billing",
                          }));
                          setShowAddAddressModal(true);
                        }}
                      >
                        <Plus size={16} /> {t("product.addbillingaddress")}
                      </button>
                    </div>

                    {billingAddresses.length > 0 ? (
                      <div className="address-options">
                        {billingAddresses.map((address, index) => (
                          <div
                            key={`billing-${address.address_id || index}`}
                            className={`address-option p-3 mb-3 border rounded-3 ${
                              billingAddress?.address_id === address.address_id
                                ? "border-warning bg-warning bg-opacity-10"
                                : "border-light-subtle"
                            }`}
                            style={{
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              boxShadow:
                                billingAddress?.address_id ===
                                address.address_id
                                  ? "0 0 0 2px rgba(255, 193, 7, 0.25)"
                                  : "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                            onClick={() => setBillingAddress(address)}
                          >
                            <div className="d-flex align-items-start">
                              <input
                                type="radio"
                                name="billingAddress"
                                checked={
                                  billingAddress?.address_id ===
                                  address.address_id
                                }
                                onChange={() => setBillingAddress(address)}
                                className="me-3 mt-1 form-check-input"
                                style={{ fontSize: "16px" }}
                              />
                              <div className="address-details flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <span className="fw-bold text-dark d-flex align-items-center gap-1">
                                    <Newspaper
                                      size={16}
                                      className="text-warning"
                                    />{" "}
                                    {t("checkout.billingaddress")}
                                  </span>
                                  {address.is_default === 1 && (
                                    <span
                                      className="badge bg-success text-white d-flex align-items-center gap-1"
                                      style={{ fontSize: "10px" }}
                                    >
                                      <Star size={10} /> {t("checkout.default")}
                                    </span>
                                  )}
                                </div>
                                <div className="text-muted small mb-1">
                                  <strong>
                                    {userData.first_name} {userData.last_name}
                                  </strong>
                                </div>
                                <div className="text-dark small mb-1">
                                  {address.address_line1}
                                  {address.address_line2 &&
                                    `, ${address.address_line2}`}
                                </div>
                                <div className="text-muted small mb-1">
                                  {address.city}, {address.state}{" "}
                                  {address.postal_code}
                                </div>
                                <div className="text-muted small">
                                  {address.country}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      !addressLoading && (
                        <div className="text-center p-4 bg-light rounded-3">
                          <div className="mb-2">
                            <Newspaper size={32} className="text-muted" />
                          </div>
                          <p className="text-muted mb-2">
                            {t("checkout.notfoundbillingaddress")}
                          </p>
                          <small className="text-muted">
                            {t("checkout.notfoundbillingaddress2")}
                          </small>
                        </div>
                      )
                    )}
                  </div>
                )}

                <hr className="my-4" />
              </div>
            )}

            {/* 🆕 Enhanced Add Address Modal */}
            {showAddAddressModal && (
              <div
                className="modal fade show d-block"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title d-flex align-items-center gap-2">
                        <Plus size={20} />
                        {t("checkout.addnew")}
                        {newAddressData.address_type === "shipping"
                          ? t("checkout.shipping2")
                          : t("checkout.billing")}{" "}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowAddAddressModal(false)}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label
                              htmlFor="address_type"
                              className="form-label"
                            >
                              {t("address.AddressType")} *
                            </label>
                            <select
                              className="form-select"
                              id="address_type"
                              name="address_type"
                              value={newAddressData.address_type}
                              onChange={handleNewAddressChange}
                              required
                            >
                              <option value="shipping">
                                {t("checkout.shipingaddress")}
                              </option>
                              <option value="billing">
                                {t("address.BillingAddress")}
                              </option>
                            </select>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="country" className="form-label">
                              {t("address.Country")} *
                            </label>
                            <select
                              className="form-select"
                              id="country"
                              name="country"
                              value={newAddressData.country}
                              onChange={handleNewAddressChange}
                              required
                            >
                              <option value="Thailand">
                                {t("checkout.thailand")}
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="address_line1" className="form-label">
                            {t("address.AddressLine1")} *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="address_line1"
                            name="address_line1"
                            value={newAddressData.address_line1}
                            onChange={handleNewAddressChange}
                            placeholder={t("address.Street")}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="address_line2" className="form-label">
                            {t("address.AddressLine2")}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="address_line2"
                            name="address_line2"
                            value={newAddressData.address_line2}
                            onChange={handleNewAddressChange}
                            placeholder={t("address.Street2")}
                          />
                        </div>

                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label htmlFor="city" className="form-label">
                              {t("address.City")} *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="city"
                              name="city"
                              value={newAddressData.city}
                              onChange={handleNewAddressChange}
                              placeholder={t("address.City")}
                              required
                            />
                          </div>

                          <div className="col-md-4 mb-3">
                            <label htmlFor="state" className="form-label">
                              {t("address.Province")} *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="state"
                              name="state"
                              value={newAddressData.state}
                              onChange={handleNewAddressChange}
                              placeholder={t("address.Province")}
                              required
                            />
                          </div>

                          <div className="col-md-4 mb-3">
                            <label htmlFor="postal_code" className="form-label">
                              {t("address.PostalCode")} *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="postal_code"
                              name="postal_code"
                              value={newAddressData.postal_code}
                              onChange={handleNewAddressChange}
                              placeholder="12345"
                              pattern="[0-9]{5}"
                              maxLength="5"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="is_default"
                              name="is_default"
                              checked={newAddressData.is_default}
                              onChange={handleNewAddressChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_default"
                            >
                              {t("address.Setasdefault")}
                              {t("address.address")}
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => setShowAddAddressModal(false)}
                      >
                        {t("checkout.cancel")}
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddAddress}
                        disabled={addingAddress}
                        sx={{ textTransform: "none" }}
                      >
                        {addingAddress ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                            ></span>
                            {t("checkout.adding")}
                          </>
                        ) : (
                          <>
                            <Plus size={16} /> {t("checkout.add")}
                            {newAddressData.address_type === "shipping"
                              ? t("checkout.shipping3")
                              : t("checkout.billing2")}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => e.preventDefault()}
              className="form-checkout"
            >
              <div className="box grid-2">
                <fieldset className="fieldset">
                  <label htmlFor="first-name">{t("product.firstname")}</label>
                  <input
                    required
                    type="text"
                    id="first-name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={t("product.firstname")}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <label htmlFor="last-name">{t("product.lastname")}</label>
                  <input
                    required
                    type="text"
                    id="last-name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={t("product.lastname")}
                  />
                </fieldset>
              </div>

              <fieldset className="box fieldset">
                <label htmlFor="phone">{t("product.phonenumber")}</label>
                <input
                  required
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t("product.phone")}
                  pattern="[0-9]{10,15}"
                />
              </fieldset>

              <fieldset className="box fieldset">
                <label htmlFor="email">{t("product.email")}</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("product.emailaddress")}
                />
              </fieldset>

              <fieldset className="box fieldset">
                <label htmlFor="note">{t("product.ordernotes")}</label>
                <textarea
                  name="note"
                  id="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder={t("product.notesabout")}
                />
              </fieldset>
            </form>
          </div>

          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              <h5 className="fw-5 mb_20">{t("product.yourorder")}</h5>

              {/* Stock Check Status */}
              {stockCheckLoading && (
                <div className="alert alert-info d-flex align-items-center mb-3">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <span>{t("product.checkingproduct")}</span>
                </div>
              )}

              <form
                onSubmit={(e) => e.preventDefault()}
                className="tf-page-cart-checkout widget-wrap-checkout"
              >
                {cartProducts.length > 0 ? (
                  <>
                    <ul className="wrap-checkout-product">
                      {cartProducts.map((elm, i) => {
                        // ✅ ใช้ product_id ในการเรียก getStockStatus
                        const productId = elm.product_id; // ← ใช้ product_id
                        const stockStatus = getStockStatus(productId);

                        return (
                          <li key={i} className="checkout-product-item">
                            <figure className="img-product">
                              <Image
                                alt="product"
                                src={elm.image}
                                width={720}
                                height={1005}
                              />
                              <span className="quantity">{elm.quantity}</span>
                            </figure>
                            <div className="content">
                              <div className="info">
                                <p className="name">{elm.name}</p>
                                {elm.color && elm.size && (
                                  <span className="variant">
                                    {elm.color} / {elm.size}
                                  </span>
                                )}

                                {/* ✅ แสดง stock ที่มีอยู่แล้วจาก cart_wishlist */}
                                <div className="stock-info mt-1">
                                  <small className="text-muted">
                                    {t("checkout.stock")}{" "}
                                    {elm.stock_quantity || "0"}
                                  </small>
                                </div>

                                {/* Stock Status Display จาก API check */}
                                {stockStatus && (
                                  <div className="stock-status mt-1 d-flex align-items-center gap-1">
                                    {stockStatus.status === "ok" && (
                                      <small className="text-success d-flex align-items-center gap-1">
                                        <CheckCircle size={12} />{" "}
                                        {stockStatus.message}
                                      </small>
                                    )}
                                    {stockStatus.status === "insufficient" && (
                                      <small className="text-danger d-flex align-items-center gap-1">
                                        <AlertTriangle size={12} />{" "}
                                        {stockStatus.message}
                                      </small>
                                    )}
                                    {stockStatus.status === "inactive" && (
                                      <small className="text-danger d-flex align-items-center gap-1">
                                        <XCircle size={12} />{" "}
                                        {stockStatus.message}
                                      </small>
                                    )}
                                  </div>
                                )}
                              </div>
                              <span className="price">
                                ฿{formatPrice(elm.price * elm.quantity)}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Stock Validation Summary */}
                    {Object.keys(stockValidation).length > 0 &&
                      !canPlaceOrder() && (
                        <div className="alert alert-warning mb-3">
                          <strong className="d-flex align-items-center gap-2">
                            <AlertTriangle size={16} />{" "}
                            {t("checkout.stockissuesderected")}
                          </strong>
                          <ul className="mb-0 mt-2">
                            {Object.entries(stockValidation)
                              .map(([productId, stock]) => {
                                if (!stock.sufficient || !stock.is_active) {
                                  // ✅ 1. ค้นหาสินค้าที่ตรงกันใน cartProducts
                                  const cartItem = cartProducts.find(
                                    (p) =>
                                      p.product_id.toString() ===
                                      productId.toString()
                                  );

                                  // ✅ 2. ใช้ชื่อจาก cartItem (ถ้ามี) หรือใช้ชื่อจาก stock (ถ้าไม่มี)
                                  const displayName =
                                    cartItem?.name || stock.product_name;

                                  return (
                                    <li key={productId}>
                                      {/* ✅ 3. แสดงผลชื่อที่ถูกต้อง */}
                                      <strong>{displayName}:</strong>{" "}
                                      {!stock.is_active ? (
                                        t("checkout.productnolonger")
                                      ) : (
                                        <>
                                          {t("checkout.only")} {stock.available}{" "}
                                          {t("checkout.available")}
                                          <br />
                                          {t("checkout.requested")}{" "}
                                          {stock.requested}
                                          {")"}
                                        </>
                                      )}
                                    </li>
                                  );
                                }
                                return null;
                              })
                              .filter(Boolean)}
                          </ul>
                          <small className="text-muted d-block mt-2">
                            {t("checkout.pleaseupdate")}
                          </small>
                        </div>
                      )}

                    {/* Order Summary */}
                    <div className="order-summary mb-4">
                      <div className="d-flex justify-content-between line pb_10">
                        <span>{t("checkout.subtotal")}</span>
                        <span>฿{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="d-flex justify-content-between line pb_10">
                        <span>{t("checkout.shipping")}</span>
                        <span>
                          {shippingCost === 0
                            ? t("checkout.free")
                            : `฿${formatPrice(shippingCost.toFixed(2))}`}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between line pb_10">
                        <span>{t("checkout.tax")} (7%)</span>
                        <span>฿{formatPrice(taxAmount)}</span>
                      </div>
                      <div className="d-flex justify-content-between line pb_20 fw-bold">
                        <h6 className="fw-5">{t("checkout.total")}</h6>
                        <h6 className="total fw-5">
                          ฿{formatPrice(finalTotal)}
                        </h6>
                      </div>
                    </div>

                    <div className="wd-check-payment">
                      <h6 className="fw-5 mb-3">
                        {t("checkout.paymentmethod")}
                      </h6>

                      {/* Credit/Debit Card */}
                      <div className="fieldset-radio mb_20">
                        <label
                          htmlFor="credit_card"
                          className="d-flex align-items-start gap-2"
                        >
                          <input
                            type="radio"
                            name="payment"
                            id="credit_card"
                            className="form-check-input mt-1"
                            checked={paymentMethod === "credit_card"}
                            onChange={() => setPaymentMethod("credit_card")}
                          />
                          <span
                            style={{ fontWeight: 600 }}
                            className="d-flex align-items-center gap-2"
                          >
                            <CreditCard size={16} /> {t("checkout.paywith")}
                          </span>
                        </label>

                        {paymentMethod === "credit_card" && (
                          <div
                            className="bg-light border rounded p-3 mt-2"
                            style={{
                              fontSize: "14px",
                              color: "#334155",
                              lineHeight: "1.6",
                              borderColor: "#e2e8f0",
                            }}
                          >
                            <p className="mb-2">{t("checkout.securevisa")}</p>

                            <p
                              className="m-0 d-flex align-items-center gap-2"
                              style={{ color: "#059669", fontWeight: "600" }}
                            >
                              <Lock size={14} /> {t("checkout.sslencrypted")}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* PromptPay QR Code */}
                      <div className="fieldset-radio mb_20">
                        <label
                          htmlFor="qr_code"
                          className="d-flex align-items-start gap-2"
                        >
                          <input
                            type="radio"
                            name="payment"
                            id="qr_code"
                            className="form-check-input mt-1"
                            checked={paymentMethod === "qr_code"}
                            onChange={() => setPaymentMethod("qr_code")}
                          />
                          <span
                            style={{ fontWeight: 600 }}
                            className="d-flex align-items-center gap-2"
                          >
                            <Smartphone size={16} />{" "}
                            {t("checkout.paywithprompay")}
                          </span>
                        </label>

                        {paymentMethod === "qr_code" && (
                          <div
                            className="bg-light border rounded p-3 mt-2"
                            style={{ fontSize: "14px", color: "#334155" }}
                          >
                            <p className="mb-2">
                              {t("product.instantpromptpay")}
                            </p>

                            <p
                              className="m-0 d-flex align-items-center gap-2"
                              style={{ color: "#059669", fontWeight: "600" }}
                            >
                              <Lock size={14} />{" "}
                              {t("product.securepromtpaytransfer")}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Privacy and T&C Notice */}
                      <p
                        className="text_black-2 mb_20"
                        style={{ fontSize: "14px", lineHeight: "1.6" }}
                      >
                        {t("product.privacycontent")}{" "}
                        <Link
                          href={`/privacy-policy`}
                          className="text-decoration-underline"
                        >
                          {t("product.privacypolicy")}
                        </Link>
                        .
                      </p>

                      {/* Terms and Conditions Checkbox */}
                      <div className="box-checkbox fieldset-radio mb_20 d-flex align-items-start gap-2">
                        <input
                          type="checkbox"
                          id="check-agree"
                          className="form-check-input mt-1"
                          checked={agreeChecked}
                          onChange={(e) => setAgreeChecked(e.target.checked)}
                        />
                        <label
                          htmlFor="check-agree"
                          className="text_black-2"
                          style={{ fontSize: "14px" }}
                        >
                          {t("product.ihavereadandagree")}{" "}
                          <Link
                            target="_blank"
                            href={`/terms-condition`}
                            className="text-decoration-underline"
                          >
                            {t("product.termsandconditions")}
                          </Link>
                          .
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center ${
                        loading ||
                        !agreeChecked ||
                        !paymentMethod ||
                        !canPlaceOrder()
                          ? "btn-disabled"
                          : ""
                      }`}
                      onClick={handlePlaceOrder}
                      disabled={
                        loading ||
                        !agreeChecked ||
                        !paymentMethod ||
                        !canPlaceOrder()
                      }
                      style={{
                        opacity:
                          loading ||
                          !agreeChecked ||
                          !paymentMethod ||
                          !canPlaceOrder()
                            ? 0.6
                            : 1,
                        cursor:
                          loading ||
                          !agreeChecked ||
                          !paymentMethod ||
                          !canPlaceOrder()
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {loading ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {t("product.processing")}
                        </span>
                      ) : !paymentMethod ? (
                        t("checkout.selectpayment")
                      ) : !agreeChecked ? (
                        t("checkout.pleaseaccept")
                      ) : cartProducts.length === 0 ? (
                        t("checkout.cartisempty")
                      ) : !canPlaceOrder() &&
                        Object.keys(stockValidation).length > 0 ? (
                        <span className="d-flex align-items-center gap-2">
                          <AlertTriangle size={16} />
                          {t("product.stockissues-updatecart")}
                        </span>
                      ) : stockCheckLoading ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {t("product.checkingstock")}
                        </span>
                      ) : paymentMethod === "credit_card" ? (
                        <span className="d-flex align-items-center gap-2">
                          <CreditCard size={16} /> {t("product.craditcard")}
                        </span>
                      ) : paymentMethod === "qr_code" ? (
                        <span className="d-flex align-items-center gap-2">
                          <Smartphone size={16} /> {t("product.promotpay")}
                        </span>
                      ) : paymentMethod === "bank_transfer_manual" ? (
                        <span className="d-flex align-items-center gap-2">
                          <Banknote size={16} /> {t("product.uploadslip")}
                        </span>
                      ) : (
                        "Place Order"
                      )}
                    </button>

                    {/* Enhanced Security and Feature Info */}
                    <div className="security-info mt-3 text-center">
                      <small className="text-muted d-block mb-2 d-flex align-items-center justify-content-center gap-2">
                        <Shield size={14} /> {t("product.sslencryp")}
                      </small>
                    </div>

                    {/* Real-time Stock Status Button */}
                    <div className="mt-3 text-center">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={checkStockAvailability}
                        disabled={stockCheckLoading}
                      >
                        {stockCheckLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            {t("product.checking")}
                          </>
                        ) : (
                          <>
                            <RotateCcw size={14} className="me-1" />{" "}
                            {t("product.refreshstockstatus")}
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="container">
                    <div className="row align-items-center mt-5 mb-5">
                      <div className="col-12 fs-18">
                        {t("product.yourcartisempty")}
                      </div>
                      <div className="col-12 mt-3">
                        <Link
                          href={`/tkc-product`}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          style={{ width: "fit-content" }}
                        >
                          {t("product.exploreproducts")}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
