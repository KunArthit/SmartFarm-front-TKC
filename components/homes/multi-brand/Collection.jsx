"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Logo from "../../../public/images/collections/farmsuk01.png";

export default function Collection() {
  const { t } = useTranslation();

  return (
    <>
      <style jsx>{`
        .collection-container {
          display: flex;
          flex-direction: row;
          gap: 0;
        }

        .box-left {
          width: 50%;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .box-right {
          width: 50%;
          padding: 9rem 0;
        }

        .title {
          color: #111827;
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .description {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #374151;
        }

        .image-wrapper {
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 550px;
          aspect-ratio: 1 / 1;
          margin: 0 auto;
          background-color: transparent; /* เพิ่มไว้ให้ชัดเจนว่าไม่มีพื้นหลัง */
        }

        @media (max-width: 768px) {
          .collection-container {
            flex-direction: column;
          }

          .box-left,
          .box-right {
            width: 100%;
            padding: 2rem 0;
          }

          .title {
            font-size: 2rem;
          }

          .description {
            font-size: 1rem;
          }

          .image-wrapper {
            max-width: 100%;
            aspect-ratio: 1 / 1;
          }
        }
      `}</style>

      <section
        style={{
          backgroundColor: "#f3f4f6",
          padding: "10px 20px 100px",
        }}
      >
        <div className="container">
          <div className="collection-container">
            {/* LEFT - Image */}
            <div className="box-left">
              <div className="image-wrapper">
                <Image
                  src={Logo}
                  alt="smart-solution-img"
                  width={600}
                  height={600}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              </div>
            </div>

            {/* RIGHT - Content */}
            <div className="box-right">
              <h2 className="title">{t("collection.title")}</h2>
              <p className="description">{t("collection.description")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
