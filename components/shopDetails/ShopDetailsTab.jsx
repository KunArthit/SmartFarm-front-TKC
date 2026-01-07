"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';




export default function ShopDetailsTab({ product }) {
  const [currentTab, setCurrentTab] = useState(1);
  const { t } = useTranslation();

  const productData = product || defaultProduct;

  const tabs = [
    { title: t('info.Description'), active: true },
    { title: t('info.ShippingInfo'), active: false },
    { title: t('info.ReturnPolicy'), active: false },
  ];

  return (
    <section
      className="flat-spacing-17 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="widget-tabs style-has-border">
              <ul className="widget-menu-tab">
                {tabs.map((elm, i) => (
                  <li
                    key={i}
                    onClick={() => setCurrentTab(i + 1)}
                    className={`item-title ${
                      currentTab === i + 1 ? "active" : ""
                    }`}
                  >
                    <span className="inner">{elm.title}</span>
                  </li>
                ))}
              </ul>

              <div className="widget-content-tab">
                {/* Description */}
                <div
                  className={`widget-content-inner ${
                    currentTab === 1 ? "active" : ""
                  }`}
                >
                  <div className="">
                    <p className="mb_30">
                      {productData.description}
                    </p>
                  </div>
                </div>

                {/* Shipping Info - แก้ไขจาก currentTab === 3 เป็น currentTab === 2 */}
                <div
                  className={`widget-content-inner ${
                    currentTab === 2 ? "active" : ""
                  }`}
                >
                  <div className="tf-page-privacy-policy">
                    <div className="title">{t('info.ShippingInfomation')}</div>
                    <p>
                    {t('info.info1')}
                    </p>
                    <p><strong>{t('info.ShippingOptions')}:</strong></p>
                    <ul>
                      <li><strong>{t('info.ShippingOptions')}:</strong> {t('info.Standardinfo')}</li>
                      <li><strong>{t('info.ExpressShipping')}:</strong> {t('info.Expressinfo')}</li>
                      <li><strong>{t('info.NextDayDelivery')}:</strong> {t('info.NextDayDeliveryinfo')}</li>
                    </ul>
                    <p>
                    {t('info.info2')}
                    </p>
                  </div>
                </div>

                {/* Return Policy - แก้ไขจาก currentTab === 4 เป็น currentTab === 3 */}
                <div
                  className={`widget-content-inner ${
                    currentTab === 3 ? "active" : ""
                  }`}
                >
                  <div className="tf-page-privacy-policy">
                    <div className="title">{t('info.ReturnPolicyInfo')}</div>
                    <p>
                    {t('info.ReturnInfo')}
                    </p>
                    <p><strong>{t('info.ReturnConditions')}:</strong></p>
                    <ul>
                      <li>{t('info.ReturnInfo1')}</li>
                      <li>{t('info.ReturnInfo2')}</li>
                      <li>{t('info.ReturnInfo3')}</li>
                      <li>{t('info.ReturnInfo4')}</li>
                    </ul>
                    <p><strong>{t('info.WarrantyCoverage')}:</strong></p>
                    <ul>
                      <li>{t('info.WarrantyInfo1')}</li>
                      <li>{t('info.WarrantyInfo2')}</li>
                      <li>{t('info.WarrantyInfo3')}</li>
                    </ul>
                    <p>
                    {t('info.WarrantyInfo4')}
                    </p>
                    <p>
                    {t('info.WarrantyInfo5')}
                    </p>
                    <p>
                      <strong>{t('info.Questions')}</strong> {t('info.Contactusat')}: <strong>tkc@tsi.com</strong>
                    </p>
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