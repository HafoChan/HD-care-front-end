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

const AppointmentTable = ({ appointments }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>ID bệnh nhân</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Ngày khám</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tiêu đề</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email LH</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments?.content?.map((appointment, index) => (
            <TableRow
              key={appointment.id}
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
            >
              <TableCell>{appointment.id}</TableCell>
              <TableCell>{appointment.name}</TableCell>
              <TableCell>{appointment.start.split(" ")[0]}</TableCell>
              <TableCell>
                {appointment.start.split(" ")[1]} -{" "}
                {appointment.end.split(" ")[1]}
              </TableCell>
              <TableCell>{appointment.title}</TableCell>
              <TableCell>{appointment.email}</TableCell>
              <TableCell>{appointment.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppointmentTable;
