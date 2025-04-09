import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterComponent from "./components/patient/FooterComponent";
import { Box } from "@mui/material";

const App = () => {
  return (
    <Router>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box sx={{ flex: 1 }}>
          <AppRouter />
        </Box>
        <FooterComponent />
        <ToastContainer />
      </Box>
    </Router>
  );
};

export default App;
