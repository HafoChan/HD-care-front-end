import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Grid,
  Autocomplete,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { doctor } from "../../api/doctor";
import patientApi from "../../api/patient";
import { toast } from "react-toastify";
import { remove } from "../../service/otherService/localStorage";
import Sidebar from "../../components/admin/Sidebar";
import DashboardOverview from "../../components/admin/DashboardOverview";
import DoctorManagement from "../../components/admin/DoctorManagement";
import PatientManagement from "../../components/admin/PatientManagement";
import DoctorModal from "../../components/admin/DoctorModal";
import PatientModal from "../../components/admin/PatientModal";

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#f7f9fc",
  display: "flex",
}));

const MainContent = styled(Box)(({ theme }) => ({
  marginLeft: 280,
  padding: theme.spacing(4),
  width: "100%",
  minHeight: "100vh",
  maxWidth: "calc(100vw - 280px)",
}));

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
  maxWidth: 700,
}));

const AdminInterface = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [selectedProvince, setSelectedProvince] = useState(null); // Lưu tỉnh đã chọn
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Lưu huyện đã chọn
  const [options, setOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageMax, setPageMax] = useState(1);
  const [totalDoctor, setTotalDoctor] = useState(0);

  const [currentPagePatient, setCurrentPagePatient] = useState(1);
  const [pageMaxPatient, setPageMaxPatient] = useState(1);
  const [totalPatient, setTotalPatient] = useState(0);

  const getCity = async () => {
    const data = await axios.get(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    );
    setOptions(data.data); // Set the fetched options
  };

  const handleSelectChange = (type, newValue) => {
    if (type === "province") {
      setSelectedProvince(newValue);
      setSelectedDistrict(null); // Reset huyện khi thay đổi tỉnh
    } else if (type === "district") {
      setSelectedDistrict(newValue);
    }
  };

  const [doctorData, setDoctorData] = useState([]);

  const [patientData, setPatientData] = useState([]);

  const getDoctor = async (page) => {
    try {
      const response = await doctor.getAllByAdmin(page);
      setDoctorData(response.result.content); // Giả sử response.data chứa danh sách bác sĩ
      setPageMax(response.result.totalPages);
      setTotalDoctor(response.result.totalElements);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getPatient = async (page) => {
    try {
      const response = await patientApi.getAllByAdmin(page);
      setPatientData(response.result.content); // Giả sử response.data chứa danh sách bác sĩ
      setPageMaxPatient(response.result.totalPages);
      setTotalPatient(response.result.totalElements);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStatusChange = async (doctorId) => {
    try {
      await doctor.updateBlockDoctor(doctorId); // Gọi API để cập nhật trạng thái
      // Cập nhật lại danh sách bác sĩ sau khi thay đổi trạng thái
      getDoctor(currentPage);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStatusPatientChange = async (patientId) => {
    try {
      await patientApi.updateBlockPatient(patientId); // Gọi API để cập nhật trạng thái
      // Cập nhật lại danh sách bệnh nhân sau khi thay đổi trạng thái
      getPatient(currentPagePatient);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageChangePatient = (event, newPage) => {
    setCurrentPagePatient(newPage);
  };

  const EditDoctorModal = () => (
    <StyledModal
      open={showEditDoctorModal}
      onClose={() => {
        setShowEditDoctorModal(false);
        setSelectedProvince(null);
        setSelectedDistrict(null);
      }}
    >
      <ModalContent>
        <Typography variant="h5" gutterBottom>
          Chỉnh sửa bác sĩ
        </Typography>
        <Box
          component="form"
          sx={{
            mt: 2,
            maxHeight: "80vh", // Giới hạn chiều cao của form
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tên bác sĩ"
              margin="normal"
              sx={{ flex: 1 }}
              defaultValue={selectedDoctor?.name || ""}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              disabled={true}
              sx={{ flex: 1 }}
              defaultValue={selectedDoctor?.email || ""}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              margin="normal"
              disabled={true}
              sx={{ flex: 1 }}
              defaultValue={selectedDoctor?.username || ""}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              margin="normal"
              sx={{ flex: 1 }}
              defaultValue={selectedDoctor?.phone || ""}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Địa chỉ"
              margin="normal"
              sx={{ flex: 1 }}
              defaultValue={selectedDoctor?.address || ""}
            />
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  marginRight: 2,
                }}
              >
                Giới tính:
              </Typography>
              <FormControl>
                <RadioGroup
                  row
                  name="gender"
                  defaultValue={selectedDoctor?.gender?.toLowerCase() || ""}
                >
                  <FormControlLabel
                    value={"nam"}
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel value="nữ" control={<Radio />} label="Nữ" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>

          <Grid container spacing={2} alignItems="center" mt={0.5} mb={1}>
            <Grid item xs={6}>
              <Autocomplete
                size="small"
                value={selectedProvince}
                onChange={(event, newValue) =>
                  handleSelectChange("province", newValue)
                }
                options={options}
                getOptionLabel={(option) => option.Name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tỉnh thành"
                    sx={{ backgroundColor: "white", borderRadius: "4px" }}
                  />
                )}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                size="small"
                value={selectedDistrict}
                onChange={(event, newValue) => {
                  setSelectedDistrict(newValue);
                }}
                options={(selectedProvince && selectedProvince.Districts) || []}
                getOptionLabel={(option) => option.Name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Huyện"
                    sx={{ backgroundColor: "white", borderRadius: "4px" }}
                  />
                )}
                style={{ width: "100%" }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tên phòng khám"
              margin="normal"
              sx={{ flex: 2 }}
              defaultValue={selectedDoctor?.clinicName || ""}
            />
            <TextField
              fullWidth
              label="Giá"
              type="number"
              margin="normal"
              sx={{ flex: 1 }}
              defaultValue={selectedDoctor?.price || ""}
            />
          </Box>

          <TextField
            fullWidth
            label="Chuyên môn"
            margin="normal"
            sx={{ flex: 2 }}
            multiline
            rows={2}
            defaultValue={selectedDoctor?.specialization || ""}
          />

          <TextField
            fullWidth
            label="Kinh nghiệm"
            margin="normal"
            sx={{ flex: 2 }}
            multiline
            rows={4}
            defaultValue={selectedDoctor?.experience || ""}
          />

          <TextField
            fullWidth
            label="Mô tả"
            margin="normal"
            multiline
            rows={4}
            sx={{ flex: 2 }}
            defaultValue={selectedDoctor?.description || ""}
          />

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setShowEditDoctorModal(false);
                setSelectedProvince(null);
                setSelectedDistrict(null);
              }}
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

  const EditPatientModal = () => {
    const [patientInfo, setPatientInfo] = useState({
      username: selectedPatient?.username || "",
      email: selectedPatient?.email || "",
      name: selectedPatient?.name || "",
      phone: selectedPatient?.phone || "",
      address: selectedPatient?.address || "",
      gender: selectedPatient?.gender || "",
      dob: selectedPatient?.dob || "",
    });

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setPatientInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    };

    const handleSubmit = async () => {
      if (
        patientInfo.username === "" ||
        patientInfo.email === "" ||
        patientInfo.name === "" ||
        patientInfo.phone === "" ||
        patientInfo.address === "" ||
        patientInfo.gender === "" ||
        patientInfo.dob === ""
      ) {
        toast.error("Vui lòng nhập đầy đủ thông tin cho khách hàng!");
        return;
      }

      try {
        console.log({
          ...patientInfo,
          id: selectedPatient.id,
        });
        await patientApi.updatePatientForAdmin({
          ...patientInfo,
          id: selectedPatient.id,
        });
        setShowEditPatientModal(false);

        getPatient(currentPagePatient);
      } catch (error) {
        console.error("Error updating patient:", error);
      }
    };

    return (
      <StyledModal
        open={showEditPatientModal}
        onClose={() => setShowEditPatientModal(false)}
      >
        <ModalContent>
          <Typography variant="h5" gutterBottom>
            Chỉnh sửa khách hàng
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Tên khách hàng"
                margin="normal"
                sx={{ flex: 1 }}
                name="name"
                value={patientInfo.name}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                disabled={true}
                sx={{ flex: 1 }}
                name="email"
                value={patientInfo.email}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                margin="normal"
                disabled={true}
                sx={{ flex: 1 }}
                name="username"
                value={patientInfo.username}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                margin="normal"
                sx={{ flex: 1 }}
                name="phone"
                value={patientInfo.phone}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Ngày sinh"
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
                name="dob"
                value={patientInfo.dob}
                onChange={handleInputChange}
              />
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    whiteSpace: "nowrap",
                    marginRight: 2,
                  }}
                >
                  Giới tính:
                </Typography>
                <FormControl>
                  <RadioGroup
                    row
                    name="gender"
                    value={patientInfo.gender}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel
                      value="nam"
                      control={<Radio />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value="nữ"
                      control={<Radio />}
                      label="Nữ"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Địa chỉ"
              margin="normal"
              sx={{ flex: 1 }}
              name="address"
              value={patientInfo.address}
              onChange={handleInputChange}
            />

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setShowEditPatientModal(false)}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Xác nhận
              </Button>
            </Box>
          </Box>
        </ModalContent>
      </StyledModal>
    );
  };

  useEffect(() => {
    getCity();
    getDoctor(currentPage);
    getPatient(currentPagePatient);
  }, []);

  useEffect(() => {
    getCity();
    getDoctor(currentPage);
  }, [currentPage]);

  useEffect(() => {
    getCity();
    getPatient(currentPagePatient);
  }, [currentPagePatient]);

  const handleLogout = () => {
    console.log("Đang thực hiện đăng xuất...");
    remove();
    window.location.href = "/login";
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setShowDoctorModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setShowPatientModal(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const handleDoctorSuccess = () => {
    fetchStatistics();
  };

  const handlePatientSuccess = () => {
    fetchStatistics();
  };

  const fetchStatistics = async () => {
    try {
      // Fetch doctor statistics
      const doctorResponse = await doctor.getAllByAdmin(1);
      if (doctorResponse && doctorResponse.result) {
        setTotalDoctor(doctorResponse.result.totalElements);
      }

      // Fetch patient statistics
      const patientResponse = await patientApi.getAllByAdmin(1);
      if (patientResponse && patientResponse.result) {
        setTotalPatient(patientResponse.result.totalElements);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <StyledBox>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <MainContent>
        {activeTab === "dashboard" && (
          <DashboardOverview
            totalDoctor={totalDoctor}
            totalPatient={totalPatient}
          />
        )}

        {activeTab === "doctors" && (
          <DoctorManagement
            onAddDoctor={handleAddDoctor}
            onEditDoctor={handleEditDoctor}
          />
        )}

        {activeTab === "patients" && (
          <PatientManagement
            onAddPatient={handleAddPatient}
            onEditPatient={handleEditPatient}
          />
        )}
      </MainContent>

      <DoctorModal
        open={showDoctorModal}
        onClose={() => {
          setShowDoctorModal(false);
          setSelectedDoctor(null);
        }}
        doctorData={selectedDoctor}
        onSuccess={handleDoctorSuccess}
      />

      <PatientModal
        open={showPatientModal}
        onClose={() => {
          setShowPatientModal(false);
          setSelectedPatient(null);
        }}
        patientData={selectedPatient}
        onSuccess={handlePatientSuccess}
      />

      <EditDoctorModal />
      <EditPatientModal />
    </StyledBox>
  );
};

export default AdminInterface;
