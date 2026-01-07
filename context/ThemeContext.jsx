"use client";

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const ThemeContext = createContext(null);

const defaultTheme = {
  primaryColor: "#007bff",
  secondaryColor: "#6c757d",
  backgroundColor: "#ffffff",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await axios.get(`${apiEndpoint}/themes`);
        setTheme({
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          backgroundColor: data.backgroundColor,
        });
        // console.log("Theme fetched:", data);
      } catch (error) {
        console.error("Failed to fetch theme:", error);
      }
    };

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };