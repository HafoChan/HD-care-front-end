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

const PatientTable = ({ patients }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Ngày khám</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Địa chỉ</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email LH</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Số lần khám</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient, index) => (
            <TableRow
              key={patient.id}
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.birthDate}</TableCell>
              <TableCell>{patient.examDate}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.visitCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTable;
