import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  useTheme,
  alpha,
  Divider,
  Stack,
  Grid,
  CircularProgress,
  Paper,
  Grow,
  IconButton,
  Tooltip,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useUserContext } from "../../context/UserContext";
import { appointment } from "../../api/appointment";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import SubjectIcon from "@mui/icons-material/Subject";
import DescriptionIcon from "@mui/icons-material/Description";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

const BookingForm = ({ open, onClose, selectedDate, doctor, schedule }) => {
  const theme = useTheme();
  // Safely handle potentially undefined user context
  const userContext = useUserContext() || {};
  const { id, name, email, address, gender, dob } = userContext;

  const [nameForm, setNameForm] = useState("");
  const [emailForm, setEmailForm] = useState("");
  const [addressForm, setAddressForm] = useState("");
  const [genderForm, setGenderForm] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [loginRequired, setLoginRequired] = useState(!id);

  // Form data for API request
  const data = {
    idPatient: id,
    name: nameForm,
    gender: genderForm,
    dob: dob,
    address: addressForm,
    description: description,
    title: title,
    scheduleId: schedule?.id,
    email: emailForm,
  };

  useEffect(() => {
    // Format the date for display
    if (selectedDate) {
      try {
        const dateObj = new Date(selectedDate);
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        setFormattedDate(dateObj.toLocaleDateString("vi-VN", options));
      } catch (error) {
        console.error("Date formatting error:", error);
        setFormattedDate(selectedDate);
      }
    }

    // Set initial form values from user context
    setNameForm(name || "");
    setEmailForm(email || "");
    setAddressForm(address || "");
    setGenderForm(gender || "");

    // Check if user is logged in
    setLoginRequired(!id);
  }, [name, email, address, gender, selectedDate, schedule, id]);

  // Check if all schedule data is present
  const isScheduleDataComplete = () => {
    return schedule && schedule.id && schedule.start && schedule.end;
  };

  const handleRedirectToLogin = () => {
    window.location.href = "/login";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if user is logged in
    if (loginRequired) {
      toast.error("Vui lòng đăng nhập để đặt lịch");
      handleRedirectToLogin();
      return;
    }

    // Validate the schedule data
    if (!isScheduleDataComplete()) {
      toast.error("Thông tin lịch không hợp lệ. Vui lòng chọn lại.");
      return;
    }

    // Validate required fields
    if (!nameForm || !emailForm || !addressForm || !title || !description) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const response = await appointment.createAppointment(data);

      if (response.code === 1000) {
        toast.success("Đặt lịch thành công!");
        setTitle("");
        setDescription("");
        setLoading(false);
        onClose();
      } else {
        console.log(response);
        throw new Error(response.message || "Đặt lịch không thành công!");
      }
    } catch (error) {
      toast.error(error.message || "Đặt lịch không thành công!");
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Grow}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          ĐĂNG KÝ LỊCH KHÁM
        </Typography>
        <IconButton
          onClick={loading ? null : onClose}
          disabled={loading}
          sx={{
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.contrastText, 0.15),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {loginRequired && (
        <Alert
          severity="warning"
          sx={{ m: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRedirectToLogin}
            >
              Đăng nhập
            </Button>
          }
        >
          Vui lòng đăng nhập để đặt lịch khám
        </Alert>
      )}

      <DialogContent
        sx={{
          p: 0,
          maxHeight: "80vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: alpha(theme.palette.grey[200], 0.5),
          },
        }}
      >
        <Box
          sx={{
            background: theme.palette.background.default,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            {doctor?.avatar ? (
              <Avatar
                alt="Avatar"
                src={doctor?.avatar}
                sx={{
                  width: 64,
                  height: 64,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: theme.palette.primary.main,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {doctor?.name?.charAt(0) || "D"}
              </Avatar>
            )}

            <Box>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                {doctor?.name || "Bác sĩ"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {doctor?.specialization || "Chuyên khoa"} • {doctor?.district}{" "}
                {doctor?.city}
              </Typography>
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Ngày khám
                </Typography>
                <Typography
                  fontWeight={500}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <DateRangeIcon fontSize="small" color="primary" />
                  {formattedDate || selectedDate || "Chưa chọn"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Thời gian
                </Typography>
                <Typography
                  fontWeight={500}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AccessTimeIcon fontSize="small" color="primary" />
                  {schedule?.start || "00:00"} - {schedule?.end || "00:00"}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            p: 3,
            pt: 4,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            Thông tin cá nhân
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ và tên"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={nameForm}
                onChange={(e) => setNameForm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <FormLabel>Giới tính</FormLabel>
                <RadioGroup
                  row
                  value={genderForm}
                  onChange={(e) => setGenderForm(e.target.value)}
                >
                  <FormControlLabel
                    value="Nam"
                    control={
                      <Radio
                        icon={<MaleIcon />}
                        checkedIcon={<MaleIcon />}
                        sx={{
                          color: alpha(theme.palette.primary.main, 0.7),
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label="Nam"
                  />
                  <FormControlLabel
                    value="Nữ"
                    control={
                      <Radio
                        icon={<FemaleIcon />}
                        checkedIcon={<FemaleIcon />}
                        sx={{
                          color: alpha(theme.palette.primary.main, 0.7),
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label="Nữ"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email xác nhận"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                disabled={Boolean(email)}
                value={emailForm}
                onChange={(e) => setEmailForm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Địa chỉ"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={addressForm}
                onChange={(e) => setAddressForm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            Thông tin cuộc hẹn
          </Typography>

          <TextField
            label="Lý do khám"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Khám da liễu định kỳ, Da mặt bị mụn..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SubjectIcon color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label="Mô tả triệu chứng và nhu cầu thăm khám"
            multiline
            rows={4}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải và nhu cầu khám của bạn..."
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ alignSelf: "flex-start", pt: 1.5 }}
                >
                  <DescriptionIcon color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                pl: 1,
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Button
          onClick={onClose}
          color="error"
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !isScheduleDataComplete() || loginRequired}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Xác nhận đặt lịch"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingForm;
