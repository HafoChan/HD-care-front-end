import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
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
  Modal,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import { FaUserMd, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdDashboard,
  MdLocalHospital,
  MdPeople,
} from "react-icons/md";
import { AppBar, Toolbar, Grid, Avatar } from "@mui/material";
import { Menu as MenuIcon, Settings as SettingsIcon, Person as PersonIcon, PieChart as PieChartIcon, ExitToApp as LogoutIcon } from "@mui/icons-material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { doctor } from "../../api/doctor";

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
}));

const StyledDrawer = styled(Drawer)(() => ({
  minWidth: 280,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 280,
    boxSizing: "border-box",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
  },
}));

const drawerWidth = 240;

const StyledModal = styled(Modal)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(() => ({
  backgroundColor: "white",
  padding: 32,
  borderRadius: 8,
  width: "100%",
  maxWidth: 500,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: "8px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.08)",
    cursor: "pointer",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(25, 118, 210, 0.12)",
    "&:hover": {
      backgroundColor: "rgba(25, 118, 210, 0.18)",
    },
  },
}));

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
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
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

const AdminInterface = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const dummyDoctors = [
    {
      id: 1,
      name: "Dr. John Smith",
      email: "johnsmith@yopmail.com",
      username: "johnSmith",
      password: "password123",
      phone: "0123456789",
      address: "123 Main Street abcdef 0123456789",
      gender: "Male",
      specialty: "Cardiology",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      email: "sarahjohnson@yopmail.com",
      username: "sarahJohnson",
      password: "password123",
      phone: "0987654321",
      address: "456 Elm Street",
      gender: "Female",
      specialty: "Pediatrics",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Dr. Michael Brown",
      email: "michaelbrown@yopmail.com",
      username: "michaelBrown",
      password: "password123",
      phone: "0678945612",
      address: "789 Pine Avenue",
      gender: "Male",
      specialty: "Neurology",
      status: "Active",
    },
    {
      id: 4,
      name: "Dr. Nguyễn Viết Nam",
      email: "doctornam@yopmail.com",
      username: "doctorNamV",
      password: "12345678",
      phone: "0348278226",
      address: "210, ngõ 317",
      gender: "Nam",
      specialty: "General Medicine",
      status: "Active",
    },
  ];

  const dummyPatients = [
    { id: "P001", name: "James Wilson", status: "Active" },
    { id: "P002", name: "Emma Davis", status: "Inactive" },
    { id: "P003", name: "Robert Taylor", status: "Active" },
  ];

  const handleStatusChange = (item, type) => {
    console.log(`Changed status for ${type} ${item.id}`);
  };

  const EditDoctorModal = () => (
    <StyledModal
      open={showEditDoctorModal}
      onClose={() => setShowEditDoctorModal(false)}
    >
      <ModalContent>
        <Typography variant="h5" gutterBottom>
          Chỉnh sửa bác sĩ
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            defaultValue={selectedDoctor?.name || ""}
          />
          <TextField
            fullWidth
            label="Specialty"
            margin="normal"
            defaultValue={selectedDoctor?.specialty || ""}
          />
          <TextField fullWidth label="Email" type="email" margin="normal" />
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowEditDoctorModal(false)}
            >
              Hủy
            </Button>
            <Button variant="contained" color="primary">
              Lưu thay đổi
            </Button>
          </Box>
        </Box>
      </ModalContent>
    </StyledModal>
  );

  const EditPatientModal = () => (
    <StyledModal
      open={showEditPatientModal}
      onClose={() => setShowEditPatientModal(false)}
    >
      <ModalContent>
        <Typography variant="h5" gutterBottom>
          Edit Patient
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            defaultValue={selectedPatient?.name || ""}
          />
          <TextField fullWidth label="Email" type="email" margin="normal" />
          <TextField
            fullWidth
            label="Health Information"
            multiline
            rows={3}
            margin="normal"
          />
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowEditPatientModal(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </ModalContent>
    </StyledModal>
  );

  const DoctorModal = () => (
    <StyledModal
      open={showDoctorModal}
      onClose={() => setShowDoctorModal(false)}
    >
      <ModalContent>
        <Typography variant="h5" gutterBottom>
          Thêm bác sĩ
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField fullWidth label="Name" margin="normal" />
          <TextField fullWidth label="Specialty" margin="normal" />
          <TextField fullWidth label="Email" type="email" margin="normal" />
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowDoctorModal(false)}
            >
              Hủy
            </Button>
            <Button variant="contained" color="primary">
              Xác nhận
            </Button>
          </Box>
        </Box>
      </ModalContent>
    </StyledModal>
  );

  const PatientModal = () => (
    <StyledModal
      open={showPatientModal}
      onClose={() => setShowPatientModal(false)}
    >
      <ModalContent>
        <Typography variant="h5" gutterBottom>
          Thêm khách hàng
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField fullWidth label="Name" margin="normal" />
          <TextField fullWidth label="Email" type="email" margin="normal" />
          <TextField
            fullWidth
            label="Health Information"
            multiline
            rows={3}
            margin="normal"
          />
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowPatientModal(false)}
            >
              Hủy
            </Button>
            <Button variant="contained" color="primary">
              Xác nhận
            </Button>
          </Box>
        </Box>
      </ModalContent>
    </StyledModal>
  );
  
  const AdminDashboard = () => {
    const [open, setOpen] = useState(true);
    const [doctorsData, setDoctorData] = useState([])
  
    useEffect(() => {
      const fetchDoctorData = async () => {
        try {
          const response = await doctor.getStatistic();
          setDoctorData(response.result);
        } catch (error) {
          console.error("Failed to fetch doctor statistics:", error);
        }
      };
    
      fetchDoctorData();
    }, []);
    const handleDrawerToggle = () => {
      setOpen(!open);
    };
  
    return (
      <Box sx={{ display: "flex", margin: 2 }}>
  
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            margin: 0,
          }}
        >
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Top Doctors by Patient Visits
            </Typography>
            <Grid container spacing={3}>
              {doctorsData?.map((doctor, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      position: "relative",
                      textAlign: "center",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)"
                      }
                    }}
                  >
                    <Box sx={{ position: "absolute", top: -20, left: 20 }}>
                      <EmojiEventsIcon
                        sx={{
                          fontSize: 40,
                          color:
                            index === 0
                              ? "#FFD700"
                              : index === 1
                              ? "#C0C0C0"
                              : "#CD7F32",
                        }}
                      />
                    </Box>
                    <Avatar
                      src={doctor.img}
                      alt={doctor.name}
                      sx={{
                        width: 100,
                        height: 100,
                        margin: "0 auto 16px",
                        border: 4,
                        borderColor: doctor.color,
                      }}
                    />
                    <Typography variant="h6">{doctor.name}</Typography>
                    <Typography color="textSecondary" sx={{ mt: 1 }}>
                      {doctor.count} lượt khám
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        bgcolor: "primary.light",
                        borderRadius: 20,
                        py: 1,
                        px: 2,
                        display: "inline-block",
                      }}
                    >
                     <Typography color="black">
                      Thứ hạng {index + 1}
                    </Typography>

                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Box>
    );
  };
    return (
    <StyledBox>
      <Box sx={{ display: "flex" }}>
        <StyledDrawer variant="permanent">
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trang quản trị
            </Typography>
          </Box>
          <List>
            <StyledListItem
              button
              selected={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            >
              <ListItemIcon style={{ fontSize: 24 }}>
                <MdDashboard
                  color={activeTab === "dashboard" ? "#1976d2" : "#666"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Bảng điều khiển"
                sx={{
                  color: activeTab === "dashboard" ? "#1976d2" : "inherit",
                }}
              />
              
            </StyledListItem>
            <StyledListItem
              button
              selected={activeTab === "doctors"}
              onClick={() => setActiveTab("doctors")}
            >
              <ListItemIcon style={{ fontSize: 24 }}>
                <MdLocalHospital
                  color={activeTab === "doctors" ? "#1976d2" : "#666"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý bác sĩ"
                sx={{
                  color: activeTab === "doctors" ? "#1976d2" : "inherit",
                }}
              />
            </StyledListItem>
            <StyledListItem
              button
              selected={activeTab === "patients"}
              onClick={() => setActiveTab("patients")}
            >
              <ListItemIcon style={{ fontSize: 24 }}>
                <MdPeople
                  color={activeTab === "patients" ? "#1976d2" : "#666"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Quản lý khách hàng"
                sx={{
                  color: activeTab === "patients" ? "#1976d2" : "inherit",
                }}
              />
            </StyledListItem>
            <StyledListItem
              button
              selected={activeTab === "statis"}
              onClick={() => setActiveTab("statis")}
            >
              <ListItemIcon style={{ fontSize: 24 }}>
                <MdPeople
                  color={activeTab === "statis" ? "#1976d2" : "#666"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Thống kê"
                sx={{
                  color: activeTab === "statis" ? "#1976d2" : "inherit",
                }}
              />
            </StyledListItem>
          </List>
        </StyledDrawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {activeTab === "dashboard" && (
            <>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Paper sx={{ p: 3, maxWidth: 300, justifyContent: "center", flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaUserMd size={24} color="#1976d2" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1">Tổng bác số sĩ</Typography>
                    <Typography variant="h4">{dummyDoctors.length}</Typography>
                  </Box>
                </Box>
              </Paper>
              <Paper sx={{ p: 3, maxWidth: 300, justifyContent: "center", flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaUsers size={24} color="#2e7d32" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1">
                      Tổng số khách hàng
                    </Typography>
                    <Typography variant="h4">{dummyPatients.length}</Typography>
                  </Box>
                </Box>
              </Paper>
            
            </Box>
            <AdminDashboard/>
            </>
          )}

          {activeTab === "doctors" && (
            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h5">Quản lý bác sĩ</Typography>
                <Box>
                  <Button
                    style={{ marginRight: 10, textTransform: "none" }}
                    variant="contained"
                    onClick={() => setShowDoctorModal(true)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    style={{ textTransform: "none" }}
                    variant="contained"
                    startIcon={<MdAdd />}
                    onClick={() => setShowDoctorModal(true)}
                  >
                    Thêm bác sĩ
                  </Button>
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Số điện thoại</TableCell>
                      <TableCell>Địa chỉ</TableCell>
                      <TableCell>Giới tính</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dummyDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell>{doctor.name}</TableCell>
                        <TableCell>{doctor.email}</TableCell>
                        <TableCell>{doctor.phone}</TableCell>
                        <TableCell>{doctor.address}</TableCell>
                        <TableCell>{doctor.gender}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IOSSwitch
                              checked={doctor.status === "Active"}
                              onChange={() =>
                                handleStatusChange(doctor, "doctor")
                              }
                            />
                            <Typography
                              sx={{
                                color:
                                  doctor.status === "Active"
                                    ? "#2ECA45"
                                    : "#666",
                                fontSize: "0.875rem",
                              }}
                            >
                              {doctor.status}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowEditDoctorModal(true);
                            }}
                          >
                            <MdEdit />
                          </IconButton>
                          <IconButton color="error">
                            <MdDelete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {activeTab === "patients" && (
            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h5">Quản lý khách hàng</Typography>
                <Box>
                  <Button
                    style={{ marginRight: 10, textTransform: "none" }}
                    variant="contained"
                    onClick={() => setShowDoctorModal(true)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    style={{ textTransform: "none" }}
                    variant="contained"
                    startIcon={<MdAdd />}
                    onClick={() => setShowPatientModal(true)}
                  >
                    Thêm khách hàng
                  </Button>
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dummyPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.id}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IOSSwitch
                              checked={patient.status === "Active"}
                              onChange={() =>
                                handleStatusChange(patient, "patient")
                              }
                            />
                            <Typography
                              sx={{
                                color:
                                  patient.status === "Active"
                                    ? "#2ECA45"
                                    : "#666",
                                fontSize: "0.875rem",
                              }}
                            >
                              {patient.status}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowEditPatientModal(true);
                            }}
                          >
                            <MdEdit />
                          </IconButton>
                          <IconButton color="error">
                            <MdDelete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          
        </Box>
      </Box>

      <DoctorModal />
      <PatientModal />
      <EditDoctorModal />
      <EditPatientModal />

    </StyledBox>
  );
};

export default AdminInterface;
