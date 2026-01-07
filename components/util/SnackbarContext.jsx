"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({
    message: "",
    severity: "info", // 'success' | 'error' | 'warning' | 'info'
    duration: 3000,
  });

  const showSnackbar = useCallback(
    (message, severity = "info", duration = 3000) => {
      setConfig({ message, severity, duration });
      setOpen(true);
    },
    []
  );

  const handleClose = (event, reason) => {
    // ป้องกันการปิดเมื่อคลิกพื้นที่ว่างๆ รอบๆ (Clickaway)
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={config.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // กำหนดตำแหน่งมุมขวาล่างตรงนี้
        sx={{ zIndex: 9999 }} // ให้ลอยอยู่เหนือทุกอย่าง
      >
        <Alert
          onClose={handleClose}
          severity={config.severity}
          variant="filled" // ใช้แบบ filled สีจะชัด (ถ้าชอบแบบจางๆ ให้เปลี่ยนเป็น "standard")
          sx={{ width: "100%", minWidth: "300px", boxShadow: 3 }}
        >
          {config.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

// Hook สำหรับเรียกใช้
export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}
