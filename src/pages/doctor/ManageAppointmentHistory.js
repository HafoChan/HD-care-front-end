import React, { useState } from "react";
import { Box, Typography, TextField, Button, Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/doctor/Sidebar";
import AppointmentHistoryTable from "../../components/doctor/AppointmentHistoryTable";

const ManageAppointmentHistory = () => {
  const [selectedDate, setSelectedDate] = useState("");

  // Mock data - thay thế bằng dữ liệu thực tế
  const appointments = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      birthDate: "1990-01-01",
      examDate: "2024-03-20",
      title: "Tái khái mụn trứng cá",
      email: "nguyenvana@email.com",
      visitCount: 3,
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      birthDate: "1990-01-01",
      examDate: "2024-03-20",
      title: "Khám mụn đầu đen",
      email: "nguyenvana@email.com",
      visitCount: 4,
    },
    {
      id: 3,
      name: "Nguyễn Văn A",
      birthDate: "1990-01-01",
      examDate: "2024-03-20",
      title: "Khám trị sẹo rổ",
      email: "nguyenvana@email.com",
      visitCount: 3,
    },
  ];

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
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4, mt: 4 }}>
          Lịch sử khám
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

        <AppointmentHistoryTable appointments={appointments} />

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={15} color="primary" />
        </Box>
      </Box>
    </Box>
  );
};

export default ManageAppointmentHistory;
