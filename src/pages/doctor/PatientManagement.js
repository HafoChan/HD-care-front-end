import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/doctor/Sidebar";
import PatientTable from "../../components/doctor/PatientTable";
import { doctor } from "../../api/doctor";
import { useNavigate } from "react-router-dom";

const PatientManagement = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );
  const [doctorId, setDoctorId] = useState();
  const [patients, setPatients] = useState();
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [keyword, setKeyword] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
    fetchData(currentPage);
  }, [selectedDate, doctorId, currentPage, keyword]);

  const fetchData = async (page) => {
    try {
      console.log(doctorId);
      const response = await doctor.getPatient(doctorId, page, keyword);
      if (response?.code === 1000) {
        setPatients(response?.result?.content);
        setTotalPages(response?.result?.totalPages);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
  };

  const handleViewDetail = () => {
    if (selectedPatientId) {
      navigate(`/doctor/patient-management/${selectedPatientId}`);
    } else {
      // Có thể hiển thị thông báo yêu cầu chọn bệnh nhân
      alert("Vui lòng chọn bệnh nhân để xem chi tiết");
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  return (
    <Box sx={{ backgroundColor: "white", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          margin: "0 auto",
          marginLeft: "230px", // Đảm bảo nội dung không bị che
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
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#1976d2", fontWeight: 500, mb: 4, mt: 4 }}
          >
            Quản Lý Bệnh Nhân
          </Typography>

          <Box display="flex" gap={2} mb={3}>
            <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
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

            {/* <Button
            variant="contained"
            color="primary"
            sx={{ width: 150, textTransform: "none" }}
          >
            Kê đơn thuốc
          </Button> */}

            <Button
              variant="contained"
              color="info"
              sx={{ width: 150, textTransform: "none" }}
              onClick={handleViewDetail}
              disabled={!selectedPatientId}
            >
              Xem chi tiết
            </Button>
          </Box>

          <PatientTable
            patients={patients}
            selectedPatientId={selectedPatientId}
            onPatientSelect={handlePatientSelect}
          />

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={patients ? totalPages : 0}
              page={currentPage}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientManagement;
