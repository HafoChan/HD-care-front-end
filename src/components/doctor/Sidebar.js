import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ChatIcon from "@mui/icons-material/Chat";
import { remove } from "../../service/otherService/localStorage";
import images from "../../constants/images";

function Sidebar() {
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = () => {
    console.log("Đang thực hiện đăng xuất...");
    remove();
    window.location.href = "/login";
  };

  const menuItems = [
    {
      title: "Trang chủ",
      path: "/home",
      icon: <HomeIcon />,
    },
    {
      title: "Quản lý lịch khám",
      path: "/doctor/schedule-management",
      icon: <CalendarTodayIcon />,
    },
    {
      title: "Quản lý bệnh nhân",
      path: "/doctor/patient-management",
      icon: <GroupIcon />,
    },
    {
      title: "Quản lý lịch hẹn",
      path: "/doctor/appointment-management",
      icon: <DescriptionIcon />,
    },
    {
      title: "Lịch sử khám",
      path: "/doctor/manage-appointment-history",
      icon: <HistoryIcon />,
    },
    {
      title: "Quản lý đơn thuốc",
      path: "/doctor/prescription-management",
      icon: <MedicalServicesIcon />,
    },
    {
      title: "Tin nhắn",
      path: "/doctor_chat",
      icon: <ChatIcon />,
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        width: 280,
        height: "100vh",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.9)
            : theme.palette.background.paper,
        zIndex: 1200,
        borderRight: "1px solid",
        borderColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.12)
            : alpha(theme.palette.common.black, 0.08),
        overflowY: "auto",
      }}
    >
      {/* Logo and Brand */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.12)
              : alpha(theme.palette.common.black, 0.08),
        }}
      >
        <Box
          component="img"
          src={images.logo}
          alt="HD-Care Logo"
          sx={{
            height: 60,
            width: 60,
            borderRadius: "50%",
            mr: 2,
          }}
        />
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            HD-Care
          </Typography>
          <Typography variant="caption" fontWeight={500} color="text.secondary">
            Bác sĩ chuyên khoa
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ pt: 2, px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              disablePadding
              sx={{
                mb: 1,
                borderRadius: 3,
                overflow: "hidden",
                textDecoration: "none",
              }}
            >
              <Button
                fullWidth
                startIcon={
                  <Box
                    sx={{
                      color: isActive
                        ? "#fff"
                        : alpha(theme.palette.text.primary, 0.7),
                      minWidth: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                }
                sx={{
                  py: 1.5,
                  px: 2,
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: isActive ? 600 : 500,
                  borderRadius: 3,
                  color: isActive ? "#fff" : "text.primary",
                  backgroundColor: isActive
                    ? theme.palette.primary.main
                    : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: isActive
                      ? theme.palette.primary.dark
                      : alpha(theme.palette.primary.main, 0.08),
                    transform: "translateX(5px)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    ml: 0.5,
                    flex: 1,
                    textAlign: "left",
                    fontWeight: "inherit",
                  }}
                >
                  {item.title}
                </Typography>
              </Button>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Footer actions */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
          sx={{
            py: 1.2,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          Đăng xuất
        </Button>

        <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          HD-Care © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}

export default Sidebar;
