import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/doctor/Sidebar";
import PatientTable from "../../components/doctor/PatientTable";
import { doctor } from "../../api/doctor";

const PatientManagement = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );
  const [doctorId, setDoctorId] = useState();
  const [patients, setPatients] = useState();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await doctor.getInfo();
        setDoctorId(response.result.id);
      } catch (error) {
        console.error("Error getting doctor info:", error);
      }
    };

    fetchDoctorInfo();
  }, []);

  // Thêm lọc thì sẽ thêm điều kiện để useEffect load
  useEffect(() => {
    fetchData();
  }, [selectedDate, doctorId]);

  const fetchData = async () => {
    try {
      console.log(doctorId);
      const response = await doctor.getPatient(doctorId);
      if (response?.code === 1000) {
        setPatients(response?.result);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
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
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4, mt: 4 }}>
          Quản Lý Bệnh Nhân
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                ),
              }}
            />
          </Box>

          <Box display="flex" alignItems="center" sx={{ width: 200 }}>
            <TextField
              fullWidth
              size="small"
              type="date" // Thay đổi type thành "date"
              value={selectedDate} // Liên kết với trạng thái
              onChange={(e) => setSelectedDate(e.target.value)} // Cập nhật trạng thái khi chọn ngày
              InputLabelProps={{
                shrink: true, // Đảm bảo nhãn không bị ẩn khi có giá trị
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ width: 150, textTransform: "none" }}
          >
            Kê đơn thuốc
          </Button>

          <Button
            variant="contained"
            color="info"
            sx={{ width: 150, textTransform: "none" }}
          >
            Xem chi tiết
          </Button>
        </Box>

        <PatientTable patients={patients} />

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={15} color="primary" />
        </Box>
      </Box>
    </Box>
  );
};

export default PatientManagement;
