import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import prescriptionApi from "../../api/prescriptionApi";
import {
  Container,
  Autocomplete,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  Box,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Sidebar from "../../components/doctor/Sidebar";
import { useTheme } from "@mui/material/styles";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { styled } from "@mui/system";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "24px",
  borderRadius: "16px",
  backgroundColor: alpha("#ffffff", 0.9),
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
  border: `1px solid ${alpha("#f0f0f0", 0.1)}`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    transform: "translateY(-4px)",
  },
}));

const SectionTitle = styled(Typography)({
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 16,
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#1976d2",
});

const StyledTableContainer = styled(TableContainer)({
  marginTop: 24,
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: alpha("#1976d2", 0.08),
  "& .MuiTableCell-root": {
    fontWeight: 600,
    color: "#1976d2",
  },
});

const StyledTableRow = styled(TableRow)({
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: alpha("#f5f5f5", 0.8),
    cursor: "pointer",
  },
  "&:nth-of-type(even)": {
    backgroundColor: alpha("#f9f9f9", 0.5),
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: 16,
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
  },
});

const StyledButton = styled(Button)({
  textTransform: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontWeight: 500,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
  },
});

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 24px 38px rgba(0,0,0,0.14)",
  },
});

const StyledChip = styled(Chip)(({ color }) => ({
  fontWeight: 500,
  borderRadius: 16,
  backgroundColor: color ? alpha(color, 0.1) : undefined,
  color: color,
  "& .MuiChip-label": {
    padding: "0 12px",
  },
}));

const IconWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: alpha("#1976d2", 0.08),
  marginRight: 12,
  color: "#1976d2",
});

const Prescription = () => {
  const theme = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  // Khởi tạo state với dữ liệu từ navigation nếu có
  const [patientInfo, setPatientInfo] = useState({});
  const [appointment, setAppointment] = useState({});
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // New state to track the index of the medicine being edited
  const [loading, setLoading] = useState(false);

  // Thêm state mới cho kết quả khám

  useEffect(() => {
    const getInfoPatient = async () => {
      try {
        setLoading(true);
        if (location.state?.appointment?.idPatient) {
          const response = await prescriptionApi.getInfoPatient(
            location.state.appointment.idPatient
          );

          const listmedicine = await prescriptionApi.getListMedicine(
            location.state.appointment.prescriptionId
          );

          setPrescriptionList(listmedicine.result);
          setPatientInfo(response.result);
          setAppointment(location.state.appointment);
        }
      } catch (error) {
        console.error("Error fetching patient info:", error);
      } finally {
        setLoading(false);
      }
    };
    getInfoPatient();
  }, [location.state]);

  const [medicine, setMedicine] = useState({
    name: "",
    medicineType: "",
    instruction: "",
    quantity: "",
    note: "",
  });

  const handlePatientInfoChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleMedicineChange = (e) => {
    setMedicine((prevMedicine) => ({
      ...prevMedicine,
      [e.target.name]: e.target.value,
    }));
  };

  const [inputValue, setInputValue] = useState("");

  const handleMedicineSelect = (index) => {
    setEditIndex(index);
    const selectedMedicine = prescriptionList[index];
    setMedicine(selectedMedicine);
    setInputValue(selectedMedicine.name);
  };

  const handleAddMedicine = async () => {
    if (!validateFields()) {
      setSnackbarMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoading(true);
      if (editIndex !== null) {
        const updatedList = [...prescriptionList];
        updatedList[editIndex] = medicine;
        await prescriptionApi.updateMedicine(
          prescriptionList[editIndex].id,
          medicine
        );
        setPrescriptionList(updatedList);
        setEditIndex(null);
        setSnackbarMessage("Cập nhật thuốc thành công!");
        setSnackbarSeverity("success");
      } else {
        const data = await prescriptionApi.createMedicine(
          appointment.prescriptionId,
          medicine
        );
        setPrescriptionList([...prescriptionList, { ...data.result }]);
        setSnackbarMessage("Thêm thuốc thành công!");
        setSnackbarSeverity("success");
      }

      setMedicine({
        name: "",
        medicineType: "tuýp",
        instruction: "",
        quantity: "",
        note: "",
      });
      setErrors({
        name: false,
        medicineType: false,
        instruction: false,
        quantity: false,
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error handling medicine:", error);
      setSnackbarMessage("Đã xảy ra lỗi!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const [pdfUrl, setPdfUrl] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [listMedicine, setListMedicine] = useState([]);
  const handleClickMedicine = async () => {
    const response = await prescriptionApi.getListDetailMedicine();
    setListMedicine(response.result);
  };
  const handleExport = async (e) => {
    try {
      setLoading(true);
      const prescription = await prescriptionApi.createPrescription(
        appointment.prescriptionId,
        {
          result: appointment?.result,
        }
      );

      setAppointment((appointment) => ({
        ...appointment,
        [e.target.name]: prescription.result.result,
      }));

      console.log(appointment);

      const response = await fetch(
        `http://hdcarebackend-production.up.railway.app/api/v1/appointment/pdf/${appointment.id}?status=${e.target.textContent}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (e.target.textContent === "Gửi") {
        setSnackbarMessage("Gửi đơn thuốc thành công!");
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/doctor/manage-appointment-history");
        }, 1000);
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/pdf")) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setPdfUrl(url); // Set the PDF URL
          setOpenPdf(true); // Open the PDF modal
        } else {
          throw new Error("Không nhận được file PDF từ server");
        }
        setSnackbarMessage("Tạo PDF thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Tạo PDF thất bại!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePdf = () => {
    setOpenPdf(false);
    setPdfUrl("");
  };

  // Thêm handler cho kết quả khám
  const handleResultChange = (e) => {
    setAppointment((appointment) => ({
      ...appointment,
      [e.target.name]: e.target.value,
    }));
  };

  // Thêm state cho thông báo
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Hàm đóng thông báo
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const [errors, setErrors] = useState({
    name: false,
    medicineType: false,
    instruction: false,
    quantity: false,
  });

  const validateFields = () => {
    const newErrors = {
      name: !medicine.name,
      medicineType: !medicine.medicineType,
      instruction: !medicine.instruction,
      quantity: !medicine.quantity,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleDeleteMedicine = async () => {
    try {
      setLoading(true);
      if (editIndex !== null) {
        await prescriptionApi.deleteMedicine(prescriptionList[editIndex].id);
        const updatedList = prescriptionList.filter(
          (_, index) => index !== editIndex
        );
        setPrescriptionList(updatedList);
        setEditIndex(null);

        // Reset form
        setMedicine({
          name: "",
          medicineType: "tuýp",
          instruction: "",
          quantity: "",
          note: "",
        });

        // Hiển thị thông báo thành công
        setSnackbarMessage("Xóa thuốc thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      // Hiển thị thông báo lỗi
      setSnackbarMessage("Xóa thuốc thất bại!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(145deg, #f0f7ff 0%, #f5f7fa 100%)",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: "280px" },
          transition: "margin 0.2s ease",
          py: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconWrapper>
                <MedicationIcon />
              </IconWrapper>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  backgroundImage: "linear-gradient(135deg, #1976d2, #64b5f6)",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Kê Đơn Thuốc
              </Typography>
            </Box>
            <StyledButton
              variant="outlined"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={() => navigate("/doctor/manage-appointment-history")}
            >
              Quay lại
            </StyledButton>
          </Box>

          <StyledPaper>
            {/* Patient Information */}
            <Box sx={{ mb: 4 }}>
              <SectionTitle>
                <PersonIcon fontSize="small" />
                Thông tin bệnh nhân
              </SectionTitle>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Tên bệnh nhân"
                    name="name"
                    value={patientInfo?.name || ""}
                    onChange={handlePatientInfoChange}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: 14,
                            mr: 1,
                            bgcolor: "#1976d2",
                          }}
                        >
                          {patientInfo?.name?.charAt(0) || "P"}
                        </Avatar>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    select
                    fullWidth
                    label="Giới tính"
                    name="gender"
                    value={patientInfo?.gender || ""}
                    onChange={handlePatientInfoChange}
                    disabled
                    variant="outlined"
                  >
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                  </StyledTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    type="date"
                    label="Ngày sinh"
                    name="dateOfBirth"
                    value={patientInfo?.dob || ""}
                    onChange={handlePatientInfoChange}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Lý do khám"
                    name="reason"
                    value={appointment?.title || ""}
                    onChange={handlePatientInfoChange}
                    disabled
                    variant="outlined"
                  />
                </Grid>

                {/* Thêm trường Kết quả khám */}
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Kết quả khám"
                    name="result"
                    value={appointment?.result || ""}
                    onChange={handleResultChange}
                    placeholder="Nhập kết quả khám..."
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Medicine Input */}
            <Box sx={{ mb: 4 }}>
              <SectionTitle>
                <MedicationIcon fontSize="small" />
                Nhập thông tin thuốc
              </SectionTitle>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    fullWidth
                    options={listMedicine || []}
                    getOptionLabel={(option) => option.name || ""}
                    value={medicine.name ? medicine : null}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setMedicine((prevMedicine) => ({
                          ...prevMedicine,
                          name: newValue.name || newValue,
                          instruction: newValue.instruction || "",
                        }));
                        setErrors((prev) => ({ ...prev, name: false }));
                      }
                    }}
                    freeSolo={true}
                    renderInput={(params) => (
                      <StyledTextField
                        {...params}
                        label="Nhập tên thuốc"
                        name="name"
                        onClick={handleClickMedicine}
                        onChange={handleMedicineChange}
                        required
                        error={errors.name}
                        helperText={
                          errors.name ? "Vui lòng nhập tên thuốc" : ""
                        }
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    select
                    fullWidth
                    label="Dạng thuốc"
                    name="medicineType"
                    value={medicine.medicineType || ""}
                    onChange={handleMedicineChange}
                    required
                    error={errors.medicineType}
                    helperText={
                      errors.medicineType ? "Vui lòng chọn dạng thuốc" : ""
                    }
                    variant="outlined"
                  >
                    <MenuItem value="tuýp">Tuýp</MenuItem>
                    <MenuItem value="viên">Viên</MenuItem>
                    <MenuItem value="chai">Chai</MenuItem>
                  </StyledTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Hướng dẫn"
                    name="instruction"
                    value={medicine.instruction || ""}
                    onChange={handleMedicineChange}
                    required
                    error={errors.instruction}
                    helperText={
                      errors.instruction ? "Vui lòng nhập hướng dẫn" : ""
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Số lượng"
                    name="quantity"
                    value={medicine.quantity || ""}
                    onChange={handleMedicineChange}
                    required
                    error={errors.quantity}
                    helperText={errors.quantity ? "Vui lòng nhập số lượng" : ""}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Lưu ý"
                    name="note"
                    value={medicine.note || ""}
                    onChange={handleMedicineChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={handleAddMedicine}
                      disabled={loading}
                      startIcon={
                        loading ? <CircularProgress size={20} /> : null
                      }
                    >
                      {editIndex !== null ? "Cập nhật thuốc" : "Thêm thuốc"}
                    </StyledButton>

                    {editIndex !== null && (
                      <StyledButton
                        variant="outlined"
                        color="error"
                        onClick={handleDeleteMedicine}
                        disabled={loading}
                      >
                        Xóa thuốc
                      </StyledButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Prescription Table */}
            <Box sx={{ mb: 4 }}>
              <SectionTitle>
                <DescriptionIcon fontSize="small" />
                Danh sách thuốc
              </SectionTitle>
              <Divider sx={{ mb: 3 }} />

              {prescriptionList.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    bgcolor: alpha("#f5f5f5", 0.5),
                    borderRadius: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    Chưa có thuốc nào được thêm vào đơn
                  </Typography>
                </Box>
              ) : (
                <StyledTableContainer>
                  <Table>
                    <StyledTableHead>
                      <TableRow>
                        <TableCell width={30} align="center">
                          STT
                        </TableCell>
                        <TableCell width={180}>Tên thuốc</TableCell>
                        <TableCell width={80}>Dạng thuốc</TableCell>
                        <TableCell align="center" width={80}>
                          Số lượng
                        </TableCell>
                        <TableCell>Hướng dẫn</TableCell>
                        <TableCell width={150}>Lưu ý</TableCell>
                        <TableCell align="center" width={70}>
                          Thao tác
                        </TableCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {prescriptionList.map((item, index) => (
                        <StyledTableRow key={item.id}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell>
                            <Typography fontWeight={500}>
                              {item.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StyledChip
                              label={item.medicineType}
                              size="small"
                              color={
                                item.medicineType === "viên"
                                  ? "#4caf50"
                                  : item.medicineType === "tuýp"
                                  ? "#2196f3"
                                  : "#ff9800"
                              }
                            />
                          </TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell>{item.instruction}</TableCell>
                          <TableCell>{item.note || "-"}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Chỉnh sửa">
                              <IconButton
                                size="small"
                                onClick={() => handleMedicineSelect(index)}
                                sx={{
                                  color: "#1976d2",
                                  bgcolor: alpha("#1976d2", 0.1),
                                  "&:hover": {
                                    bgcolor: alpha("#1976d2", 0.2),
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <StyledButton
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExport}
                disabled={loading}
              >
                Xem PDF
              </StyledButton>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleExport}
                disabled={!appointment?.result || loading}
                endIcon={<SendIcon />}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                Gửi
              </StyledButton>
            </Box>
          </StyledPaper>

          {/* Snackbar */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* PDF Modal */}
          <StyledDialog
            open={openPdf}
            onClose={handleClosePdf}
            fullWidth
            maxWidth="md"
          >
            <DialogContent sx={{ p: 0 }}>
              <iframe
                src={pdfUrl}
                width="100%"
                height="600px"
                title="Prescription PDF"
                frameBorder="0"
              />
            </DialogContent>
          </StyledDialog>
        </Container>
      </Box>
    </Box>
  );
};

export default Prescription;
