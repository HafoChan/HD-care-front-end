import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Link as MuiLink,
  Divider,
  Button,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import images from "../../constants/images";

const FooterComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
        borderTop: "1px solid #eaeaea",
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box
                component="img"
                src={images.logo}
                alt="HD-Care Logo"
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  mr: 1.5,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  fontFamily: "Helvetica Neue",
                }}
              >
                HD-Care
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              HD-Care là hệ thống chăm sóc sức khỏe trực tuyến hiện đại, kết nối
              bệnh nhân với các bác sĩ chuyên khoa hàng đầu, cung cấp dịch vụ tư
              vấn và đặt lịch khám bệnh trực tuyến.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <LocationOnIcon
                sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2" color="text.secondary">
                Số 1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP. Hồ Chí Minh
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <PhoneIcon
                sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2" color="text.secondary">
                +84 28 3835 4266
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon
                sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
              />
              <Typography variant="body2" color="text.secondary">
                info@hdcare.com
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Liên kết
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <MuiLink
                component={Link}
                to="/home"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  mb: 1.5,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Trang chủ
              </MuiLink>
              <MuiLink
                component={Link}
                to="/team-of-doctors"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  mb: 1.5,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Đội ngũ bác sĩ
              </MuiLink>
              <MuiLink
                component={Link}
                to="/news"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  mb: 1.5,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Bài viết
              </MuiLink>
              <MuiLink
                component={Link}
                to="/social-network"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  mb: 1.5,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Mạng xã hội
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Hỗ trợ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <MuiLink
                component={Link}
                to="#"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  mb: 1.5,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Trung tâm hỗ trợ
              </MuiLink>
              <MuiLink
                component={Link}
                to="#"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  mb: 1.5,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Câu hỏi thường gặp
              </MuiLink>
              <MuiLink
                component={Link}
                to="#"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  mb: 1.5,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Điều khoản sử dụng
              </MuiLink>
              <MuiLink
                component={Link}
                to="#"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  mb: 1.5,
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Chính sách bảo mật
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Nhận thông tin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Đăng ký để nhận thông tin mới nhất về sức khỏe và các dịch vụ của
              chúng tôi.
            </Typography>

            <Box
              sx={{
                display: "flex",
                mb: 3,
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "column",
                },
              }}
            >
              <TextField
                placeholder="Email của bạn"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  mr: isMobile ? 0 : 1,
                  mb: isMobile ? 1 : 0,
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "#fff",
                  },
                }}
              />
              <Button
                variant="contained"
                endIcon={<MailIcon />}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 2,
                  minWidth: isMobile ? "100%" : "auto",
                  minWidth: 120,
                }}
              >
                Đăng ký
              </Button>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Theo dõi chúng tôi
            </Typography>

            <Box sx={{ display: "flex" }}>
              <IconButton
                aria-label="facebook"
                sx={{
                  mr: 1,
                  color: "#4267B2",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    color: "primary.main",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                aria-label="twitter"
                sx={{
                  mr: 1,
                  color: "#1DA1F2",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    color: "primary.main",
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                aria-label="instagram"
                sx={{
                  mr: 1,
                  color: "#E1306C",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    color: "primary.main",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                aria-label="youtube"
                sx={{
                  mr: 1,
                  color: "#FF0000",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    color: "primary.main",
                  },
                }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                aria-label="linkedin"
                sx={{
                  color: "#0077B5",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    color: "primary.main",
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            © {new Date().getFullYear()} HD-Care. Tất cả các quyền được bảo lưu.
          </Typography>

          <Box sx={{ display: "flex" }}>
            <MuiLink
              component={Link}
              to="#"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                mx: 1,
                fontSize: "0.875rem",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Điều khoản
            </MuiLink>
            <MuiLink
              component={Link}
              to="#"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                mx: 1,
                fontSize: "0.875rem",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Bảo mật
            </MuiLink>
            <MuiLink
              component={Link}
              to="#"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                mx: 1,
                fontSize: "0.875rem",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Cookie
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterComponent;
