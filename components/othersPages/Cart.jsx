"use client";
import { useContextElement } from "@/context/Context";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const {
    cartProducts,
    setCartProducts,
    removeFromCart,
    updateQuantity,
    totalPrice,
  } = useContextElement();
  const [isAgreed, setIsAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const { t } = useTranslation();

  const handleCheckoutClick = (e) => {
    if (!isAgreed) {
      e.preventDefault();
      setShowError(true);

      // Hide error message after 3 seconds
      setTimeout(() => {
        setShowError(false);
      }, 3000);

      return false;
    }
    // If agreed, proceed to checkout
    return true;
  };

  const handleCheckboxChange = (e) => {
    setIsAgreed(e.target.checked);
    if (e.target.checked) {
      setShowError(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <section className="flat-spacing-11">
      <div className="container">
        {/* Custom CSS for animations and styling */}
        <style jsx>{`
          .error-message {
            background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%);
            border: 1px solid #fca5a5;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 16px;
            color: #dc2626;
            font-weight: 500;
            animation: slideInShake 0.5s ease-out;
            position: relative;
          }

          .error-message::before {
            content: "⚠️";
            margin-right: 8px;
            font-size: 16px;
          }

          @keyframes slideInShake {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            50% {
              transform: translateY(0);
              opacity: 1;
            }
            60% {
              transform: translateX(-5px);
            }
            80% {
              transform: translateX(5px);
            }
            100% {
              transform: translateX(0);
            }
          }

          .checkout-button-disabled {
            background: #e5e7eb !important;
            color: #9ca3af !important;
            cursor: not-allowed !important;
            opacity: 0.6;
            transition: all 0.3s ease;
          }

          .checkout-button-enabled {
            background: linear-gradient(
              135deg,
              #059669 0%,
              #047857 100%
            ) !important;
            color: white !important;
            cursor: pointer !important;
            transition: all 0.3s ease;
          }

          .checkout-button-enabled:hover {
            background: linear-gradient(
              135deg,
              #047857 0%,
              #065f46 100%
            ) !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          }

          .checkbox-container {
            position: relative;
            padding: 16px;
            border-radius: 8px;
            background: #f8fafc;
            transition: all 0.3s ease;
            margin-block: 16px;
          }

          .checkbox-container.error {
            animation: shake 0.5s ease-in-out;
          }

          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }

          .checkbox-label {
            cursor: pointer;
            display: flex;
            align-items: center;
            font-weight: 500;
            color: #374151;
          }

          .custom-checkbox {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            accent-color: #10b981;
            cursor: pointer;
          }

          .terms-link {
            color: #059669;
            text-decoration: underline;
            font-weight: 600;
            transition: color 0.2s ease;
          }

          .terms-link:hover {
            color: #047857;
          }

          .cart-footer-enhanced {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #e5e7eb;
          }

          .remove-cart-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            border-radius: 6px;
            background: #fee2e2;
            color: #dc2626;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            font-size: 0;
          }

          .remove-cart-icon:hover {
            background: #fecaca;
            color: #b91c1c;
            transform: scale(1.1);
          }

          .remove-cart-icon svg {
            width: 16px;
            height: 16px;
          }
        `}</style>

        <div className="tf-page-cart-wrap">
          <div className="tf-page-cart-item">
            <form onSubmit={(e) => e.preventDefault()}>
              <table className="tf-table-page-cart">
                <thead>
                  <tr>
                    <th>{t("product.product")}</th>
                    <th>{t("product.price")}</th>
                    <th>{t("product.quantity")}</th>
                    <th>{t("product.total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((elm, i) => (
                    <tr key={i} className="tf-cart-item file-delete">
                      <td className="tf-cart-item_product">
                        <Link
                          href={`/product-detail/${elm.product_id}`}
                          className="img-box"
                        >
                          <Image
                            alt="img-product"
                            src={elm.image}
                            width={668}
                            height={932}
                          />
                        </Link>
                        <div className="cart-info">
                          <Link
                            href={`/product-detail/${elm.product_id}`}
                            className="cart-title link"
                          >
                            {elm.name}
                          </Link>
                          <button
                            className="remove-cart-icon"
                            onClick={() => removeFromCart(elm.id)}
                            title="Remove item"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 6H5H21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 11V17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14 11V17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td
                        className="tf-cart-item_price"
                        cart-data-title={t("product.price")}
                      >
                        <div className="cart-price">
                          ฿ {formatPrice(elm.price)}
                        </div>
                      </td>
                      <td
                        className="tf-cart-item_quantity"
                        cart-data-title={t("product.quantity")}
                      >
                        <div className="cart-quantity">
                          <div className="wg-quantity">
                            <span
                              className="btn-quantity minus-btn"
                              onClick={() =>
                                updateQuantity(elm.id, elm.quantity - 1)
                              }
                            >
                              <svg
                                className="d-inline-block"
                                width={9}
                                height={1}
                                viewBox="0 0 9 1"
                                fill="currentColor"
                              >
                                <path d="M9 1H5.14286H3.85714H0V1.50201e-05H3.85714L5.14286 0L9 1.50201e-05V1Z" />
                              </svg>
                            </span>
                            <input
                              type="text"
                              name="number"
                              value={elm.quantity}
                              min={1}
                              onChange={(e) =>
                                setQuantity(elm.id, e.target.value / 1)
                              }
                            />
                            <span
                              className="btn-quantity plus-btn"
                              onClick={() =>
                                updateQuantity(elm.id, elm.quantity + 1)
                              }
                            >
                              <svg
                                className="d-inline-block"
                                width={9}
                                height={9}
                                viewBox="0 0 9 9"
                                fill="currentColor"
                              >
                                <path d="M9 5.14286H5.14286V9H3.85714V5.14286H0V3.85714H3.85714V0H5.14286V3.85714H9V5.14286Z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td
                        className="tf-cart-item_total"
                        cart-data-title={t("product.total")}
                      >
                        <div
                          className="cart-total"
                          style={{ minWidth: "60px" }}
                        >
                          ฿ {formatPrice(elm.price * elm.quantity)}{" "}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!cartProducts.length && (
                <>
                  <div className="row align-items-center mb-5">
                    <div className="col-6 fs-18">{t("product.empty")}</div>
                    <div className="col-6">
                      <Link
                        href={`/tkc-product`}
                        className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                        style={{ width: "fit-content" }}
                      >
                        {t("product.explore")}
                      </Link>
                    </div>
                  </div>
                </>
              )}
              <div className="tf-page-cart-note">
                <label htmlFor="cart-note">{t("product.note")}</label>
                <textarea
                  name="note"
                  id="cart-note"
                  placeholder={t("product.helpyou")}
                  defaultValue={""}
                />
              </div>
            </form>
          </div>

          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner cart-footer-enhanced">
              <div className="tf-free-shipping-bar">
                <div className="tf-progress-bar">
                  <span style={{ width: "50%" }}>
                    <div className="progress-car">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={21}
                        height={14}
                        viewBox="0 0 21 14"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 0.875C0 0.391751 0.391751 0 0.875 0H13.5625C14.0457 0 14.4375 0.391751 14.4375 0.875V3.0625H17.3125C17.5867 3.0625 17.845 3.19101 18.0104 3.40969L20.8229 7.12844C20.9378 7.2804 21 7.46572 21 7.65625V11.375C21 11.8582 20.6082 12.25 20.125 12.25H17.7881C17.4278 13.2695 16.4554 14 15.3125 14C14.1696 14 13.1972 13.2695 12.8369 12.25H7.72563C7.36527 13.2695 6.39293 14 5.25 14C4.10706 14 3.13473 13.2695 2.77437 12.25H0.875C0.391751 12.25 0 11.8582 0 11.375V0.875ZM2.77437 10.5C3.13473 9.48047 4.10706 8.75 5.25 8.75C6.39293 8.75 7.36527 9.48046 7.72563 10.5H12.6875V1.75H1.75V10.5H2.77437ZM14.4375 8.89937V4.8125H16.8772L19.25 7.94987V10.5H17.7881C17.4278 9.48046 16.4554 8.75 15.3125 8.75C15.0057 8.75 14.7112 8.80264 14.4375 8.89937ZM5.25 10.5C4.76676 10.5 4.375 10.8918 4.375 11.375C4.375 11.8582 4.76676 12.25 5.25 12.25C5.73323 12.25 6.125 11.8582 6.125 11.375C6.125 10.8918 5.73323 10.5 5.25 10.5ZM15.3125 10.5C14.8293 10.5 14.4375 10.8918 14.4375 11.375C14.4375 11.8582 14.8293 12.25 15.3125 12.25C15.7957 12.25 16.1875 11.8582 16.1875 11.375C16.1875 10.8918 15.7957 10.5 15.3125 10.5Z"
                        />
                      </svg>
                    </div>
                  </span>
                </div>
              </div>

              <div className="tf-page-cart-checkout">
                <div className="tf-cart-totals-discounts">
                  <h3>{t("product.Subtotal")}</h3>
                  <span className="total-value">
                    ฿ {formatPrice(totalPrice)} THB
                  </span>
                </div>

                <p className="tf-cart-tax">{t("product.taxes")}</p>

                {/* Error Message */}
                {showError && (
                  <div className="error-message">
                    Please agree to the terms and conditions before proceeding
                    to checkout.
                  </div>
                )}

                {/* Enhanced Checkbox */}
                <div
                  className={`checkbox-container ${
                    showError && !isAgreed ? "error" : ""
                  }`}
                >
                  <label htmlFor="check-agree" className="checkbox-label">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      id="check-agree"
                      checked={isAgreed}
                      onChange={handleCheckboxChange}
                    />
                    {t("product.accept")}{" "}
                    <Link href={`/privacy-policy`} className="terms-link">
                      {t("product.requirements")}
                    </Link>
                  </label>
                </div>

                {/* Enhanced Checkout Button */}
                <div className="cart-checkout-btn">
                  {isAgreed ? (
                    <Link
                      href={`/checkout`}
                      className={`tf-btn w-100 btn-fill animate-hover-btn radius-3 justify-content-center checkout-button-enabled`}
                      onClick={handleCheckoutClick}
                    >
                      <span>{t("product.proceedtocheckout")}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`tf-btn w-100 btn-fill radius-3 justify-content-center checkout-button-disabled`}
                      onClick={handleCheckoutClick}
                      disabled
                    >
                      <span> {t("product.agreetoterms")}</span>
                    </button>
                  )}
                </div>

                <div className="tf-page-cart_imgtrust">
                  <p className="text-center fw-6">{t("product.checkout")}</p>
                  <div className="cart-list-social">
                    <div className="payment-item">
                      <svg
                        viewBox="0 0 38 24"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        width={38}
                        height={24}
                        aria-labelledby="pi-visa"
                      >
                        <title id="pi-visa">Visa</title>
                        <path
                          opacity=".07"
                          d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        />
                        <path
                          fill="#fff"
                          d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                        />
                        <path
                          d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                          fill="#142688"
                        />
                      </svg>
                    </div>
                    <div className="payment-item">
                      <svg
                        viewBox="0 0 38 24"
                        xmlns="http://www.w3.org/2000/svg"
                        width={38}
                        height={24}
                        role="img"
                        aria-labelledby="pi-paypal"
                      >
                        <title id="pi-paypal">PayPal</title>
                        <path
                          opacity=".07"
                          d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        />
                        <path
                          fill="#fff"
                          d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                        />
                        <path
                          fill="#003087"
                          d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                        />
                        <path
                          fill="#3086C8"
                          d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                        />
                        <path
                          fill="#012169"
                          d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                        />
                      </svg>
                    </div>
                    <div className="payment-item">
                      <svg
                        viewBox="0 0 38 24"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        width={38}
                        height={24}
                        aria-labelledby="pi-master"
                      >
                        <title id="pi-master">Mastercard</title>
                        <path
                          opacity=".07"
                          d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        />
                        <path
                          fill="#fff"
                          d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                        />
                        <circle fill="#EB001B" cx={15} cy={12} r={7} />
                        <circle fill="#F79E1B" cx={23} cy={12} r={7} />
                        <path
                          fill="#FF5F00"
                          d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
