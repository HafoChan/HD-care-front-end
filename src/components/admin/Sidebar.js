import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import {
  MdDashboard,
  MdLocalHospital,
  MdPeople,
  MdInsertChart,
} from "react-icons/md";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArticleIcon from "@mui/icons-material/Article";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useNavigate, useLocation } from "react-router-dom";

const StyledDrawer = styled("div")(() => ({
  minWidth: 280,
  flexShrink: 0,
  backgroundColor: "#ffffff",
  borderRight: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
  height: "100vh",
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
  overflowY: "auto",
  maxWidth: "280px", // Đảm bảo không bị mở rộng
  whiteSpace: "nowrap", // Ngăn văn bản dài bị xuống dòng và làm rộng phần tử
}));

const StyledListItem = styled(ListItem)(({ selected }) => ({
  margin: "6px 16px",
  borderRadius: "10px",
  backgroundColor: selected ? "rgba(25, 118, 210, 0.08)" : "transparent",
  padding: "10px 16px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.04)",
    cursor: "pointer",
  },
}));

const LogoSection = styled(Box)(() => ({
  padding: "24px 20px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  marginBottom: 10,
}));

const NavSection = styled(Box)(() => ({
  flex: 1,
  overflowY: "auto",
}));

const BottomSection = styled(Box)(() => ({
  padding: "16px",
  borderTop: "1px solid rgba(0, 0, 0, 0.06)",
}));

const IconWrapper = styled(Box)(({ active }) => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: active ? "rgba(25, 118, 210, 0.1)" : "transparent",
  transition: "all 0.2s",
}));

const SectionLabel = styled(Typography)(() => ({
  paddingLeft: 24,
  paddingTop: 16,
  paddingBottom: 8,
  display: "block",
  color: "#666666",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  fontSize: "0.75rem",
}));

const Sidebar = ({ activeTab, setActiveTab, onLogout, selectedKey }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use the provided activeTab or selectedKey, or determine from current URL
  const [currentTab, setCurrentTab] = useState(() => {
    if (activeTab) return activeTab;
    if (selectedKey) return selectedKey;

    // Determine tab from URL path
    const path = location.pathname;
    if (path.includes("/statistics")) return "statistics";
    if (path.includes("/news-management")) return "news";
    if (path.includes("/reported-posts")) return "reported-posts";
    return "dashboard";
  });

  // Update currentTab when props change
  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    } else if (selectedKey) {
      setCurrentTab(selectedKey);
    }
  }, [activeTab, selectedKey]);

  // Tab routes mapping
  const tabRoutes = {
    dashboard: "/admin",
    statistics: "/admin/statistics",
    news: "/admin/news-management",
    "reported-posts": "/admin/reported-posts",
    doctors: "/admin", // These are internal tabs on the dashboard page
    patients: "/admin", // These are internal tabs on the dashboard page
  };

  // Handle tab click with unified navigation
  const handleTabClick = (tab) => {
    setCurrentTab(tab);

    // Special case for internal dashboard tabs
    if (
      (tab === "doctors" || tab === "patients") &&
      location.pathname === "/admin"
    ) {
      // If we're already on the dashboard, just update the internal state
      if (setActiveTab) {
        setActiveTab(tab);
      }
    } else {
      // Navigate to the appropriate route
      navigate(tabRoutes[tab]);

      // If navigating to dashboard with specific tab
      if (tabRoutes[tab] === "/admin" && tab !== "dashboard") {
        // Need a small delay to ensure the component is mounted before setting state
        setTimeout(() => {
          if (setActiveTab) {
            setActiveTab(tab);
          }
        }, 100);
      }
    }
  };

  return (
    <StyledDrawer sx={{ overflowX: "hidden" }}>
      <LogoSection>
        <Avatar
          src="/logo192.png"
          alt="Logo"
          sx={{ width: 40, height: 40, bgcolor: "#1976d2" }}
        />
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "#1976d2", fontFamily: "serif" }}
        >
          HD-Care Admin
        </Typography>
      </LogoSection>

      <NavSection style={{ overflowX: "hidden" }}>
        <SectionLabel variant="caption">Quản lý chung</SectionLabel>

        <List>
          <StyledListItem
            button
            selected={currentTab === "dashboard"}
            onClick={() => handleTabClick("dashboard")}
          >
            <IconWrapper active={currentTab === "dashboard"}>
              <MdDashboard
                size={20}
                color={currentTab === "dashboard" ? "#1976d2" : "#666"}
              />
            </IconWrapper>
            <ListItemText
              primary="Bảng điều khiển"
              sx={{
                ml: 1.5,
                maxWidth: "100%",
                "& .MuiListItemText-primary": {
                  fontWeight: currentTab === "dashboard" ? 600 : 400,
                  fontSize: "0.95rem",
                  color: currentTab === "dashboard" ? "#1976d2" : "inherit",
                },
              }}
            />
          </StyledListItem>

          <StyledListItem
            button
            selected={currentTab === "statistics"}
            onClick={() => handleTabClick("statistics")}
          >
            <IconWrapper active={currentTab === "statistics"}>
              <MdInsertChart
                size={20}
                color={currentTab === "statistics" ? "#1976d2" : "#666"}
              />
            </IconWrapper>
            <ListItemText
              primary="Quản lý thống kê"
              sx={{
                ml: 1.5,
                maxWidth: "100%",
                "& .MuiListItemText-primary": {
                  fontWeight: currentTab === "statistics" ? 600 : 400,
                  fontSize: "0.95rem",
                  color: currentTab === "statistics" ? "#1976d2" : "inherit",
                },
              }}
            />
          </StyledListItem>

          <SectionLabel variant="caption">Quản lý người dùng</SectionLabel>

          <StyledListItem
            button
            selected={currentTab === "doctors"}
            onClick={() => handleTabClick("doctors")}
          >
            <IconWrapper active={currentTab === "doctors"}>
              <MdLocalHospital
                size={20}
                color={currentTab === "doctors" ? "#1976d2" : "#666"}
              />
            </IconWrapper>
            <ListItemText
              primary="Quản lý bác sĩ"
              sx={{
                ml: 1.5,
                maxWidth: "100%",
                "& .MuiListItemText-primary": {
                  fontWeight: currentTab === "doctors" ? 600 : 400,
                  fontSize: "0.95rem",
                  color: currentTab === "doctors" ? "#1976d2" : "inherit",
                },
              }}
            />
          </StyledListItem>

          <StyledListItem
            button
            selected={currentTab === "patients"}
            onClick={() => handleTabClick("patients")}
          >
            <IconWrapper active={currentTab === "patients"}>
              <MdPeople
                size={20}
                color={currentTab === "patients" ? "#1976d2" : "#666"}
              />
            </IconWrapper>
            <ListItemText
              primary="Quản lý khách hàng"
              sx={{
                ml: 1.5,
                maxWidth: "100%",
                "& .MuiListItemText-primary": {
                  fontWeight: currentTab === "patients" ? 600 : 400,
                  fontSize: "0.95rem",
                  color: currentTab === "patients" ? "#1976d2" : "inherit",
                },
              }}
            />
          </StyledListItem>

          <SectionLabel variant="caption">Quản lý nội dung</SectionLabel>

          <StyledListItem
            button
            selected={currentTab === "news"}
            onClick={() => handleTabClick("news")}
          >
            <IconWrapper active={currentTab === "news"}>
              <ArticleIcon
                fontSize="small"
                sx={{ color: currentTab === "news" ? "#1976d2" : "#666" }}
              />
            </IconWrapper>
            <ListItemText
              primary="Quản lý tin tức"
              sx={{
                ml: 1.5,
                maxWidth: "100%",
                "& .MuiListItemText-primary": {
                  fontWeight: currentTab === "news" ? 600 : 400,
                  fontSize: "0.95rem",
                  color: currentTab === "news" ? "#1976d2" : "inherit",
                },
              }}
            />
          </StyledListItem>

          <StyledListItem
            button
            selected={currentTab === "reported-posts"}
            onClick={() => handleTabClick("reported-posts")}
          >
            <IconWrapper active={currentTab === "reported-posts"}>
              <ReportProblemIcon
                fontSize="small"
                sx={{
                  color: currentTab === "reported-posts" ? "#1976d2" : "#666",
                }}
              />
            </IconWrapper>
            <ListItemText
              primary="Báo cáo bài viết"
              sx={{
                ml: 1.5,
                maxWidth: "100%",
                "& .MuiListItemText-primary": {
                  fontWeight: currentTab === "reported-posts" ? 600 : 400,
                  fontSize: "0.95rem",
                  color:
                    currentTab === "reported-posts" ? "#1976d2" : "inherit",
                },
              }}
            />
          </StyledListItem>
        </List>
      </NavSection>

      <BottomSection>
        <StyledListItem
          button
          onClick={onLogout}
          sx={{
            marginLeft: -0.5,
            bgcolor: "rgba(244, 67, 54, 0.04)",
            "&:hover": {
              bgcolor: "rgba(244, 67, 54, 0.08)",
            },
          }}
        >
          <IconWrapper>
            <ExitToAppIcon fontSize="small" sx={{ color: "#f44336" }} />
          </IconWrapper>
          <ListItemText
            primary="Đăng xuất"
            sx={{
              ml: 1.5,
              "& .MuiListItemText-primary": {
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "#f44336",
              },
            }}
          />
        </StyledListItem>
      </BottomSection>
    </StyledDrawer>
  );
};

export default Sidebar;
