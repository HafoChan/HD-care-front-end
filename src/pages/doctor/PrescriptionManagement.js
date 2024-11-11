import React, { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import Sidebar from "../../components/doctor/Sidebar";
import PrescriptionTable from "../../components/doctor/PrescriptionTable";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";

const PrescriptionManagement = () => {
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    gender: "Nữ",
    birthDate: "",
    reason: "",
    examDate: "",
  });

  const [medicine, setMedicine] = useState({
    name: "",
    type: "Tuýt",
    quantity: "",
    instruction: "",
    note: "",
  });

  const [medicineList, setMedicineList] = useState([]);

  const handleAddMedicine = () => {
    setMedicineList([...medicineList, { ...medicine, id: Date.now() }]);
    setMedicine({
      name: "",
      type: "Tuýt",
      quantity: "",
      instruction: "",
      note: "",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        margin: "0 auto",
        marginLeft: "250px", // Đảm bảo nội dung không bị che
        paddingBottom: 8,
      }}
    >
      <Box maxWidth={200}>
        <Sidebar />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "70%",
          margin: "0 auto",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, mt: 4 }}>
            Kê Đơn Thuốc
          </Typography>

          {/* Thông tin bệnh nhân */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 3, mb: 2 }}
          >
            Thông tin bệnh nhân
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <TextField
                fullWidth
                label="Tên bệnh nhân"
                value={patientInfo.name}
                size="small"
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Select
                fullWidth
                value={patientInfo.gender}
                size="small"
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, gender: e.target.value })
                }
              >
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="date"
                label="Ngày sinh"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={patientInfo.birthDate}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, birthDate: e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label="Lý do khám"
                value={patientInfo.reason}
                size="small"
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, reason: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="date"
                label="Ngày khám"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={patientInfo.examDate}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, examDate: e.target.value })
                }
              />
            </Grid>
          </Grid>

          {/* Nhập thông tin thuốc */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 3, mb: 2 }}
          >
            Nhập thông tin thuốc
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <TextField
                fullWidth
                label="Nhập tên thuốc"
                value={medicine.name}
                size="small"
                onChange={(e) =>
                  setMedicine({ ...medicine, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Số lượng"
                type="number"
                size="small"
                value={medicine.quantity}
                onChange={(e) =>
                  setMedicine({ ...medicine, quantity: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Select
                fullWidth
                value={medicine.type}
                size="small"
                onChange={(e) =>
                  setMedicine({ ...medicine, type: e.target.value })
                }
              >
                <MenuItem value="Tuýt">Tuýt</MenuItem>
                <MenuItem value="Viên">Viên</MenuItem>
                <MenuItem value="Gói">Gói</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Hướng dẫn sử dụng"
              multiline
              id="outlined-multiline-static"
              rows={3}
              size="large"
              value={medicine.instruction}
              onChange={(e) =>
                setMedicine({ ...medicine, instruction: e.target.value })
              }
            />
          </Box>

          <Box sx={{ marginY: 3 }}>
            <TextField
              fullWidth
              label="Lưu ý"
              multiline
              id="outlined-multiline-static"
              rows={3}
              size="large"
              value={medicine.note}
              onChange={(e) =>
                setMedicine({ ...medicine, note: e.target.value })
              }
            />
          </Box>

          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddMedicine}
              sx={{ width: 200 }}
            >
              Thêm thuốc
            </Button>
          </Box>

          {/* Bảng danh sách thuốc */}

          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Đơn thuốc
          </Typography>

          <PrescriptionTable medicineList={medicineList} />

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box
              container
              display="flex"
              sx={{ mt: 3, width: "35%", justifyContent: "flex-end" }}
            >
              <Button
                variant="contained"
                fullWidth
                color="warning"
                sx={{
                  mr: 2,
                  paddingTop: 1,
                  alignItems: "center",
                  textTransform: "none",
                  width: 400,
                }}
              >
                <FileCopyRoundedIcon
                  fontSize="small"
                  sx={{
                    color: "white",
                    mr: 1,
                  }}
                />
                Xuất PDF
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{ alignItems: "center", paddingTop: 1 }}
              >
                <SendRoundedIcon
                  fontSize="small"
                  sx={{
                    color: "white",
                    mr: 1,
                    marginBottom: 1,
                    transform: "rotate(-35deg)",
                  }}
                />
                Gửi
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PrescriptionManagement;
