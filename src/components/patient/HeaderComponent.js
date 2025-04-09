import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Divider,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import images from "../../constants/images";
import React, { useEffect, useState } from "react";
import {
  remove,
  getImg,
  getRefreshToken,
} from "../../service/otherService/localStorage";
import { useNavigate } from "react-router-dom";

const HeaderComponent = ({ userInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [img, setImg] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [checkLogin, setCheckLogin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Đang thực hiện đăng xuất...");
    setCheckLogin(false);
    remove();
    handleMenuClose();
    window.location.href = "/login";
  };

  const viewInfo = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const getInfo = () => {
    if (getRefreshToken()) {
      setCheckLogin(true);
      const storedUserInfo = getImg();

      if (storedUserInfo && storedUserInfo !== "undefined") {
        setImg(storedUserInfo);
      } else {
        setImg(
          "https://kasfaa.com/wp-content/uploads/2023/05/Generic-Avatar.jpg"
        );
      }
    } else {
      setCheckLogin(false);
    }
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleNews = () => {
    setNewsOpen(!newsOpen);
  };

  const toggleSocial = () => {
    setSocialOpen(!socialOpen);
  };

  const isActive = (path) => {
    if (path === "/news" && location.pathname.startsWith("/news")) return true;
    if (
      path === "/social-network" &&
      location.pathname.startsWith("/social-network")
    )
      return true;
    return location.pathname === path;
  };

  useEffect(() => {
    getInfo();
  }, [userInfo, img]);

  const NavButton = ({ to, label, active }) => (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Button
        sx={{
          fontWeight: 600,
          backgroundColor: active ? "#FAC41C" : "transparent",
          color: active ? "white" : "text.primary",
          borderRadius: "12px",
          px: 2,
          py: 1,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: active ? "#FAC41C" : "rgba(250, 196, 28, 0.1)",
            transform: "translateY(-2px)",
            boxShadow: active ? "0 4px 8px rgba(250, 196, 28, 0.2)" : "none",
          },
        }}
      >
        {label}
      </Button>
    </Link>
  );

  const drawer = (
    <Box sx={{ width: 280, pt: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <img
          src={images.logo}
          alt="Logo"
          style={{ width: 60, height: 60, borderRadius: "50%" }}
        />
      </Box>
      <Divider />
      <List>
        <ListItem
          component={Link}
          to="/home"
          button
          selected={isActive("/home")}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 1,
            bgcolor: isActive("/home")
              ? "rgba(250, 196, 28, 0.1)"
              : "transparent",
            color: isActive("/home") ? "#FAC41C" : "inherit",
          }}
        >
          <ListItemIcon
            sx={{ color: isActive("/home") ? "#FAC41C" : "inherit" }}
          >
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Trang chủ" />
        </ListItem>

        <ListItem
          component={Link}
          to="/team-of-doctors"
          button
          selected={isActive("/team-of-doctors")}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 1,
            bgcolor: isActive("/team-of-doctors")
              ? "rgba(250, 196, 28, 0.1)"
              : "transparent",
            color: isActive("/team-of-doctors") ? "#FAC41C" : "inherit",
          }}
        >
          <ListItemIcon
            sx={{ color: isActive("/team-of-doctors") ? "#FAC41C" : "inherit" }}
          >
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Đội ngũ bác sĩ" />
        </ListItem>

        <ListItem
          component={Link}
          to="/profile"
          button
          selected={isActive("/profile") || isActive("/user-detail")}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 1,
            bgcolor:
              isActive("/profile") || isActive("/user-detail")
                ? "rgba(250, 196, 28, 0.1)"
                : "transparent",
            color:
              isActive("/profile") || isActive("/user-detail")
                ? "#FAC41C"
                : "inherit",
          }}
        >
          <ListItemIcon
            sx={{
              color:
                isActive("/profile") || isActive("/user-detail")
                  ? "#FAC41C"
                  : "inherit",
            }}
          >
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Trang cá nhân" />
        </ListItem>

        <ListItem
          component={Link}
          to="/user-detail"
          button
          selected={false}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 1,
            pl: 4,
            bgcolor: "transparent",
            color: "inherit",
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Chỉnh sửa thông tin" />
        </ListItem>

        <ListItem
          button
          onClick={toggleNews}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 1,
            bgcolor: isActive("/news")
              ? "rgba(250, 196, 28, 0.1)"
              : "transparent",
            color: isActive("/news") ? "#FAC41C" : "inherit",
          }}
        >
          <ListItemIcon
            sx={{ color: isActive("/news") ? "#FAC41C" : "inherit" }}
          >
            <NewspaperIcon />
          </ListItemIcon>
          <ListItemText primary="Bài viết" />
          {newsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={newsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              component={Link}
              to="/news"
              button
              sx={{ pl: 4, borderRadius: 2, mx: 1, mb: 1 }}
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Tất cả bài viết" />
            </ListItem>

            <ListItem
              component={Link}
              to="/news/saved"
              button
              sx={{ pl: 4, borderRadius: 2, mx: 1, mb: 1 }}
            >
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary="Bài viết đã lưu" />
            </ListItem>

            <ListItem
              component={Link}
              to="/news/my-articles"
              button
              sx={{ pl: 4, borderRadius: 2, mx: 1, mb: 1 }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Bài viết của tôi" />
            </ListItem>

            <ListItem
              component={Link}
              to="/news/create"
              button
              sx={{ pl: 4, borderRadius: 2, mx: 1, mb: 1 }}
            >
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="Tạo bài viết" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          button
          onClick={toggleSocial}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 1,
            bgcolor: isActive("/social-network")
              ? "rgba(250, 196, 28, 0.1)"
              : "transparent",
            color: isActive("/social-network") ? "#FAC41C" : "inherit",
          }}
        >
          <ListItemIcon
            sx={{ color: isActive("/social-network") ? "#FAC41C" : "inherit" }}
          >
            <ConnectWithoutContactIcon />
          </ListItemIcon>
          <ListItemText primary="Mạng xã hội" />
          {socialOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={socialOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              component={Link}
              to="/social-network"
              button
              sx={{ pl: 4, borderRadius: 2, mx: 1, mb: 1 }}
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Bảng tin" />
            </ListItem>

            <ListItem
              component={Link}
              to="/social-network/saved-posts"
              button
              sx={{ pl: 4, borderRadius: 2, mx: 1, mb: 1 }}
            >
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary="Bài đăng đã lưu" />
            </ListItem>

            <ListItem
              component={Link}
              to="/social-network/follow"
              button
              sx={{ pl: 4, borderRadius: 2, mx: 1, mb: 1 }}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Theo dõi" />
            </ListItem>

            <ListItem
              component={Link}
              to="/social-network/create-post"
              button
              sx={{ pl: 4, borderRadius: 2, mx: 1, mb: 1 }}
            >
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="Tạo bài đăng" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          component={Link}
          to="/appointment-list"
          button
          selected={isActive("/appointment-list")}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 1,
            bgcolor: isActive("/appointment-list")
              ? "rgba(250, 196, 28, 0.1)"
              : "transparent",
            color: isActive("/appointment-list") ? "#FAC41C" : "inherit",
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/appointment-list") ? "#FAC41C" : "inherit",
            }}
          >
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="Xem lịch hẹn" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 100 }}>
      <AppBar
        position="static"
        sx={{ bgcolor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
      >
        <Container maxWidth="lg" sty>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 1,
              padding: "8px 0px !important",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <IconButton
                  color="primary"
                  edge="start"
                  onClick={toggleDrawer}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Box
                component={Link}
                to="/home"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <img
                  src={images.logo}
                  alt="Logo"
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    ml: 1,
                    fontWeight: 700,
                    color: "primary.main",
                    display: { xs: "none", sm: "block" },
                    fontFamily: "Helvetica Neue",
                  }}
                >
                  HD-Care
                </Typography>
              </Box>
            </Box>

            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <NavButton
                  to="/home"
                  label="Trang chủ"
                  active={isActive("/home")}
                />
                <NavButton
                  to="/team-of-doctors"
                  label="Đội ngũ bác sĩ"
                  active={isActive("/team-of-doctors")}
                />
                <NavButton
                  to="/profile"
                  label="Trang cá nhân"
                  active={isActive("/profile") || isActive("/user-detail")}
                />
                <NavButton
                  to="/news"
                  label="Bài viết"
                  active={isActive("/news")}
                />
                <NavButton
                  to="/social-network"
                  label="Mạng xã hội"
                  active={isActive("/social-network")}
                />
                <NavButton
                  to="/appointment-list"
                  label="Xem lịch hẹn"
                  active={isActive("/appointment-list")}
                />
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="primary" sx={{ mr: 1 }}>
                <Badge badgeContent={2} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>

              <Link
                to={img ? "#" : "/login"}
                style={{ textDecoration: "none" }}
                onClick={img ? handleMenuOpen : undefined}
              >
                {checkLogin ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                  >
                    <Avatar
                      src={img}
                      alt="User"
                      sx={{
                        width: 40,
                        height: 40,
                        border: "2px solid #FAC41C",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "12px",
                      boxShadow: "0 4px 10px rgba(250, 196, 28, 0.3)",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 12px rgba(250, 196, 28, 0.4)",
                      },
                    }}
                  >
                    Đăng nhập
                  </Button>
                )}
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            minWidth: 180,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={viewInfo}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 0.5,
            "&:hover": {
              bgcolor: "rgba(250, 196, 28, 0.1)",
            },
          }}
        >
          <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
          <Typography>Trang cá nhân</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/user-detail");
            handleMenuClose();
          }}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 0.5,
            "&:hover": {
              bgcolor: "rgba(250, 196, 28, 0.1)",
            },
          }}
        >
          <EditIcon sx={{ mr: 1.5, fontSize: 20 }} />
          <Typography>Chỉnh sửa thông tin</Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 0.5,
            color: "error.main",
            "&:hover": {
              bgcolor: "rgba(211, 47, 47, 0.1)",
            },
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: "12px" }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <Typography>Đăng xuất</Typography>
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default HeaderComponent;
