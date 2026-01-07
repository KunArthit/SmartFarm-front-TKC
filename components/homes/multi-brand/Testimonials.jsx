"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import img1 from "../../../public/images/item/quote.svg";
import img2 from "../../../public/images/collections/vision.png";

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <>
      <style jsx>{`
        .testimonial-desktop {
          display: flex;
          flex-direction: row;
          gap: 3rem;
          padding: 0 8rem;
        }

        .box-left {
          width: 70%;
          padding: 6rem 1rem 4rem 5rem;
        }

        .box-right {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.5rem 0;
        }

        .vision-title {
          color: black;
          font-size: 3.75rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .description-text {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #1f2937;
        }

        .rating-stars {
          margin-bottom: 1rem;
          color: #fbbf24;
        }

        .image-wrapper {
          width: 100%;
          max-width: 550px;
          margin-bottom: -1.5rem;
        }

        .icon {
          margin-bottom: 1rem;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 768px) {
          .testimonial-desktop {
            display: none;
          }

          .mobile-only {
            display: block;
            padding: 1rem;
          }

          .mobile-text {
            margin-bottom: 2rem;
          }

          .mobile-title {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 1rem;
            color: black;
          }

          .mobile-description {
            font-size: 1rem;
            color: #1f2937;
            line-height: 1.7;
          }

          .mobile-image {
            width: 100%;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }
        }
      `}</style>

      {/* Desktop Layout */}
      <section
        className="flat-testimonial-v2 py-0 wow fadeInUp"
        data-wow-delay="0s"
      >
        <div className="testimonial-desktop">
          {/* LEFT */}
          <div className="box-left">
            <div className="testimonial-item">
              <div className="icon">
                <Image src={img1} alt="quote-icon" width={37} height={25} />
              </div>
              <h1 className="vision-title">{t("vision.Vision")}</h1>
              <div className="rating-stars">
                <i className="icon-start" />
                <i className="icon-start" />
                <i className="icon-start" />
                <i className="icon-start" />
                <i className="icon-start" />
              </div>
              <div className="description-text">
                <p className="mb-4">{t("vision.description1")}</p>
                <p className="mb-4">{t("vision.description2")}</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="box-right">
            <div className="image-wrapper">
              <Image
                src={img2}
                alt="Vision"
                width={800}
                height={600}
                layout="responsive"
                style={{
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Layout */}
      <section className="mobile-only">
        <div className="mobile-text">
          <h1 className="mobile-title">Vision</h1>
          <p className="mobile-description mb-4">{t("vision.description1")}</p>
          <p className="mobile-description mb-4">{t("vision.description2")}</p>
        </div>
        <div className="mobile-image">
          <Image
            src={img2}
            alt="Vision"
            width={800}
            height={600}
            layout="responsive"
          />
        </div>
      </section>
    </>
  );
}
