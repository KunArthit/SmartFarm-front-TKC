import React from "react";

export default function PackageTrackingTab({
  t,
  orderData,
  trackingData,
  trackingLoading,
  trackingError,
  formatDate,
  refreshTracking,
}) {
  const getTrackingHistory = () => {
    if (!trackingData || !Array.isArray(trackingData)) return [];

    return trackingData
      .map((item, index) => {
        const statusMap = {
          103: t("detail.Package Received"),
          201: t("detail.Departed from Office/Sorting Center"),
          211: t("detail.Arrived at Sorting Center"),
          206: t("detail.Arrived at Post Office"),
          301: t("detail.Out for Delivery"),
          501: t("detail.Successfully Delivered"),
        };

        const englishTitle = statusMap[item.status] || item.status_description;
        const isDelivered = item.status === "501";
        const isOutForDelivery = item.status === "301";
        const isInTransit = ["201", "211", "206"].includes(item.status);

        return {
          title: englishTitle,
          thaiTitle: item.status_description,
          date: item.status_date,
          location: item.location,
          postcode: item.postcode,
          details: item.status_detail || item.status_description,
          status: isDelivered
            ? "delivered"
            : isOutForDelivery
              ? "out-for-delivery"
              : isInTransit
                ? "in-transit"
                : "completed",
          receiverName: item.receiver_name,
          deliveryOfficer: item.delivery_officer_name,
          deliveryOfficerTel: item.delivery_officer_tel,
          signature: item.signature,
          isLatest: index === trackingData.length - 1,
        };
      })
      .reverse();
  };

  const getSummarySteps = () => {
    const summaryMapping = [
      {
        label: t("detail.Package Received"),
        status: "103",
        icon: "📦",
        description: t("detail.Package accepted by postal service"),
      },
      {
        label: t("detail.In Transit"),
        status: "201",
        icon: "🚛",
        description: t("detail.Package is being transported"),
      },
      {
        label: t("detail.Out for Delivery"),
        status: "301",
        icon: "🚚",
        description: t("detail.Package is out for final delivery"),
      },
      {
        label: t("detail.Delivered"),
        status: "501",
        icon: "✅",
        description: t("detail.Package successfully delivered"),
      },
    ];

    return summaryMapping.map((step) => {
      const hasStatus = trackingData?.some(
        (item) => item.status === step.status
      );
      const isDelivered = trackingData?.some((item) => item.status === "501");
      const isOutForDelivery = trackingData?.some(
        (item) => item.status === "301"
      );
      const isInTransit = trackingData?.some((item) =>
        ["201", "211", "206"].includes(item.status)
      );

      let completed = false;
      let active = false;

      if (
        step.status === "103" &&
        trackingData?.some((i) => i.status === "103")
      ) {
        completed = true;
      } else if (
        step.status === "201" &&
        (isInTransit || isOutForDelivery || isDelivered)
      ) {
        completed = true;
      } else if (step.status === "301" && (isOutForDelivery || isDelivered)) {
        completed = true;
      } else if (step.status === "501" && isDelivered) {
        completed = true;
      }

      if (!completed && hasStatus) {
        active = true;
      }

      return {
        ...step,
        completed,
        active,
      };
    });
  };

  return (
    <div className="tracking-section">
      <div className="tracking-header">
        <div className="tracking-title">
          <h6>{t("detail.packagetracking")}</h6>
          <div className="tracking-number">
            {t("detail.trackingnumber")}:{" "}
            <strong>{orderData.tracking_number}</strong>
          </div>
        </div>
        <button
          onClick={refreshTracking}
          disabled={trackingLoading}
          className="refresh-btn"
        >
          <span
            className={`refresh-icon ${trackingLoading ? "spinning" : ""}`}
          >
            🔄
          </span>
          {trackingLoading ? t("detail.Updating") : t("detail.Refresh")}
        </button>
      </div>

      {trackingLoading && (
        <div className="tracking-loading">
          <div className="loading-spinner" />
          <p>{t("detail.loading")}</p>
        </div>
      )}

      {trackingError && (
        <div className="tracking-error">
          <div className="error-icon">⚠️</div>
          <div>
            <strong>{t("detail.unload")}</strong>
            <p>{trackingError}</p>
          </div>
        </div>
      )}

      {trackingData && !trackingLoading && (
        <div className="tracking-stepper">
          {/* Summary Status Stepper */}
          <div className="summary-stepper">
            <h6>{t("detail.shippingstatus")}</h6>
            <div className="stepper-horizontal">
              {getSummarySteps().map((step, index) => (
                <div
                  key={index}
                  className={`stepper-step ${step.active ? "active" : ""
                    } ${step.completed ? "completed" : ""}`}
                >
                  <div className="step-circle">
                    <div className="step-icon">
                      {step.completed ? "✓" : step.icon}
                    </div>
                  </div>
                  <div className="step-info">
                    <div className="step-label">{step.label}</div>
                    <div className="step-description">
                      {step.description}
                    </div>
                  </div>
                  {index < getSummarySteps().length - 1 && (
                    <div
                      className={`step-connector ${step.completed ? "completed" : ""
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Vertical Stepper */}
          <div className="detail-stepper">
            <h6>{t("detail.shippingdetails")}</h6>
            <div className="stepper-vertical">
              {getTrackingHistory().map((trackingItem, index) => (
                <div
                  key={index}
                  className="stepper-step-vertical fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="step-indicator-vertical">
                    <div className="step-dot">
                      <span className="step-number">
                        {trackingData.length - index}
                      </span>
                    </div>
                  </div>
                  <div className="step-content-vertical">
                    <div className="step-header-vertical">
                      <h5>{trackingItem.title}</h5>
                      <span className="step-date">
                        {formatDate(trackingItem.date)}
                      </span>
                    </div>
                    {trackingItem.thaiTitle &&
                      trackingItem.thaiTitle !== trackingItem.title && (
                        <div className="thai-title">
                          {trackingItem.thaiTitle}
                        </div>
                      )}
                    <div className="step-location">
                      📍 {trackingItem.location}
                      {trackingItem.postcode && ` (${trackingItem.postcode})`}
                    </div>
                    <div className="step-details">
                      {trackingItem.details}
                    </div>
                    {trackingItem.receiverName && (
                      <div className="delivery-info">
                        <strong>{t("detail.receivedby")}:</strong>{" "}
                        {trackingItem.receiverName}
                      </div>
                    )}
                    {trackingItem.deliveryOfficer && (
                      <div className="delivery-info">
                        <strong>{t("detail.deliveryofficer")}:</strong>{" "}
                        {trackingItem.deliveryOfficer}
                        {trackingItem.deliveryOfficerTel && (
                          <span> ({trackingItem.deliveryOfficerTel})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!trackingData && !trackingLoading && !trackingError && (
        <div className="no-tracking">
          <div className="no-tracking-icon">📭</div>
          <h6>{t("detail.notracking")}</h6>
          <p>{t("detail.takesometime")}</p>
        </div>
      )}
    </div>
  );
}
