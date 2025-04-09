import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  CircularProgress,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import patientApi from "../../api/patient";
import { toast } from "react-toastify";
import {
  FaUserAlt,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

const StyledModal = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000,
  backdropFilter: "blur(4px)",
}));

const ModalContent = styled(Box)(() => ({
  backgroundColor: "white",
  padding: 32,
  borderRadius: 16,
  width: "100%",
  maxWidth: 800,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#ccc",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#999",
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
  },
}));

const SectionTitle = styled(Typography)(() => ({
  marginTop: 24,
  marginBottom: 16,
  fontWeight: 600,
  fontSize: 18,
  display: "flex",
  alignItems: "center",
  "& svg": {
    marginRight: 8,
  },
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: 8,
  padding: "10px 16px",
  textTransform: "none",
  fontWeight: 500,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
  },
}));

const RadioOptionButton = styled(FormControlLabel)(({ checked }) => ({
  margin: 0,
  "& .MuiRadio-root": {
    padding: 8,
  },
  "& .MuiTypography-root": {
    fontWeight: checked ? 600 : 400,
  },
}));

const avatarColors = ["#1976d2", "#2e7d32", "#ed6c02", "#9c27b0", "#d32f2f"];

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const PatientModal = ({ open, onClose, patientData, onSuccess }) => {
  const initialFormState = {
    username: "",
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset form when modal is closed
    if (!open) {
      setFormData(initialFormState);
    }
  }, [open]);

  useEffect(() => {
    if (patientData) {
      setFormData({
        username: patientData.username || "",
        email: patientData.email || "",
        password: "",
        name: patientData.name || "",
        phone: patientData.phone || "",
        address: patientData.address || "",
        gender: patientData.gender || "",
        dob: patientData.dob || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [patientData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { field: "name", label: "Tên khách hàng" },
      { field: "email", label: "Email" },
      { field: "username", label: "Tên đăng nhập" },
      { field: "phone", label: "Số điện thoại" },
      { field: "address", label: "Địa chỉ" },
      { field: "gender", label: "Giới tính" },
      { field: "dob", label: "Ngày sinh" },
    ];

    // Password is required only for new patients
    if (!patientData) {
      requiredFields.push({ field: "password", label: "Mật khẩu" });
    }

    for (const { field, label } of requiredFields) {
      if (!formData[field]) {
        toast.error(`Vui lòng nhập ${label}`);
        return;
      }
    }

    setLoading(true);
    try {
      let response;
      if (patientData) {
        // Update patient
        response = await patientApi.updatePatientForAdmin({
          ...formData,
          id: patientData.id,
        });
      } else {
        // Create new patient
        response = await patientApi.create(formData);
      }

      if (response?.code === 1000) {
        toast.success(
          patientData
            ? "Cập nhật khách hàng thành công!"
            : "Thêm khách hàng thành công!"
        );
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(
          patientData
            ? "Cập nhật khách hàng thất bại!"
            : "Thêm khách hàng thất bại!"
        );
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const colorIndex = Math.abs(formData.name.length) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <StyledModal>
      <ModalContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {patientData ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
          </Typography>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: avatarColor,
              fontWeight: "bold",
              fontSize: 24,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {getInitials(formData.name)}
          </Avatar>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" sx={{ mt: 2 }}>
          <SectionTitle>
            <FaUserAlt size={18} color="#1976d2" />
            Thông tin cá nhân
          </SectionTitle>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Tên khách hàng"
                name="name"
                placeholder="Tên khách hàng"
                value={formData.name}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUserAlt color="#666" size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Email"
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!!patientData}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdEmail color="#666" size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <SectionTitle>
            <FaIdCard size={18} color="#1976d2" />
            Thông tin tài khoản
          </SectionTitle>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!!patientData}
              />
            </Grid>
            {!patientData && (
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Mật khẩu"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
          </Grid>

          <SectionTitle>
            <FaMapMarkerAlt size={18} color="#1976d2" />
            Thông tin liên hệ
          </SectionTitle>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Số điện thoại"
                placeholder="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdPhone color="#666" size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Typography variant="body2" color="#666666" gutterBottom>
                  Giới tính
                </Typography>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <RadioOptionButton
                    value="Nam"
                    control={<Radio />}
                    label="Nam"
                    checked={formData.gender === "Nam"}
                  />
                  <RadioOptionButton
                    value="Nữ"
                    control={<Radio />}
                    label="Nữ"
                    checked={formData.gender === "Nữ"}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Ngày sinh"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaCalendarAlt color="#666" size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Địa chỉ"
                placeholder="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaMapMarkerAlt color="#666" size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <StyledButton
              variant="outlined"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : patientData ? (
                "Cập nhật"
              ) : (
                "Xác nhận"
              )}
            </StyledButton>
          </Box>
        </Box>
      </ModalContent>
    </StyledModal>
  );
};

export default PatientModal;
