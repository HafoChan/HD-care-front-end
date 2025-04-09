import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Autocomplete,
  Divider,
  CircularProgress,
  Chip,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { doctor } from "../../api/doctor";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaStethoscope,
  FaHospital,
  FaMoneyBillWave,
  FaCloudUploadAlt,
} from "react-icons/fa";
import UploadFilesService from "../../service/otherService/upload";

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

const DoctorModal = ({ open, onClose, doctorData, onSuccess }) => {
  const initialFormState = {
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    address: "",
    gender: "Nam",
    city: "",
    district: "",
    clinicName: "",
    price: "",
    specialization: "",
    experience: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [options, setOptions] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setImgFile(null);
      setPreviewUrl(null);
      setUploadedImageUrl(null);
    }
  }, [open]);

  const getCity = async () => {
    try {
      setLoadingCities(true);
      const data = await axios.get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      );
      setOptions(data.data);
      setLoadingCities(false);
    } catch (error) {
      console.error("Failed to load city data:", error);
      setLoadingCities(false);
    }
  };

  // Fetch cities only once when component mounts
  useEffect(() => {
    getCity();
  }, []);

  // Handle doctorData changes
  useEffect(() => {
    if (doctorData && options.length > 0) {
      // Cập nhật form data từ doctorData
      setFormData({
        name: doctorData.name || "",
        email: doctorData.email || "",
        username: doctorData.username || "",
        password: "",
        phone: doctorData.phone || "",
        address: doctorData.address || "",
        gender: doctorData.gender || "Nam",
        city: doctorData.city || "",
        district: doctorData.district || "",
        clinicName: doctorData.clinicName || "",
        price: doctorData.price || "",
        specialization: doctorData.specialization || "",
        experience: doctorData.experience || "",
        description: doctorData.description || "",
      });

      // Tìm và set province (city) và district
      const provinceObj = options.find((p) => p.Name === doctorData.city);
      setSelectedProvince(provinceObj);
      if (provinceObj) {
        const districtObj = provinceObj.Districts.find(
          (d) => d.Name === doctorData.district
        );
        setSelectedDistrict(districtObj);
      }
      if (doctorData.img) {
        setPreviewUrl(doctorData.img);
      }
    }
  }, [doctorData, options]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview first for immediate feedback
    setImgFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Then upload the file
    setUploadLoading(true);
    try {
      const response = await UploadFilesService.upload([file]);

      if (response?.code === 1000 && response?.result?.length > 0) {
        const imageUrl = response.result[0];
        setUploadedImageUrl(imageUrl);
        toast.success("Tải ảnh lên thành công!");
      } else {
        toast.error("Tải ảnh lên thất bại!");
        // Reset the file input
        setImgFile(null);
        setPreviewUrl(doctorData?.img || null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Có lỗi xảy ra khi tải ảnh lên");
      // Reset the file input
      setImgFile(null);
      setPreviewUrl(doctorData?.img || null);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async () => {
    const createUserRequest = {
      ...formData,
      city: selectedProvince?.Name || "",
      district: selectedDistrict?.Name || "",
    };

    // Different required fields based on if we're creating or updating
    const requiredFields = !doctorData
      ? [
          { field: "name", label: "Tên bác sĩ" },
          { field: "email", label: "Email" },
          { field: "username", label: "Tên đăng nhập" },
          { field: "password", label: "Mật khẩu" },
          { field: "phone", label: "Số điện thoại" },
          { field: "gender", label: "Giới tính" },
          { field: "address", label: "Địa chỉ" },
          { field: "city", label: "Tỉnh thành" },
          { field: "district", label: "Huyện" },
        ]
      : [
          { field: "name", label: "Tên bác sĩ" },
          { field: "phone", label: "Số điện thoại" },
          { field: "address", label: "Địa chỉ" },
          { field: "gender", label: "Giới tính" },
          { field: "city", label: "Tỉnh thành" },
          { field: "district", label: "Huyện" },
          { field: "clinicName", label: "Tên phòng khám" },
          { field: "price", label: "Giá" },
          { field: "specialization", label: "Chuyên môn" },
          { field: "experience", label: "Kinh nghiệm" },
          { field: "description", label: "Mô tả" },
        ];

    for (const { field, label } of requiredFields) {
      const value =
        field === "city"
          ? selectedProvince?.Name
          : field === "district"
          ? selectedDistrict?.Name
          : createUserRequest[field];

      if (!value) {
        toast.error(`Vui lòng nhập ${label}`);
        return;
      }
    }

    setLoading(true);
    try {
      let response;
      if (doctorData) {
        // Update doctor - include image URL if one was uploaded
        const updateData = {
          ...createUserRequest,
          id: doctorData.id,
        };

        // Only add the img field if there's an uploaded image
        if (uploadedImageUrl) {
          updateData.img = uploadedImageUrl;
        }

        response = await doctor.updateDoctor(updateData);
      } else {
        // Create new doctor - first create the account, then update details
        const createResponse = await doctor.createDoctor({
          name: createUserRequest.name,
          email: createUserRequest.email,
          username: createUserRequest.username,
          password: createUserRequest.password,
          phone: createUserRequest.phone,
          gender: createUserRequest.gender,
          address: createUserRequest.address,
          city: createUserRequest.city,
          district: createUserRequest.district,
        });

        if (createResponse?.code === 1000) {
          toast.success("Tạo tài khoản bác sĩ thành công!");
          if (onSuccess) onSuccess();
          onClose();
        } else {
          toast.error("Tạo tài khoản bác sĩ thất bại!");
          toast.error(createResponse?.message);
        }
      }

      if (response?.code === 1000) {
        if (doctorData) {
          toast.success("Cập nhật bác sĩ thành công!");
          if (onSuccess) onSuccess();
          onClose();
        }
      } else {
        if (doctorData) {
          toast.error("Cập nhật bác sĩ thất bại!");
          toast.error(response?.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

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
            {doctorData ? "Chỉnh sửa bác sĩ" : "Thêm bác sĩ mới"}
          </Typography>
          {doctorData && previewUrl && (
            <Avatar
              src={previewUrl}
              alt={formData.name}
              sx={{
                width: 64,
                height: 64,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            />
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" sx={{ mt: 2 }}>
          <SectionTitle>
            <FaUserMd size={20} color="#1976d2" />
            Thông tin cá nhân
          </SectionTitle>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Tên bác sĩ"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!!doctorData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!!doctorData}
              />
            </Grid>
            {!doctorData && (
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
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" fullWidth>
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
          </Grid>

          <SectionTitle>
            <FaHospital size={20} color="#1976d2" />
            Địa chỉ và thông tin phòng khám
          </SectionTitle>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                value={selectedProvince}
                onChange={(event, newValue) => {
                  setSelectedProvince(newValue);
                  setSelectedDistrict(null);
                }}
                options={options}
                getOptionLabel={(option) => option.Name || ""}
                loading={loadingCities}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    label="Tỉnh thành"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCities ? (
                            <CircularProgress size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                value={selectedDistrict}
                onChange={(event, newValue) => setSelectedDistrict(newValue)}
                options={(selectedProvince && selectedProvince.Districts) || []}
                getOptionLabel={(option) => option.Name || ""}
                disabled={!selectedProvince}
                renderInput={(params) => (
                  <StyledTextField {...params} label="Huyện" />
                )}
              />
            </Grid>
          </Grid>

          {doctorData && (
            <>
              <SectionTitle>
                <FaStethoscope size={20} color="#1976d2" />
                Thông tin chuyên môn
              </SectionTitle>

              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <StyledTextField
                    fullWidth
                    label="Tên phòng khám"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    label="Giá khám"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₫</InputAdornment>
                      ),
                      endAdornment: <FaMoneyBillWave color="#2e7d32" />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Chuyên môn"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Kinh nghiệm"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>

              <SectionTitle>
                <FaCloudUploadAlt size={20} color="#1976d2" />
                Ảnh đại diện
              </SectionTitle>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      id="doctor-image-upload"
                      disabled={uploadLoading}
                    />
                    <label htmlFor="doctor-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        sx={{ borderRadius: 2, textTransform: "none" }}
                        disabled={uploadLoading}
                        startIcon={
                          uploadLoading && <CircularProgress size={16} />
                        }
                      >
                        {uploadLoading ? "Đang tải lên..." : "Chọn ảnh"}
                      </Button>
                    </label>
                    {previewUrl && (
                      <Avatar
                        src={previewUrl}
                        alt="Preview"
                        sx={{ width: 50, height: 50 }}
                      />
                    )}
                    {imgFile && !uploadLoading && (
                      <Chip
                        label={
                          uploadedImageUrl ? "Đã tải lên" : "Đang xử lý..."
                        }
                        color={uploadedImageUrl ? "success" : "warning"}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </>
          )}

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
              ) : doctorData ? (
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

export default DoctorModal;
