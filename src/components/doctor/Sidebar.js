import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function Sidebar() {
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
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
      >
        <HomeIcon sx={{ marginRight: 2 }} />
        <Typography>Trang chủ</Typography>
      </Button>
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
      >
        <GroupIcon sx={{ marginRight: 2 }} />
        <Typography>Quản lý bệnh nhân</Typography>
      </Button>
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
      >
        <CalendarTodayIcon sx={{ marginRight: 2 }} />
        <Typography>Quản lý lịch khám</Typography>
      </Button>
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
      >
        <DescriptionIcon sx={{ marginRight: 2 }} />
        <Typography>Quản lý lịch hẹn</Typography>
      </Button>
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
      >
        <EditIcon sx={{ marginRight: 2 }} />
        <Typography>Kê đơn thuốc</Typography>
      </Button>
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
      >
        <HistoryIcon sx={{ marginRight: 2 }} />
        <Typography>Lịch sử khám</Typography>
      </Button>
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
      >
        <Avatar
          src="https://example.com/your-avatar.jpg"
          alt="User Avatar"
          sx={{ width: 25, height: 25, marginRight: 2 }}
        />
        <Typography>Trang cá nhân</Typography>
      </Button>
      <Button
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          paddingLeft: 4,
          height: "60px",
          textTransform: "none",
          color: "#464646",
        }}
      >
        <ExitToAppIcon sx={{ marginRight: 2 }} />
        <Typography>Đăng xuất</Typography>
      </Button>
    </Box>
  );
}

export default Sidebar;