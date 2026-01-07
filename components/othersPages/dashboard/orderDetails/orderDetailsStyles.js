// components/othersPages/dashboard/orderDetails/orderDetailsStyles.js
import css from "styled-jsx/css";

const orderDetailsStyles = css.global`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .widget-menu-tab {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
          border-bottom: 1px solid #dee2e6;
          overflow-x: auto;
        }

        .widget-menu-tab .item-title {
          padding: 12px 20px;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .widget-menu-tab .item-title:hover {
          background-color: #f8f9fa;
        }

        .widget-menu-tab .item-title.active {
          border-bottom-color: #007bff;
          background-color: #f8f9fa;
        }

        .widget-menu-tab .item-title.active .inner {
          color: #007bff;
          font-weight: 600;
        }

        .widget-content-tab {
          padding: 20px 0;
        }

        /* Order Items Styles */
        .order-items-section {
          min-height: 200px;
        }

        .items-loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }

        .items-loading .loading-spinner {
          width: 30px;
          height: 30px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        .items-error {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .error-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .no-items {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .no-items-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-items h6 {
          color: #495057;
          margin-bottom: 8px;
        }

        .no-items p {
          font-size: 14px;
          margin: 0;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-item {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .order-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: #007bff;
        }

        .item-content {
          display: flex;
          gap: 20px;
          padding: 20px;
        }

        /* Product Image Section */
        .product-image-section {
          flex-shrink: 0;
        }

        .product-image-container {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-count-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .product-image-placeholder {
          width: 120px;
          height: 120px;
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }

        .placeholder-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .product-image-placeholder span {
          font-size: 12px;
          font-weight: 500;
        }

        /* Product Information Section */
        .product-info-section {
          flex: 1;
          min-width: 0;
        }

        .product-header {
          margin-bottom: 12px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .product-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .product-sku {
          font-size: 12px;
          color: #007bff;
          background: #e7f3ff;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .product-description {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          color: #495057;
          line-height: 1.5;
          margin-bottom: 16px;
          border-left: 4px solid #007bff;
        }

        .product-load-failed {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          margin-bottom: 16px;
        }

        .warning-icon {
          font-size: 16px;
        }

        .product-load-failed span:last-child {
          font-size: 14px;
          color: #856404;
          font-weight: 500;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .detail-row .label {
          color: #6c757d;
          font-weight: 500;
        }

        .detail-row .value {
          color: #333;
          font-weight: 600;
        }

        .detail-row .current-price {
          color: #28a745;
          font-size: 13px;
        }

        .product-additional-info {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .stock-badge {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .stock-badge.in-stock {
          background: #d4edda;
          color: #155724;
        }

        .stock-badge.out-of-stock {
          background: #f8d7da;
          color: #721c24;
        }

        .featured-badge {
          font-size: 12px;
          background: #fff3cd;
          color: #856404;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .detail-row.total-row {
          padding-top: 8px;
          border-top: 1px solid #e9ecef;
          margin-top: 4px;
        }

        .detail-row.total-row .value.total {
          color: #28a745;
          font-size: 16px;
        }

        .items-summary {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .summary-row:last-child {
          margin-bottom: 0;
        }

        .summary-row.total {
          padding-top: 12px;
          border-top: 1px solid #dee2e6;
          margin-top: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #28a745;
        }

        /* Timeline Styles */
        .timeline {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
        }

        .timeline::before {
          content: "";
          position: absolute;
          top: 0;
          left: 20px;
          height: 100%;
          width: 2px;
          background: #dee2e6;
        }

        .timeline li {
          position: relative;
          margin-bottom: 30px;
          padding-left: 50px;
        }

        .timeline-badge {
          position: absolute;
          left: 14px;
          top: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #dee2e6;
          border: 2px solid #fff;
        }

        .timeline-badge.success {
          background: #28a745;
        }

        .timeline-box {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .timeline-panel {
          margin-bottom: 10px;
        }

        .timeline-panel .text-2 {
          margin: 0;
          color: #333;
        }

        .timeline-panel span {
          font-size: 12px;
          color: #6c757d;
        }

        .info-grid {
          display: grid;
          gap: 15px;
        }

        .info-item strong {
          color: #495057;
          font-size: 14px;
        }

        .tracking-section {
          min-height: 200px;
        }

        .tracking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding: 20px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .tracking-title h6 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .tracking-number {
          font-size: 14px;
          color: #6c757d;
        }

        .refresh-btn {
          background: white;
          color: #333;
          border: 1px solid #dee2e6;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .refresh-btn:hover:not(:disabled) {
          border-color: #333;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-icon {
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .refresh-icon.spinning {
          animation: spin 1s linear infinite;
        }

        .tracking-loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .tracking-error {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .tracking-stepper {
          margin-top: 20px;
        }

        .summary-stepper {
          margin-bottom: 40px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #dee2e6;
        }

        .summary-stepper h6 {
          margin-bottom: 24px;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          text-align: center;
        }

        .stepper-horizontal {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          padding: 20px 0;
        }

        .stepper-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
          max-width: 200px;
        }

        .step-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 3px solid #dee2e6;
          margin-bottom: 12px;
          z-index: 2;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stepper-step.completed .step-circle {
          background: #28a745;
          border-color: #28a745;
          transform: scale(1.1);
        }

        .stepper-step.active .step-circle {
          background: white;
          border-color: #007bff;
          border-width: 4px;
          animation: pulse 2s ease-in-out infinite;
        }

        .step-icon {
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stepper-step.completed .step-icon {
          color: white;
          font-size: 16px;
          font-weight: bold;
        }

        .stepper-step.active .step-icon {
          color: #007bff;
        }

        .step-info {
          text-align: center;
          max-width: 100%;
        }

        .step-label {
          font-size: 14px;
          font-weight: 600;
          color: #6c757d;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .stepper-step.completed .step-label,
        .stepper-step.active .step-label {
          color: #333;
        }

        .step-description {
          font-size: 12px;
          color: #6c757d;
          line-height: 1.2;
          opacity: 0.8;
        }

        .stepper-step.completed .step-description,
        .stepper-step.active .step-description {
          opacity: 1;
        }

        .step-connector {
          position: absolute;
          top: 24px;
          left: 50%;
          right: -50%;
          height: 3px;
          background: #dee2e6;
          z-index: 1;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .step-connector.completed {
          background: linear-gradient(90deg, #28a745, #20c997);
        }

        .stepper-step:last-child .step-connector {
          display: none;
        }

        .detail-stepper {
          margin-top: 40px;
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .detail-stepper h6 {
          margin-bottom: 24px;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          text-align: center;
        }

        .stepper-vertical {
          position: relative;
        }

        .stepper-vertical::before {
          content: "";
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #007bff, #28a745);
          border-radius: 1px;
        }

        .stepper-step-vertical {
          position: relative;
          padding-left: 60px;
          margin-bottom: 24px;
        }

        .step-indicator-vertical {
          position: absolute;
          left: 12px;
          top: 8px;
        }

        .step-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #007bff;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #007bff, 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .step-number {
          font-size: 8px;
          font-weight: bold;
          color: white;
        }

        .step-content-vertical {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .step-content-vertical:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #007bff;
        }

        .step-header-vertical {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .step-header-vertical h5 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .step-date {
          font-size: 12px;
          color: #6c757d;
          white-space: nowrap;
          margin-left: 12px;
        }

        .thai-title {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 8px;
          font-style: italic;
        }

        .step-location {
          font-size: 14px;
          color: #007bff;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .step-details {
          font-size: 14px;
          color: #495057;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .delivery-info {
          font-size: 13px;
          color: #28a745;
          margin-bottom: 4px;
        }

        .signature-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e9ecef;
        }

        .signature-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #007bff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border: 1px solid #007bff;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .signature-link:hover {
          background: #007bff;
          color: white;
          text-decoration: none;
        }

        .no-tracking {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .no-tracking-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-tracking h6 {
          color: #495057;
          margin-bottom: 8px;
        }

        .no-tracking p {
          font-size: 14px;
          margin: 0;
        }

        /* Payment Details Formatting */
        .payment-details-formatted {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          margin-top: 8px;
        }

        .payment-details-formatted > div {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.4;
        }

        .payment-details-formatted > div:last-child {
          margin-bottom: 0;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.completed {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.failed {
          background: #f8d7da;
          color: #721c24;
        }

        .payment-details-formatted strong {
          color: #495057;
          margin-right: 4px;
        }

        @media (max-width: 768px) {
          .widget-menu-tab {
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
          }

          .widget-menu-tab .item-title {
            padding: 10px 15px;
            font-size: 14px;
          }

          .tf-grid-layout {
            grid-template-columns: 1fr;
          }

          .tracking-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .order-item {
            margin-bottom: 16px;
          }

          .item-content {
            flex-direction: column;
            padding: 16px;
            gap: 16px;
          }

          .product-image-section {
            align-self: center;
          }

          .product-image-container,
          .product-image-placeholder {
            width: 100px;
            height: 100px;
          }

          .product-name {
            font-size: 16px;
          }

          .product-meta {
            justify-content: flex-start;
          }

          .detail-row {
            font-size: 13px;
          }

          .items-summary {
            padding: 16px;
          }
        }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

`;

export default orderDetailsStyles;
