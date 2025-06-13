import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
  Grid,
  useTheme,
  alpha,
  Card,
  CardContent,
  InputAdornment,
  Chip,
  Zoom,
  Fade,
} from "@mui/material";
import BookingForm from "../../pages/patient/BookingForm";
import { UserProvider } from "../../context/UserContext";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaidIcon from "@mui/icons-material/Paid";
import AvailableIcon from "@mui/icons-material/EventAvailable";
import UnavailableIcon from "@mui/icons-material/EventBusy";

const AppointmentSchedulerComponent = ({
  doctorInfo,
  doctorId,
  selectedDate,
  setSelectedDate,
  fetchAvailableTimes,
  availableTimes,
}) => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [openBookingForm, setOpenBookingForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Filter available times to only include those with available: true
  const filteredAvailableTimes = availableTimes.filter(
    (time) => time.available === true
  );

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    if (newDate !== selectedDate) {
      setSelectedDate(newDate);
      fetchAvailableTimes(newDate);
    }
  };

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenBookingForm(true);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{
          mb: 3,
          color: theme.palette.primary.main,
          position: "relative",
          display: "inline-block",
          "&:after": {
            content: '""',
            position: "absolute",
            width: "30%",
            height: "3px",
            backgroundColor: theme.palette.primary.main,
            bottom: "-8px",
            left: 0,
            borderRadius: "2px",
          },
        }}
      >
        <CalendarMonthIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Lịch khám bệnh
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Fade in timeout={800}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="Chọn ngày khám"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: today.toISOString().split("T")[0],
                      max: maxDate.toISOString().split("T")[0],
                    }}
                    value={selectedDate}
                    onChange={handleDateChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon color="primary" />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                      },
                    }}
                  />

                  {selectedDate && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontStyle: "italic" }}
                    >
                      {formatDisplayDate(selectedDate)}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <AccessTimeIcon
                      fontSize="small"
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    Thời gian khám có sẵn:
                  </Typography>

                  {filteredAvailableTimes.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        border: `1px dashed ${alpha(
                          theme.palette.info.main,
                          0.3
                        )}`,
                      }}
                    >
                      <UnavailableIcon
                        sx={{ color: theme.palette.info.main, mr: 1 }}
                      />
                      <Typography color="text.secondary">
                        Không có lịch khám vào ngày này. Vui lòng chọn ngày
                        khác.
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        maxWidth: "100%",
                      }}
                    >
                      {filteredAvailableTimes.map((time, index) => {
                        // Tạo đối tượng Date cho thời gian hiện tại
                        const now = new Date();

                        // Tạo đối tượng Date cho thời gian của lịch khám
                        const scheduleDate = new Date(selectedDate);
                        const [scheduleHour] = time.start
                          .split(":")
                          .map(Number);
                        scheduleDate.setHours(scheduleHour, 0, 0, 0);

                        // Kiểm tra xem lịch có phải trong quá khứ không
                        const isPastSchedule = scheduleDate < now;

                        return (
                          <Zoom key={index} in timeout={500 + index * 50}>
                            <Button
                              variant={
                                isPastSchedule ? "outlined" : "contained"
                              }
                              color={isPastSchedule ? "error" : "primary"}
                              disabled={isPastSchedule}
                              onClick={() => handleScheduleClick(time)}
                              startIcon={<AccessTimeIcon />}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                px: 2,
                                py: 1,
                                mb: 1,
                                fontWeight: 500,
                                opacity: isPastSchedule ? 0.7 : 1,
                                backgroundColor: isPastSchedule
                                  ? alpha(theme.palette.error.main, 0.1)
                                  : undefined,
                                borderColor: isPastSchedule
                                  ? theme.palette.error.main
                                  : undefined,
                                "& .MuiButton-startIcon": {
                                  color: isPastSchedule
                                    ? theme.palette.error.main
                                    : undefined,
                                },
                                "&:hover": {
                                  backgroundColor: isPastSchedule
                                    ? alpha(theme.palette.error.main, 0.15)
                                    : undefined,
                                  transform: isPastSchedule
                                    ? "none"
                                    : "translateY(-2px)",
                                  boxShadow: isPastSchedule
                                    ? "none"
                                    : theme.shadows[4],
                                },
                                transition:
                                  "transform 0.2s ease, box-shadow 0.2s ease",
                              }}
                            >
                              {time.start} - {time.end}
                            </Button>
                          </Zoom>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={5}>
          <Fade in timeout={1000}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.05
                )} 0%, ${alpha(theme.palette.primary.light, 0.2)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                height: "100%",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "5px",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocationOnIcon sx={{ mr: 1 }} />
                  THÔNG TIN KHÁM BỆNH
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    fontWeight={600}
                    variant="subtitle1"
                    sx={{
                      mb: 0.5,
                      color: theme.palette.text.primary,
                      borderBottom: `1px solid ${alpha(
                        theme.palette.divider,
                        0.2
                      )}`,
                      pb: 0.5,
                    }}
                  >
                    {doctorInfo?.clinicName || "Phòng khám Da liễu"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: theme.palette.text.secondary,
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <LocationOnIcon
                      fontSize="small"
                      sx={{
                        color: theme.palette.primary.main,
                        mr: 0.5,
                        mt: 0.3,
                        opacity: 0.8,
                      }}
                    />
                    {doctorInfo?.address}, {doctorInfo?.district},{" "}
                    {doctorInfo?.city}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.6),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  }}
                >
                  <Typography
                    fontWeight={600}
                    variant="subtitle1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PaidIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    GIÁ KHÁM:
                  </Typography>

                  <Chip
                    label={`${formatNumber(doctorInfo?.price || 0)}đ`}
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 1.5,
                      px: 1,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(
                      theme.palette.success.main,
                      0.2
                    )}`,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AvailableIcon
                    sx={{
                      color: theme.palette.success.main,
                      mr: 1.5,
                      fontSize: 28,
                    }}
                  />
                  <Typography color="text.secondary" variant="body2">
                    Vui lòng chọn ngày và thời gian khám từ lịch có sẵn để đặt
                    lịch khám với bác sĩ.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Hiển thị BookingForm khi openBookingForm là true */}
      {openBookingForm && (
        <UserProvider>
          <BookingForm
            open={openBookingForm}
            onClose={() => setOpenBookingForm(false)}
            selectedDate={selectedDate}
            doctor={doctorInfo}
            schedule={selectedSchedule}
          />
        </UserProvider>
      )}
    </Box>
  );
};

export default AppointmentSchedulerComponent;
