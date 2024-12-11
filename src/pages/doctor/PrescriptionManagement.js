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
} from "@mui/material";

const Prescription = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Khởi tạo state với dữ liệu từ navigation nếu có
  const [patientInfo, setPatientInfo] = useState({});
  const [appointment, setAppointment] = useState({});
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // New state to track the index of the medicine being edited

  // Thêm state mới cho kết quả khám

  useEffect(() => {
    const getInfoPatient = async () => {
      try {
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

  const [inputValue, setInputValue] = useState('');

  const handleMedicineSelect = (index) => {
    setEditIndex(index);
    const selectedMedicine = prescriptionList[index];
    setMedicine(selectedMedicine);
    setInputValue(selectedMedicine.name);
  };

  const handleAddMedicine = async () => {
    if (editIndex !== null) {
      const updatedList = [...prescriptionList];
      updatedList[editIndex] = medicine;
      await prescriptionApi.updateMedicine(
        prescriptionList[editIndex].id,
        medicine
      );
      setPrescriptionList(updatedList);
      setEditIndex(null);
    } else {
      // Add new medicine
      const data = await prescriptionApi.createMedicine(
        appointment.prescriptionId,
        medicine
      );
      setPrescriptionList([...prescriptionList, { ...data.result }]);
    }
    // Reset medicine state to clear the Autocomplete text
    setMedicine({
      name: "", // Clear the name field
      medicineType: "tuýp",
      instruction: "",
      quantity: "",
      note: "",
    });
  };

  const [pdfUrl, setPdfUrl] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [listMedicine, setListMedicine] = useState([])
  const handleClickMedicine = async () => {
      const response = await prescriptionApi.getListDetailMedicine()
      setListMedicine(response.result)

  }
  const handleExport = async (e) => {
    try {
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
        `http://localhost:8082/api/v1/appointment/pdf/${appointment.id}?status=${e.target.textContent}`,
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
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Tạo PDF thất bại!");
      setOpenSnackbar(true);
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

  // Hàm đóng thông báo
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Kê Đơn Thuốc
        </Typography>

        {/* Add Back Button */}
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/doctor/manage-appointment-history")} // Navigate back to the previous page
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>

        {/* Patient Information */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Thông tin bệnh nhân
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên bệnh nhân"
              name="name"
              value={patientInfo?.name || ""}
              onChange={handlePatientInfoChange}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              fullWidth
              label="Giới tính"
              name="gender"
              value={patientInfo?.gender || ""}
              onChange={handlePatientInfoChange}
              disabled
            >
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Ngày sinh"
              name="dateOfBirth"
              value={patientInfo?.dob || ""}
              onChange={handlePatientInfoChange}
              InputLabelProps={{ shrink: true }}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lý do khám"
              name="reason"
              value={appointment?.title || ""}
              onChange={handlePatientInfoChange}
              disabled
            />
          </Grid>

          {/* Thêm trường Kết quả khám */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Kết quả khám"
              name="result"
              value={appointment?.result || ""}
              onChange={handleResultChange}
              placeholder="Nhập kết quả khám..."
            />
          </Grid>
        </Grid>

        {/* Medicine Input */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Nhập thông tin thuốc
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={listMedicine}
              getOptionLabel={(option) => option.name}
              value={medicine}
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
                }
              }}
              freeSolo={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nhập tên thuốc"
                  name="name"
                  onClick={handleClickMedicine}
                  onChange={handleMedicineChange}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              fullWidth
              label="Dạng thuốc"
              name="medicineType"
              value={medicine.medicineType || ""}
              onChange={handleMedicineChange}
            >
              <MenuItem value="tuýp">Tuýp</MenuItem>
              <MenuItem value="viên">Viên</MenuItem>
              <MenuItem value="chai">Chai</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hướng dẫn"
              name="instruction"
              value={medicine.instruction}
              onChange={handleMedicineChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Số lượng"
              name="quantity"
              value={medicine.quantity}
              onChange={handleMedicineChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lưu ý"
              name="note"
              value={medicine.note}
              onChange={handleMedicineChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddMedicine}
            >
              {editIndex !== null ? "Cập nhật" : "Thêm thuốc"}
            </Button>
          </Grid>
        </Grid>

        {/* Prescription Table */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên thuốc</TableCell>
                <TableCell>Dạng thuốc</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Hướng dẫn</TableCell>
                <TableCell>Lưu ý</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptionList.map((item, index) => (
                <TableRow
                  key={item.id}
                  onClick={() => handleMedicineSelect(index)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.medicineType}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.instruction}</TableCell>
                  <TableCell>{item.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mt: 4 }} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleExport}>
              Xem PDF
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExport}
              // Disable nút Gửi nếu chưa có kết quả khám
              disabled={!appointment?.result}
            >
              Gửi
            </Button>
          </Grid>
        </Grid>

        {/* Cập nhật Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* PDF Modal */}
        <Dialog open={openPdf} onClose={handleClosePdf} fullWidth maxWidth="md">
          <DialogContent>
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              title="Prescription PDF"
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Prescription;
