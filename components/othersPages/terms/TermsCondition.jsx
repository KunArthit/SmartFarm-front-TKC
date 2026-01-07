// components/othersPages/terms/TermsCondition.jsx
"use client";

import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import BusinessIcon from "@mui/icons-material/Business";
import { useTranslation } from "react-i18next";

export default function TermsConditionPage() {
  const { t } = useTranslation();

  // สร้าง sections หลังได้ t แล้ว (ป้องกัน ReferenceError)
  const termsSections = React.useMemo(
    () => [
      { title: t("termscondition.title1"), content: t("termscondition.content1") },
      { title: t("termscondition.title2"), content: t("termscondition.content2") },
      { title: t("termscondition.title3"), content: t("termscondition.content3") },
      { title: t("termscondition.title4"), content: t("termscondition.content4") },
      { title: t("termscondition.title5"), content: t("termscondition.content5") },
    ],
    [t]
  );

  return (
    <Container maxWidth="md" sx={{ my: { xs: 3, md: 5 } }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
        >
          {t("termscondition.TermsandConditionsofUse")}
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          {t("termscondition.lastupdated")}
        </Typography>

        {termsSections.map((section, index) => (
          <Box key={index} sx={{ mb: 3.5 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              {section.title}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: "text.secondary", textAlign: "justify", lineHeight: 1.8 }}
            >
              {section.content}
            </Typography>
          </Box>
        ))}

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
            {t("termscondition.contectus")}
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "text.secondary", mb: 2 }}>
            {t("termscondition.youquestion")}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('termscondition.email')} secondary="support@[your-domain].com" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LinkIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('termscondition.website')} secondary="[your-website].com/contact" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('termscondition.address')} secondary={t('termscondition.address2')} />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
}
