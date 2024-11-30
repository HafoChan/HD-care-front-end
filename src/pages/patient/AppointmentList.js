import React from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Pagination,
  Container,
} from "@mui/material";
import HeaderComponent from "../../components/patient/HeaderComponent";

const appointments = [
  {
    id: 1,
    doctor: "Nguyễn Quốc Huy",
    date: "12-11-2024",
    time: "09:00 - 10:00",
    email: "nqhuy@gmail.com",
    avatar: "https://via.placeholder.com/64",
  },
  {
    id: 2,
    doctor: "Nguyễn Quốc Huy",
    date: "12-11-2024",
    time: "09:00 - 10:00",
    email: "nqhuy@gmail.com",
    avatar: "https://via.placeholder.com/64",
  },
  {
    id: 3,
    doctor: "Nguyễn Quốc Huy",
    date: "12-11-2024",
    time: "09:00 - 10:00",
    email: "nqhuy@gmail.com",
    avatar: "https://via.placeholder.com/64",
  },
  {
    id: 4,
    doctor: "Nguyễn Quốc Huy",
    date: "12-11-2024",
    time: "09:00 - 10:00",
    email: "nqhuy@gmail.com",
    avatar: "https://via.placeholder.com/64",
  },
];

const AppointmentCard = ({ doctor, date, time, email, avatar, isActive }) => (
  <Card
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
        Thăm khám mụn lần 3
      </Typography>
      <Typography variant="body2" color="#1976d2">
        Email LH: {email}
      </Typography>
    </Box>
  </Card>
);

const AppointmentList = () => {
  return (
    <Box>
      <HeaderComponent />

      <Container sx={{ maxWidth: 1200 }}>
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
        {appointments.map((item, index) => (
          <AppointmentCard
            key={item.id}
            doctor={item.doctor}
            date={item.date}
            time={item.time}
            email={item.email}
            avatar={item.avatar}
            isActive={index === 0} // Card đầu tiên được active
          />
        ))}
        <Pagination
          count={15}
          shape="rounded"
          sx={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
        />
      </Container>
    </Box>
  );
};

export default AppointmentList;
