import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Switch,
  Chip,
  Tooltip,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { MdAdd, MdEdit, MdSearch, MdOutlineVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { doctor } from "../../api/doctor";
import { styled } from "@mui/system";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(() => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2ECA45",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: "background-color 500ms",
  },
}));

const StyledTableContainer = styled(TableContainer)(() => ({
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
}));

const StyledTableRow = styled(TableRow)(({ selected }) => ({
  backgroundColor: selected ? "rgba(25, 118, 210, 0.04)" : "white",
  borderRadius: 12,
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  position: "relative",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.04)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
  },
  "& td": {
    border: "none",
    padding: "16px 24px",
    "&:first-of-type": {
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    "&:last-of-type": {
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
  },
}));

const StyledTableHead = styled(TableHead)(() => ({
  "& th": {
    fontWeight: 600,
    padding: "16px 24px",
    fontSize: "0.875rem",
    color: "#666666",
    backgroundColor: "transparent",
    borderBottom: "none",
  },
}));

const PageTitle = styled(Typography)(() => ({
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 24,
  position: "relative",
  paddingBottom: 12,
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1976d2",
  },
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: 8,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 500,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
  },
}));

const AddButton = styled(ActionButton)(() => ({
  backgroundColor: "#1976d2",
  color: "white",
  "&:hover": {
    backgroundColor: "#1565c0",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(25, 118, 210, 0.2)",
  },
}));

const ViewButton = styled(ActionButton)(() => ({
  backgroundColor: "#f5f5f5",
  color: "#333",
  "&:hover": {
    backgroundColor: "#e0e0e0",
    transform: "translateY(-2px)",
  },
}));

const SearchBox = styled(TextField)(() => ({
  maxWidth: 300,
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    transition: "all 0.3s",
    "&:hover": {
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },
  },
}));

const DoctorManagement = ({ onAddDoctor, onEditDoctor }) => {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMax, setPageMax] = useState(1);
  const [totalDoctor, setTotalDoctor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getDoctor = async (page) => {
    try {
      setLoading(true);
      const response = await doctor.getAllByAdmin(page);
      setDoctorData(response.result.content);
      setPageMax(response.result.totalPages);
      setTotalDoctor(response.result.totalElements);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleBlockChange = async (event, doctorId) => {
    event.stopPropagation();
    try {
      await doctor.updateBlockDoctor(doctorId);
      getDoctor(currentPage);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDoctors = doctorData.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getDoctor(currentPage);
  }, [currentPage]);

  return (
    <Box>
      <PageTitle variant="h4">Quản lý bác sĩ</PageTitle>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
        }}
      >
        <SearchBox
          placeholder="Tìm kiếm bác sĩ..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdSearch color="#666" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <ViewButton
            variant="contained"
            onClick={() => {
              if (selectedRow) {
                navigate("/admin/doctor-detail", {
                  state: { doctor: selectedRow },
                });
              }
            }}
            disabled={!selectedRow}
          >
            Xem chi tiết
          </ViewButton>

          <AddButton
            variant="contained"
            startIcon={<MdAdd />}
            onClick={onAddDoctor}
          >
            Thêm bác sĩ
          </AddButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Hoạt động</TableCell>
                <TableCell>Khóa</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <StyledTableRow
                  key={doctor?.id}
                  onClick={() => setSelectedRow(doctor)}
                  selected={selectedRow?.id === doctor?.id}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {doctor?.name}
                      {doctor?.verified && (
                        <Tooltip title="Đã xác thực">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <MdOutlineVerified color="#1976d2" size={18} />
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{doctor?.email}</TableCell>
                  <TableCell>{doctor?.phone}</TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Tooltip
                      title={`${doctor?.address} - ${doctor?.district} - ${doctor?.city}`}
                    >
                      <Typography noWrap>
                        {doctor?.address} - {doctor?.district} - {doctor?.city}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IOSSwitch
                        checked={doctor?.enable === true}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IOSSwitch
                        checked={doctor?.blocked === true}
                        onChange={(e) => handleBlockChange(e, doctor?.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDoctor(doctor);
                        }}
                        sx={{
                          backgroundColor: "rgba(25, 118, 210, 0.05)",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                          },
                        }}
                      >
                        <MdEdit />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

      {filteredDoctors.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="body1" color="#666666">
            Không tìm thấy bác sĩ nào phù hợp.
          </Typography>
        </Box>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop={3}
      >
        <Typography variant="body2" color="#666666">
          Tổng cộng: {totalDoctor} bác sĩ
        </Typography>
        <Pagination
          count={pageMax}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 1.5,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default DoctorManagement;
