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
import patientApi from "../../api/patient";
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

const PatientManagement = ({ onAddPatient, onEditPatient }) => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMax, setPageMax] = useState(1);
  const [totalPatient, setTotalPatient] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getPatient = async (page) => {
    try {
      setLoading(true);
      const response = await patientApi.getAllByAdmin(page);
      setPatientData(response.result.content);
      setPageMax(response.result.totalPages);
      setTotalPatient(response.result.totalElements);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleBlockChange = async (event, patientId) => {
    event.stopPropagation();
    try {
      await patientApi.updateBlockPatient(patientId);
      getPatient(currentPage);
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

  const filteredPatients = patientData.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getPatient(currentPage);
  }, [currentPage]);

  return (
    <Box>
      <PageTitle variant="h4">Quản lý khách hàng</PageTitle>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
        }}
      >
        <SearchBox
          placeholder="Tìm kiếm khách hàng..."
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
                navigate("/admin/patient-detail", {
                  state: { patient: selectedRow },
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
            onClick={onAddPatient}
          >
            Thêm khách hàng
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
                <TableCell>Tên tài khoản</TableCell>
                <TableCell>Hoạt động</TableCell>
                <TableCell>Khóa</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <StyledTableRow
                  key={patient.id}
                  onClick={() => setSelectedRow(patient)}
                  selected={selectedRow?.id === patient.id}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {patient?.name}
                      {patient?.verified && (
                        <Tooltip title="Đã xác thực">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <MdOutlineVerified color="#1976d2" size={18} />
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{patient?.email}</TableCell>
                  <TableCell>{patient?.phone}</TableCell>
                  <TableCell>{patient?.username}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IOSSwitch
                        checked={patient?.enable === true}
                        // disabled
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IOSSwitch
                        checked={patient?.blocked === true}
                        onChange={(e) => handleBlockChange(e, patient?.id)}
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
                          onEditPatient(patient);
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

      {filteredPatients.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="body1" color="#666666">
            Không tìm thấy khách hàng nào phù hợp.
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
          Tổng cộng: {totalPatient} khách hàng
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

export default PatientManagement;
