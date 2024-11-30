import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import images from "../../constants/images";
import React, { useEffect, useState } from "react";
import { remove, getImg } from "../../service/otherService/localStorage";
import { useNavigate } from "react-router-dom";

const HeaderComponent = ({ userInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [img, setImg] = useState(""); // State to hold user info
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open menu when hovering over img
  };

  const handleMenuClose = (event) => {
    // Kiểm tra nếu chuột vẫn ở trong menu
    setAnchorEl(null); // Đóng menu
  };

  const handleLogout = () => {
    // event.stopPropagation(); // Prevent the menu from closing when clicking logout
    console.log("Đang thực hiện đăng xuất..."); // Log for checking
    remove(); // Call remove to delete token
    handleMenuClose(); // Close menu after logout
    window.location.href = "/login";
  };

  const viewInfo = () => {
    navigate("/user-detail");
  };

  const getInfo = () => {
    const storedUserInfo = getImg();
    if (storedUserInfo) {
      setImg(storedUserInfo); // Parse and set user info if it exists
    }
  };

  useEffect(() => {
    getInfo();
  }, [userInfo]);

  return (
    <Box sx={{ backgroundColor: "white", paddingY: 2 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          maxWidth: 1200,
          margin: "0 auto",
          px: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img
            src={images.logo}
            alt="Logo"
            style={{ width: 60, height: 60, borderRadius: "50%" }}
          />
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  fontWeight: "bold",
                  backgroundColor:
                    location.pathname === "/home" ? "#FAC41C" : "transparent", // Active background color
                  color: location.pathname === "/home" ? "white" : "black", // Active text color
                  "&:hover": {
                    backgroundColor: "#FAC41C",
                    color: "white",
                  },
                }}
              >
                Trang chủ
              </Button>
            </Link>
            <Link to="/team-of-doctors" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  fontWeight: "bold",
                  backgroundColor:
                    location.pathname === "/team-of-doctors"
                      ? "#FAC41C"
                      : "transparent", // Active background color
                  color:
                    location.pathname === "/team-of-doctors"
                      ? "white"
                      : "black", // Active text color
                  "&:hover": {
                    backgroundColor: "#FAC41C",
                    color: "white",
                  },
                }}
              >
                Đội ngũ bác sĩ
              </Button>
            </Link>
            <Link to="/user-detail" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  fontWeight: "bold",
                  backgroundColor:
                    location.pathname === "/user-detail"
                      ? "#FAC41C"
                      : "transparent", // Active background color
                  color:
                    location.pathname === "/user-detail" ? "white" : "black", // Active text color
                  "&:hover": {
                    backgroundColor: "#FAC41C",
                    color: "white",
                  },
                }}
              >
                Trang cá nhân
              </Button>
            </Link>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  fontWeight: "bold",
                  backgroundColor:
                    location.pathname === "/articles"
                      ? "#FAC41C"
                      : "transparent", // Active background color
                  color: location.pathname === "/articles" ? "white" : "black", // Active text color
                  "&:hover": {
                    backgroundColor: "#FAC41C",
                    color: "white",
                  },
                }}
              >
                Bài viết
              </Button>
            </Link>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="primary">
              <NotificationsNoneIcon />
            </IconButton>

            <Link
              to={img ? "/user-detail" : "/login"}
              style={{ textDecoration: "none" }}
              onClick={img ? viewInfo : undefined}
            >
              {img ? ( // Display user avatar if userInfo exists
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ mt: 0 }}
                  onMouseEnter={handleMenuOpen}
                  onMouseLeave={handleMenuClose}
                >
                  <img
                    src={img}
                    alt="User Icon"
                    style={{
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      marginRight: "8px",
                    }}
                  />
                  <Menu
                    className="menu-container"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onMouseEnter={() => setAnchorEl(anchorEl)} // Duy trì mở
                    onMouseLeave={handleMenuClose} // Đóng khi rời khỏi
                  >
                    <MenuItem
                      onClick={viewInfo}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#FAC41C",
                          color: "white",
                        },
                      }}
                    >
                      Xem thông tin cá nhân
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#FAC41C",
                          color: "white",
                        },
                      }}
                    >
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                // Show login button if userInfo does not exist
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "20px" }}
                >
                  Đăng nhập
                </Button>
              )}
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeaderComponent;
