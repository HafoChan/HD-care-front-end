import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Avatar,
  Grid,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import StarIcon from "@mui/icons-material/Star";

function DoctorProfileComponent({ doctorInfo }) {
  const theme = useTheme();

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Grid
        container
        spacing={3}
        alignItems="center"
        sx={{
          position: "relative",
          py: { xs: 2, md: 4 },
        }}
      >
        <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
          <Avatar
            alt={doctorInfo?.name || "Doctor"}
            src={doctorInfo?.img}
            sx={{
              width: { xs: 180, md: 200 },
              height: { xs: 180, md: 200 },
              boxShadow: `0 8px 24px ${alpha(
                theme.palette.common.black,
                0.15
              )}`,
              border: `4px solid ${alpha(
                theme.palette.primary.contrastText,
                0.8
              )}`,
              mx: "auto",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: `0 12px 30px ${alpha(
                  theme.palette.common.black,
                  0.2
                )}`,
              },
            }}
          />

          {doctorInfo?.rating && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              <Rating
                value={parseFloat(doctorInfo?.rating) || 0}
                readOnly
                precision={0.5}
                size="small"
                icon={<StarIcon fontSize="inherit" sx={{ color: "#FFD700" }} />}
                emptyIcon={
                  <StarIcon
                    fontSize="inherit"
                    sx={{
                      color: alpha(theme.palette.primary.contrastText, 0.3),
                    }}
                  />
                }
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                }}
              >
                ({doctorInfo?.rating})
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  color: theme.palette.primary.contrastText,
                  textShadow: `0 2px 8px ${alpha(
                    theme.palette.common.black,
                    0.2
                  )}`,
                }}
              >
                {doctorInfo?.name || "Bác sĩ"}
              </Typography>
              {doctorInfo?.rating && doctorInfo?.rating >= 4.5 && (
                <VerifiedIcon
                  sx={{
                    ml: 1,
                    color: "#FFD700",
                    fontSize: 28,
                  }}
                />
              )}
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
            >
              {doctorInfo?.specialization && (
                <Chip
                  icon={<LocalHospitalIcon />}
                  label={doctorInfo.specialization.split("\\")[0]}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.contrastText, 0.2),
                    color: theme.palette.primary.contrastText,
                    fontWeight: 500,
                    backdropFilter: "blur(8px)",
                    height: 32,
                    borderRadius: 2,
                    mb: 1,
                  }}
                />
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
            >
              {doctorInfo?.address && (
                <Chip
                  label={doctorInfo?.address}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.contrastText, 0.2),
                    color: theme.palette.primary.contrastText,
                    fontWeight: 500,
                    backdropFilter: "blur(8px)",
                    height: 32,
                    borderRadius: 2,
                    mb: 1,
                  }}
                />
              )}
            </Stack>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: alpha(theme.palette.primary.contrastText, 0.9),
                maxWidth: { md: "80%" },
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: "1rem",
              }}
            >
              {doctorInfo?.description?.split("\\")[0]}
              {doctorInfo?.description?.split("\\")[1] &&
                `.${doctorInfo?.description?.split("\\")[1]}`}
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={3}
          sx={{ textAlign: { xs: "center", md: "right" } }}
        >
          <Box>
            {doctorInfo?.price && (
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: theme.palette.primary.contrastText,
                }}
              >
                {new Intl.NumberFormat("vi-VN").format(doctorInfo?.price)} VNĐ
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.2,
                bgcolor: theme.palette.primary.contrastText,
                color: theme.palette.primary.main,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: `0 4px 14px ${alpha(
                  theme.palette.common.black,
                  0.15
                )}`,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.9),
                  boxShadow: `0 6px 20px ${alpha(
                    theme.palette.common.black,
                    0.2
                  )}`,
                  transform: "translateY(-3px)",
                },
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onClick={() => {
                const appointmentElement = document.getElementById(
                  "appointment-scheduler"
                );
                if (appointmentElement) {
                  appointmentElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Đặt Lịch Ngay
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DoctorProfileComponent;
