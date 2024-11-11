import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  TextField,
  Button,
  Pagination,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/doctor/Sidebar";
import AppointmentTable from "../../components/doctor/AppointmentTable";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AppointmentManagement = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Mock data - thay thế bằng dữ liệu thực tế
  const appointments = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      date: "2024-10-01",
      time: "8:00 - 9:00",
      title: "Tái khái mụn trứng cá",
      email: "nguyenvana@email.com",
      status: "Đã khám",
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      date: "2024-10-01",
      time: "8:00 - 9:00",
      title: "Tái khái mụn trứng cá",
      email: "nguyenvana@email.com",
      status: "Đã khám",
    },
    {
      id: 3,
      name: "Nguyễn Văn A",
      date: "2024-10-01",
      time: "8:00 - 9:00",
      title: "Tái khái mụn trứng cá",
      email: "nguyenvana@email.com",
      status: "Đã khám",
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
          Quản Lý Lịch Hẹn
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
                shrink: true, // Đảm bảo nhãn khôn g bị ẩn khi có giá trị
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="info"
            sx={{ width: 150, textTransform: "none" }}
          >
            Xem chi tiết
          </Button>
        </Box>

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              sx={{
                textTransform: "none",
                fontWeight: value === 0 ? "bold" : "normal",
              }}
              label="Đã xác nhận"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                textTransform: "none",
                fontWeight: value === 1 ? "bold" : "normal",
              }}
              label="Chưa xác nhận"
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                textTransform: "none",
                fontWeight: value === 2 ? "bold" : "normal",
              }}
              label="Đã hoàn tất"
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                textTransform: "none",
                fontWeight: value === 3 ? "bold" : "normal",
              }}
              label="Đã hủy"
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

        {/* Thay appointment ở trong để điều chỉnh giữa các tab */}

        <CustomTabPanel value={value} index={0}>
          <AppointmentTable appointments={appointments} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <AppointmentTable appointments={appointments} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <AppointmentTable appointments={appointments} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={3}>
          <AppointmentTable appointments={appointments} />
        </CustomTabPanel>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={15} color="primary" />
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentManagement;
