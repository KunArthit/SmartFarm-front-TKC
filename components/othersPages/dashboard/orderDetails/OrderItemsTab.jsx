import React from "react";
import Image from "next/image";

export default function OrderItemsTab({
  t,
  currentLang,
  itemsLoading,
  productsLoading,
  itemsError,
  productsError,
  orderItems,
  productDetails,
  formatCurrency,
}) {
  const uniqueItemIds = [...new Set(orderItems.map((item) => item.item_id))];

  const filteredOrderItems = uniqueItemIds
    .map((id) => {
      const allVersions = orderItems.filter((item) => item.item_id === id);
      let bestMatch = allVersions.find((item) => item.lang === currentLang);
      if (bestMatch) return bestMatch;
      bestMatch = allVersions.find((item) => item.lang === "en");
      if (bestMatch) return bestMatch;
      return allVersions[0];
    })
    .filter(Boolean);

  const getItemName = (item, product) =>
    item?.product_name || product?.name || `Product ID: ${item.product_id}`;

  return (
    <div className="order-items-section">
      <h6 className="mb-3">{t("order.orderitems")}</h6>

      {(itemsLoading || productsLoading) && (
        <div className="items-loading">
          <div className="loading-spinner" />
          <p>
            {itemsLoading
              ? "Loading order items..."
              : "Loading product details..."}
          </p>
        </div>
      )}

      {(itemsError || productsError) && (
        <div className="items-error">
          <div className="error-icon">⚠️</div>
          <div>
            <strong>
              {itemsError
                ? "Unable to load order items"
                : "Unable to load product details"}
            </strong>
            <p>{itemsError || productsError}</p>
          </div>
        </div>
      )}

      {!itemsLoading &&
        !productsLoading &&
        !itemsError &&
        orderItems.length === 0 && (
          <div className="no-items">
            <div className="no-items-icon">📦</div>
            <h6>{t("detail.Noitemsfound")}</h6>
            <p>{t("detail.containanyitems")}</p>
          </div>
        )}

      {!itemsLoading &&
        !productsLoading &&
        !itemsError &&
        filteredOrderItems.length > 0 && (
          <div className="items-list">
            {filteredOrderItems.map((item, index) => {
              const product = productDetails[item.product_id];

              return (
                <div key={item.item_id || index} className="order-item">
                  <div className="item-content">
                    {/* รูปสินค้า */}
                    <div className="product-image-section">
                      {product?.image ||
                      (product?.images && product.images.length > 0) ? (
                        <div className="product-image-container">
                          <Image
                            src={product.image || product.images[0]}
                            alt={getItemName(item, product)}
                            width={120}
                            height={120}
                            className="product-image"
                            unoptimized
                          />
                          {product?.images && product.images.length > 1 && (
                            <div className="image-count-badge">
                              +{product.images.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="product-image-placeholder">
                          <div className="placeholder-icon">📦</div>
                          <span>{t("detail.NoImage")}</span>
                        </div>
                      )}
                    </div>

                    {/* ข้อมูลสินค้า */}
                    <div className="product-info-section">
                      <div className="product-header">
                        <h6 className="product-name">
                          {getItemName(item, product)}
                        </h6>
                      </div>

                      {product?.short_description && (
                        <div className="product-description">
                          {product.short_description}
                        </div>
                      )}

                      {!product && !productsLoading && (
                        <div className="product-load-failed">
                          <span className="warning-icon">⚠️</span>
                          <span>{t("detail.Productdetailsunavailable")}</span>
                        </div>
                      )}

                      <div className="product-details">
                        <div className="detail-row">
                          <span className="label">
                            {t("product.quantity")}:
                          </span>
                          <span className="value">{item.quantity}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">
                            {t("detail.UnitPrice")}:
                          </span>
                          <span className="value">
                            {formatCurrency(item.unit_price)}
                          </span>
                        </div>
                        <div className="detail-row total-row">
                          <span className="label">
                            {t("detail.subtotal")}:
                          </span>
                          <span className="value total">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      </div>

                      {product && (
                        <div className="product-additional-info">
                          {product.stock_quantity !== undefined && (
                            <div className="stock-info">
                              <span
                                className={`stock-badge ${
                                  product.stock_quantity > 0
                                    ? "in-stock"
                                    : "out-of-stock"
                                }`}
                              >
                                {product.stock_quantity > 0
                                  ? `${product.stock_quantity} ${t(
                                      "detail.instock"
                                    )}`
                                  : t("detail.outofstock")}
                              </span>
                            </div>
                          )}
                          {product.is_featured === 1 && (
                            <div className="featured-badge">
                              ⭐ {t("detail.HotProduct")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* summary */}
            <div className="items-summary">
              <div className="summary-row">
                <span>{t("detail.TotalItems")}:</span>
                <span className="fw-6">{filteredOrderItems.length}</span>
              </div>
              <div className="summary-row">
                <span>{t("detail.TotalQuantity")}:</span>
                <span className="fw-6">
                  {filteredOrderItems.reduce(
                    (sum, item) => sum + Number(item.quantity),
                    0
                  )}
                </span>
              </div>
              <div className="summary-row total">
                <span>{t("detail.ItemsSubtotal")}:</span>
                <span className="fw-6">
                  {formatCurrency(
                    filteredOrderItems.reduce(
                      (sum, item) => sum + Number(item.subtotal),
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
