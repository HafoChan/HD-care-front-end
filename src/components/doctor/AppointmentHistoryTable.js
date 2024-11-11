import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const AppointmentHistoryTable = ({ appointments }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Ngày khám</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tiêu đề</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email LH</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Số lần khám</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment, index) => (
            <TableRow
              key={appointment.id}
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{appointment.name}</TableCell>
              <TableCell>{appointment.birthDate}</TableCell>
              <TableCell>{appointment.examDate}</TableCell>
              <TableCell>{appointment.title}</TableCell>
              <TableCell>{appointment.email}</TableCell>
              <TableCell>{appointment.visitCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppointmentHistoryTable;
