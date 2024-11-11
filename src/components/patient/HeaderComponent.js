import React from "react";
import { AppBar, Toolbar, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import images from "../../constants/images";

const HeaderComponent = ({ selectedTab, handleTabClick }) => {
  return (
    <Box sx={{ backgroundColor: "white", paddingY: 2 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img
            src={images.logo}
            alt="Logo"
            style={{ width: 60, height: 60, borderRadius: "50%" }}
          />
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Trang chủ", "Về chúng tôi", "Đội ngũ bác sĩ", "Bài viết"].map(
              (tab) => (
                <Button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor:
                      selectedTab === tab ? "#FAC41C" : "transparent",
                    color: selectedTab === tab ? "white" : "black",
                    "&:hover": {
                      backgroundColor: "#FAC41C",
                      color: "white",
                    },
                  }}
                >
                  {tab}
                </Button>
              )
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: "20px" }}
              >
                Đăng nhập
              </Button>
            </Link>
            <IconButton color="primary">
              <NotificationsNoneIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeaderComponent;
