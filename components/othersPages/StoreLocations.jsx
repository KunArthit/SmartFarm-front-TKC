"use client";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

export default function StoreLocations() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(1);

  return (
    <section className="flat-spacing-16">
      <div className="container">
        <div className="row widget-tabs">
          <div className="col-xl-4 col-md-5 col-12">
            <div className="tf-store-list d-flex gap-10 flex-column widget-menu-tab">
              <div
                className={`tf-store-item item-title ${activeTab == 1 ? "active" : ""} default`}
                onClick={() => setActiveTab(1)}
              >
                <h6 className="tf-store-title">
                  <div className="icon">
                    <i className="icon-place" />
                  </div>
                  TKC Bangkok
                </h6>

                <div className="tf-store-info">
                  <span>{t("stor.address")}</span>
                  <p>{t("stor.location")}</p>
                </div>

                <div className="tf-store-info">
                  <span>{t("stor.phone")}</span>
                  <p>(+66) 0-2401-8222</p>
                </div>

                <div className="tf-store-info">
                  <span>{t("stor.email")}</span>
                  <p>TKC.bangkok@example.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-8 col-md-7 col-12">
            <div className="widget-content-tab">
              <div className={`widget-content-inner ${activeTab == 1 ? "active" : ""} p-0`}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15494.384840875548!2d100.580585!3d13.8632598!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d2eadd6f601%3A0xa4fa9387232a08f4!2sTKC%20Turnkey%20Communication%20Services%20Public%20Company%20Limited!5e0!3m2!1sen!2sth!4v1752475775863!5m2!1sen!2sth"
                  width="100%"
                  height={978}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .widget-content-inner {
          display: none;
        }

        .tf-store-item {
          background: linear-gradient(135deg, #2e8b57 0%, #c1e1c1 100%);
          color: #faf9f6;
          border-radius: 12px;
          padding: 16px;
          transition: transform 0.2s ease;
        }

        .tf-store-item:hover {
          transform: translateY(-3px);
        }

        .tf-store-item h6,
        .tf-store-item span,
        .tf-store-item p {
          color: #faf9f6;
        }

        .tf-store-info {
          margin-top: 8px;
        }
      `}</style>
    </section>
  );
}
