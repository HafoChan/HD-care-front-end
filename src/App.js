import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box } from "@mui/material";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
  return (
    <Router>
      <NotificationProvider>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Box sx={{ flex: 1 }}>
            <AppRouter />
          </Box>
          <ToastContainer />
        </Box>
      </NotificationProvider>
    </Router>
  );
};

export default App;
