import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  TextField,
  Button,
  Pagination,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/doctor/Sidebar";
import AppointmentTable from "../../components/doctor/AppointmentTable";
import { appointment } from "../../api/appointment";
import { doctor } from "../../api/doctor";
import { useNavigate } from "react-router-dom";

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
  const [appointments, setAppointments] = useState();
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );

  const [value, setValue] = React.useState(0);
  const [dateFilter, setDateFilter] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);

  const [doctorId, setDoctorId] = useState();
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPage(1);
    fetchData(newValue, 1);
  };

  const handleDateFilter = (e) => {
    console.log(e.target.value);
    setDateFilter(e.target.value);
  };

  const fetchData = async (value, page) => {
    const status = filterAppointment(value);
    let response;

    try {
      if (dateFilter === "today" || dateFilter === "cancel") {
        response = await appointment.getAppointmentByDoctor(
          doctorId,
          status,
          selectedDate,
          page,
          keyword
        );
      } else {
        const week = dateFilter === "week" ? selectedDate : null;
        const month = dateFilter === "month" ? selectedDate : null;

        response = await appointment.getAppointmentFilter(
          doctorId,
          week,
          month,
          status,
          page,
          keyword
        );
      }

      console.log(response);
      if (response.code === 1000) {
        setAppointments(response.result);
      } else {
        console.error("Error fetching appointment data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  useEffect(() => {
    fetchData(value, currentPage);
  }, [value, dateFilter, selectedDate, currentPage, doctorId, keyword]);

  useEffect(() => {
    doctor
      .getInfo()
      .then((response) => {
        setDoctorId(response?.result.id);
      })
      .catch((error) => console.error("Error getting doctor info:", error));
  }, []);

  const filterAppointment = (value) => {
    if (value === 0) return "PENDING";
    else if (value === 1) return "CONFIRMED";
    else if (value === 2) return "COMPLETED";
    else return "CANCELLED";
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    fetchData(value, newPage);
  };

  const handleChangeSearch = (e) => {
    setKeyword(e.target.value);
  };

  const handleViewDetail = () => {
    if (selectedRow) {
      navigate(`/doctor/appointment-management/${selectedRow}`);
    } else {
      alert("Vui lòng chọn cuộc hẹn để xem chi tiết");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "white",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          margin: "0 auto",
          marginLeft: "230px",
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
            Quản Lý Lịch Hẹn
          </Typography>

          <Box display="flex" gap={2} mb={3}>
            <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search"
                onChange={handleChangeSearch}
                value={keyword}
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

            <Box>
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="demo-simple-select-label" size="small">
                  Lọc
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  size="small"
                  value={dateFilter}
                  onChange={(e) => handleDateFilter(e)}
                  label="Lọc"
                >
                  <MenuItem value="cancel">Bỏ lọc</MenuItem>
                  <MenuItem value="all">Tất cả ngày</MenuItem>
                  <MenuItem value="today">Hôm nay</MenuItem>
                  <MenuItem value="week">Tuần này</MenuItem>
                  <MenuItem value="month">Tháng này</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              color="info"
              sx={{ width: 150, textTransform: "none" }}
              onClick={handleViewDetail}
              disabled={!selectedRow}
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
                label="Chưa xác nhận"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  textTransform: "none",
                  fontWeight: value === 1 ? "bold" : "normal",
                }}
                label="Đã xác nhận"
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
            <AppointmentTable
              appointments={appointments}
              doctorId={doctorId}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <AppointmentTable
              appointments={appointments}
              doctorId={doctorId}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          </CustomTabPanel>

          <CustomTabPanel value={value} index={2}>
            <AppointmentTable
              appointments={appointments}
              doctorId={doctorId}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          </CustomTabPanel>

          <CustomTabPanel value={value} index={3}>
            <AppointmentTable
              appointments={appointments}
              doctorId={doctorId}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
            />
          </CustomTabPanel>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={appointments ? appointments.totalPages : 0}
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

export default AppointmentManagement;
