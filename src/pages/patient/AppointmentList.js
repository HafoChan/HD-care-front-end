import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  Card,
  Avatar,
  Pagination,
  Container,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Button,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import HeaderComponent from "../../components/patient/HeaderComponent";
import { appointment } from "../../api/appointment";
import patientApi from "../../api/patient";

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

const AppointmentCard = ({
  doctor,
  date,
  time,
  email,
  avatar,
  isActive,
  title,
  onclick,
}) => (
  <Card
    onClick={onclick}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      py: "16px",
      px: 8,
      marginBottom: "16px",
      border: isActive ? "2px solid #1976d2" : "1px solid #ddd",
      boxShadow: isActive ? "0px 4px 8px rgba(25, 118, 210, 0.2)" : "none",
      "&:hover": {
        border: "2px solid #1976d2",
      },
    }}
  >
    <Box display="flex" alignItems="center">
      <Avatar
        src={avatar}
        alt={doctor}
        sx={{ width: 64, height: 64, marginRight: 4 }}
      />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" color="#1976d2">
          Bác sĩ {doctor}
        </Typography>
        <Typography variant="body2">Ngày hẹn: {date}</Typography>
        <Typography variant="body2">Thời gian: {time}</Typography>
      </Box>
    </Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Sắp xếp các phần tử theo cột
        alignItems: "flex-end", // Căn phải
      }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: "bold", mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="#1976d2">
        Email LH: {email}
      </Typography>
    </Box>
  </Card>
);

const AppointmentList = () => {
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [localDate, setLocalDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );
  const [selectedDate, setSelectedDate] = useState(localDate);

  const [status, setStatus] = useState();
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);
  const [appointmentList, setAppointmentList] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  const fetchData = async () => {
    try {
      let response;
      if (week === null && month === null) {
        response = await appointment.getAppointmentByPatientId(
          id,
          selectedDate,
          null,
          null,
          status,
          currentPage
        );
      } else {
        response = await appointment.getAppointmentByPatientId(
          id,
          selectedDate,
          week,
          month,
          status,
          currentPage
        );
      }

      if (response.code === 1000) {
        console.log(response);
        setAppointmentList(response.result.content);
        setTotalPages(response.result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterMonth = (e) => {
    if (e.target.value === "month") {
      setMonth(selectedDate);
      setWeek(null);
    } else if (e.target.value === "week") {
      setWeek(selectedDate);
      setMonth(null);
    } else {
      setWeek(null);
      setMonth(null);
      setSelectedDate(selectedDate);
    }
  };

  const handleFilterStatus = (e) => {
    if (e.target.value === "CONFIRMED") setStatus("CONFIRMED");
    else if (e.target.value === "PENDING") setStatus("PENDING");
    else if (e.target.value === "COMPLETED") setStatus("COMPLETED");
    else if (e.target.value === "CANCELLED") setStatus("CANCELLED");
    else setStatus(null);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (month !== null) {
      setMonth(e.target.value);
    }
    if (week !== null) {
      setWeek(e.target.value);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleDetailClick = () => {
    if (selectedRow) {
      navigate(`/appointment-list/${selectedRow}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, selectedDate, week, month, status, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await patientApi.getInfo();
        console.log(response);
        if (response.code === 1000) setId(response.result.id);
      } catch (e) {
        console.error("Error fetching patient info:", e);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <HeaderComponent />

      <Container sx={{ maxWidth: 1200, pb: 8 }}>
        <div
          style={{
            width: "100%",
            height: "1.1px",
            backgroundColor: "#cccccc",
            margin: "20px 0 40px",
          }}
        />
        <Typography variant="h5" fontWeight="bold" marginBottom="16px">
          Lịch hẹn của bạn
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "end", alignItems: "center", mb: 2 }}
        >
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label" size="small">
                Lọc
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                size="small"
                onChange={(e) => handleFilterMonth(e)}
                label="Lọc"
              >
                <MenuItem value="cancel">Bỏ lọc</MenuItem>
                <MenuItem value="week">Tuần này</MenuItem>
                <MenuItem value="month">Tháng này</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label" size="small">
                Trạng thái
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                size="small"
                onChange={(e) => handleFilterStatus(e)}
                label="Trạng thái"
              >
                <MenuItem value="noFilter">Bỏ lọc</MenuItem>
                <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <Button
              variant="contained"
              color="info"
              sx={{ width: "100%", textTransform: "none" }}
              onClick={handleDetailClick}
              disabled={!selectedRow}
            >
              Xem chi tiết
            </Button>
          </Grid>
        </Grid>

        {appointmentList?.length > 0 ? (
          appointmentList?.map((item, index) => (
            <AppointmentCard
              key={item?.id}
              doctor={item?.nameDoctor}
              date={item?.start?.split(" ")[0]}
              time={`${item?.start?.split(" ")[1]} - ${
                item?.end?.split(" ")[1]
              }`}
              email={item?.email}
              avatar={item?.img}
              title={item?.title}
              isActive={selectedRow === item?.id}
              onclick={() => handleRowClick(item?.id)}
            />
          ))
        ) : (
          <Typography variant="body1">Không có lịch hẹn nào.</Typography>
        )}

        <Box display="flex" justifyContent="center" marginTop={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default AppointmentList;
