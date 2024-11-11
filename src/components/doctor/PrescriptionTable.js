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

const PrescriptionTable = ({ medicineList }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tên thuốc</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Dạng thuốc</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Số lượng</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Hướng dẫn</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Lưu ý</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medicineList.map((item, index) => (
            <TableRow
              key={item.id}
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.instruction}</TableCell>
              <TableCell>{item.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrescriptionTable;
