import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { remove } from "../../service/otherService/localStorage";

function Sidebar() {
  const location = useLocation();

  const handleLogout = () => {
    console.log("Đang thực hiện đăng xuất...");
    remove();
    window.location.href = "/login";
  };

  return (
    <Box
      align={"left"}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        minWidth: 250,
        height: "100vh",
        paddingTop: 2,
        paddingBottom: 2,
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        zIndex: 1000,
      }}
    >
      <Link to="/home" style={{ textDecoration: "none" }}>
        <Button
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            paddingLeft: 4,
            height: "60px",
            textTransform: "none",
            color: location.pathname === "/home" ? "#1976d2" : "#464646",
            fontWeight: location.pathname === "/home" ? "bold" : "normal",
            backgroundColor:
              location.pathname === "/home" ? "#cee2f5" : "transparent",
          }}
        >
          <HomeIcon sx={{ marginRight: 2 }} />
          <Typography>Trang chủ</Typography>
        </Button>
      </Link>

      <Link to="/doctor/schedule-management" style={{ textDecoration: "none" }}>
        <Button
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            paddingLeft: 4,
            height: "60px",
            textTransform: "none",
            color:
              location.pathname === "/doctor/schedule-management"
                ? "#1976d2"
                : "#464646",
            fontWeight:
              location.pathname === "/doctor/schedule-management"
                ? "bold"
                : "normal",
            backgroundColor:
              location.pathname === "/doctor/schedule-management"
                ? "#cee2f5"
                : "transparent",
          }}
        >
          <CalendarTodayIcon sx={{ marginRight: 2 }} />
          <Typography>Quản lý lịch khám</Typography>
        </Button>
      </Link>

      <Link to="/doctor/patient-management" style={{ textDecoration: "none" }}>
        <Button
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            paddingLeft: 4,
            height: "60px",
            textTransform: "none",
            color:
              location.pathname === "/doctor/patient-management"
                ? "#1976d2"
                : "#464646",
            fontWeight:
              location.pathname === "/doctor/patient-management"
                ? "bold"
                : "normal",
            backgroundColor:
              location.pathname === "/doctor/patient-management"
                ? "#cee2f5"
                : "transparent",
          }}
        >
          <GroupIcon sx={{ marginRight: 2 }} />
          <Typography>Quản lý bệnh nhân</Typography>
        </Button>
      </Link>
      <Link
        to="/doctor/appointment-management"
        style={{ textDecoration: "none" }}
      >
        <Button
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            paddingLeft: 4,
            height: "60px",
            textTransform: "none",
            color:
              location.pathname === "/doctor/appointment-management"
                ? "#1976d2"
                : "#464646",
            fontWeight:
              location.pathname === "/doctor/appointment-management"
                ? "bold"
                : "normal",
            backgroundColor:
              location.pathname === "/doctor/appointment-management"
                ? "#cee2f5"
                : "transparent",
          }}
        >
          <DescriptionIcon sx={{ marginRight: 2 }} />
          <Typography>Quản lý lịch hẹn</Typography>
        </Button>
      </Link>
      <Link
        to="/doctor/manage-appointment-history"
        style={{ textDecoration: "none" }}
      >
        <Button
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            paddingLeft: 4,
            height: "60px",
            textTransform: "none",
            color:
              location.pathname === "/doctor/manage-appointment-history"
                ? "#1976d2"
                : "#464646",
            fontWeight:
              location.pathname === "/doctor/manage-appointment-history"
                ? "bold"
                : "normal",
            backgroundColor:
              location.pathname === "/doctor/manage-appointment-history"
                ? "#cee2f5"
                : "transparent",
          }}
        >
          <HistoryIcon sx={{ marginRight: 2 }} />
          <Typography>Lịch sử khám</Typography>
        </Button>
      </Link>
      <Link to="/profile" style={{ textDecoration: "none" }}>
        <Button
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            paddingLeft: 4,
            height: "60px",
            textTransform: "none",
            color: location.pathname === "/profile" ? "#1976d2" : "#464646",
            fontWeight: location.pathname === "/profile" ? "bold" : "normal",
            backgroundColor:
              location.pathname === "/profile" ? "#cee2f5" : "transparent",
          }}
        >
          <Avatar
            src="https://example.com/your-avatar.jpg"
            alt="User Avatar"
            sx={{ width: 25, height: 25, marginRight: 2 }}
          />
          <Typography>Trang cá nhân</Typography>
        </Button>
      </Link>
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
        onClick={handleLogout}
      >
        <ExitToAppIcon sx={{ marginRight: 2 }} />
        <Typography>Đăng xuất</Typography>
      </Button>
    </Box>
  );
}

export default Sidebar;
