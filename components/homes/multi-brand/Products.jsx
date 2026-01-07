"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Card,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";

import farmsukImg1 from "../../../public/images/farmsuk1.png";
import farmsukImg2 from "../../../public/images/farmsuk2.png";
import farmsukImg3 from "../../../public/images/farmsuk3.png";

// Sample blog data with mockup images
const blogPosts = [
  {
    id: 1,
    image: farmsukImg1,
  },
  {
    id: 2,
    image: farmsukImg2,
  },
  {
    id: 3,
    image: farmsukImg3,
  },
];

export default function BlogSection() {
  const { t } = useTranslation();
  const swiperRef = useRef(null);

  return (
    <Box
      sx={{
        py: { xs: 3, sm: 4, md: 6, lg: 8 },
        bgcolor: "grey.100",
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: { xs: 2, sm: 2.5, md: 3 },
              textAlign: "center",
              fontWeight: "bold",
              fontSize: {
                xs: "1.5rem",
                sm: "1.8rem",
                md: "2.2rem",
                lg: "2.5rem",
                xl: "3rem",
              },
              px: { xs: 1, sm: 2 },
            }}
          >
            {t("products.title")}
          </Typography>
        </motion.div>

        {/* Section Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
                md: "1.1rem",
                lg: "1.2rem",
                xl: "1.3rem",
              },
              mb: { xs: 4, sm: 5, md: 6, lg: 8 },
              textAlign: "center",
              color: "text.secondary",
              lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
              px: { xs: 2, sm: 3, md: 4 },
              maxWidth: { xs: "100%", sm: "95%", md: "90%", lg: "85%" },
              mx: "auto",
            }}
          >
            {t("products.description")}
          </Typography>
        </motion.div>

        {/* Swiper Container */}
        <Box
          sx={{
            px: { xs: 0, sm: 1, md: 2 },
            "& .swiper": {
              pb: { xs: 3, sm: 4 },
            },
            "& .swiper-pagination": {
              bottom: "0px !important",
              "& .swiper-pagination-bullet": {
                width: "10px",
                height: "10px",
                mx: "3px",
              },
            },
          }}
        >
          <Swiper
            ref={swiperRef}
            dir="ltr"
            slidesPerView={1}
            spaceBetween={45}
            centeredSlides={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.2,
                spaceBetween: 55,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 1.5,
                spaceBetween: 60,
                centeredSlides: true,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 70,
                centeredSlides: false,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 80,
                centeredSlides: false,
              },
            }}
            modules={[Pagination]}
            navigation={false}
          >
            {blogPosts.map((post, i) => (
              <SwiperSlide key={post.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 3,
                    mx: 2,
                    my: 2,
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: 450,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      "&:hover": {
                        "& img": {
                          transform: "scale(1.1)",
                        },
                      },
                    }}
                  >
                    <Image
                      src={post.image}
                      alt={`FarmSuk Image ${post.id}`}
                      width={400}
                      height={250}
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 45vw, 30vw"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                        transition: "transform 0.3s ease",
                      }}
                      priority={i < 2}
                    />
                  </Box>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </Box>
  );
}
