import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";

const PatientLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <HeaderComponent />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Outlet />
      </Box>
      <FooterComponent />
    </Box>
  );
};

export default PatientLayout;
