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

const PatientTable = ({ patients, selectedPatientId, onPatientSelect }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold", width: 80 }}>
              ID bệnh nhân
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", width: 120 }}>
              Họ và tên
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Ngày khám</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Địa chỉ</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email LH</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>SĐT</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Số lần khám</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients?.map((patient) => (
            <TableRow
              key={patient.id}
              onClick={() => onPatientSelect(patient.id)}
              sx={{
                cursor: "pointer",
                backgroundColor:
                  selectedPatientId === patient.id ? "#edf4fc" : "inherit",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <TableCell sx={{ width: 80 }}>{patient.id}</TableCell>
              <TableCell sx={{ width: 120 }}>{patient.name}</TableCell>
              <TableCell>{patient.dob}</TableCell>
              <TableCell>{patient.date.split("T")[0]}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>{patient.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTable;
