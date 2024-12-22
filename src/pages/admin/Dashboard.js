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
  Grid,
  Autocomplete,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Pagination,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import { FaUserMd, FaUsers } from "react-icons/fa";
import {
  MdEdit,
  MdAdd,
  MdDashboard,
  MdLocalHospital,
  MdPeople,
} from "react-icons/md";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { doctor } from "../../api/doctor";
import patientApi from "../../api/patient";
import { toast } from "react-toastify";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { remove } from "../../service/otherService/localStorage";

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
  maxWidth: 700,
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowPatient, setSelectedRowPatient] = useState(null);

  const [selectedProvince, setSelectedProvince] = useState(null); // Lưu tỉnh đã chọn
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Lưu huyện đã chọn
  const [options, setOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageMax, setPageMax] = useState(1);
  const [totalDoctor, setTotalDoctor] = useState();

  const [currentPagePatient, setCurrentPagePatient] = useState(1);
  const [pageMaxPatient, setPageMaxPatient] = useState(1);
  const [totalPatient, setTotalPatient] = useState();

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
      await doctor.updateEnableDoctor(doctorId); // Gọi API để cập nhật trạng thái
      // Cập nhật lại danh sách bác sĩ sau khi thay đổi trạng thái
      getDoctor(currentPage);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStatusPatientChange = async (patientId) => {
    try {
      await patientApi.updateEnablePatient(patientId); // Gọi API để cập nhật trạng thái
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
              sx={{ flex: 1 }}
              defaultValue={selectedDoctor?.email || ""}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              margin="normal"
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

  const DoctorModal = () => {
    const [imgFile, setImgFile] = useState(null); // State để lưu file ảnh
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      username: "",
      password: "",
      phone: "",
      address: "",
      gender: "Nam", // Mặc định là Nam
      city: "",
      district: "",
    });

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImgFile(file);
      }
    };

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleSubmit = () => {
      const createUserRequest = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        city: selectedProvince?.Name || "", // Lấy tên tỉnh
        district: selectedDistrict?.Name || "", // Lấy tên huyện
        img: imgFile ? imgFile.name : "", // Lưu tên file ảnh
      };

      console.log(createUserRequest); // Gửi đối tượng này đến API
      // Gọi API ở đây với createUserRequest
    };

    const handleProvinceChange = (event, newValue) => {
      setSelectedProvince(newValue);
      // Không reset formData
      setSelectedDistrict(null); // Reset huyện khi chọn tỉnh mới
    };

    return (
      <StyledModal
        open={showDoctorModal}
        onClose={() => {
          setShowDoctorModal(false);
          setSelectedProvince(null); // Reset tỉnh
          setSelectedDistrict(null); // Reset huyện
          setImgFile(null); // Reset file ảnh
          setFormData({
            name: "",
            email: "",
            username: "",
            password: "",
            phone: "",
            address: "",
            gender: "Nam",
          });
        }}
      >
        <ModalContent>
          <Typography variant="h5" gutterBottom>
            Thêm bác sĩ
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Tên bác sĩ"
                margin="normal"
                sx={{ flex: 1 }}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                sx={{ flex: 1 }}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                margin="normal"
                sx={{ flex: 1 }}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                margin="normal"
                sx={{ flex: 1 }}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                margin="normal"
                sx={{ flex: 1 }}
                name="phone"
                value={formData.phone}
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
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel
                      value="Nam"
                      control={<Radio />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value="Nữ"
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
              value={formData.address}
              onChange={handleInputChange}
            />

            <Grid container spacing={2} alignItems="center" mt={0.5}>
              <Grid item xs={6}>
                <Autocomplete
                  size="small"
                  value={selectedProvince}
                  onChange={handleProvinceChange} // Sử dụng hàm mới
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
                  onChange={(event, newValue) => setSelectedDistrict(newValue)}
                  options={
                    (selectedProvince && selectedProvince.Districts) || []
                  }
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

            {/* Phần tải ảnh */}
            <Box sx={{ mt: 2 }}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </Box>

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
                onClick={() => {
                  setShowDoctorModal(false);
                  setSelectedProvince(null);
                  setSelectedDistrict(null);
                  setImgFile(null);
                }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit} // Gọi hàm tạo đối tượng
              >
                Xác nhận
              </Button>
            </Box>
          </Box>
        </ModalContent>
      </StyledModal>
    );
  };

  const PatientModal = () => {
    const [patientInfo, setPatientInfo] = useState({
      username: "",
      email: "",
      password: "",
      name: "",
      phone: "",
      address: "",
      gender: "",
    });

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setPatientInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    };

    const handleSubmit = async () => {
      try {
        const response = await patientApi.create(patientInfo); // Gọi API để thêm bệnh nhân
        // Reset form sau khi thêm thành công
        console.log(response);

        setPatientInfo({
          username: "",
          email: "",
          password: "",
          name: "",
          phone: "",
          address: "",
          gender: "",
        });
        setShowPatientModal(false); // Đóng modal
        toast.success("Thêm khách hàng thành công");
      } catch (error) {
        console.error("Error adding patient:", error);
        toast.error("Thêm khách hàng thất bại. Vui lòng thử lại.");
      }
    };

    return (
      <StyledModal
        open={showPatientModal}
        onClose={() => setShowPatientModal(false)}
      >
        <ModalContent>
          <Typography variant="h5" gutterBottom>
            Thêm khách hàng
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Tên"
                margin="normal"
                name="name"
                value={patientInfo.name}
                onChange={handleInputChange}
                sx={{ flex: 1 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                name="email"
                value={patientInfo.email}
                onChange={handleInputChange}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                margin="normal"
                name="username"
                value={patientInfo.username}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                margin="normal"
                name="password"
                value={patientInfo.password}
                onChange={handleInputChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                margin="normal"
                name="phone"
                value={patientInfo.phone}
                onChange={handleInputChange}
              />
              <FormControl
                variant="outlined"
                fullWidth
                margin="normal"
                required
              >
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={patientInfo.gender}
                  onChange={handleInputChange}
                  label="Giới tính"
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth
              label="Địa chỉ"
              margin="normal"
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
                onClick={() => setShowPatientModal(false)}
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
  const AdminDashboard = () => {
    const [open, setOpen] = useState(true);
    const [doctorsData, setDoctorData] = useState([]);

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
          <Paper sx={{ p: 3, pb: 6 }}>
            <Typography variant="h5" gutterBottom mb={4}>
              Bác sĩ nổi bật
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
                        transform: "scale(1.05)",
                      },
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
                        width: 150,
                        height: 150,
                        margin: "0 auto 16px",
                        border: 2,
                        borderColor: "#cccccc",
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
                      <Typography color="white">Hạng {index + 1}</Typography>
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
              selected={activeTab === "logout"}
              onClick={handleLogout}
            >
              <ListItemIcon style={{ fontSize: 24 }}>
                <ExitToAppIcon
                  color={activeTab === "logout" ? "#1976d2" : "#666"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Đăng xuất"
                sx={{
                  color: activeTab === "logout" ? "#1976d2" : "inherit",
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
                <Paper
                  sx={{
                    p: 3,
                    maxWidth: 300,
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FaUserMd size={24} color="#1976d2" />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">
                        Tổng bác số sĩ
                      </Typography>
                      <Typography variant="h4">{totalDoctor}</Typography>
                    </Box>
                  </Box>
                </Paper>
                <Paper
                  sx={{
                    p: 3,
                    maxWidth: 300,
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FaUsers size={24} color="#2e7d32" />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">
                        Tổng số khách hàng
                      </Typography>
                      <Typography variant="h4">{totalPatient}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
              <AdminDashboard />
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
                      <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Số điện thoại
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Địa chỉ</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Giới tính
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Trạng thái
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctorData?.map((doctor) => (
                      <TableRow
                        key={doctor?.id}
                        onClick={() => setSelectedRow(doctor)}
                        selected={selectedRow?.id === doctor?.id}
                        hover
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{doctor?.name}</TableCell>
                        <TableCell>{doctor?.email}</TableCell>
                        <TableCell>{doctor?.phone}</TableCell>
                        <TableCell sx={{ width: 300 }}>
                          {doctor?.address} - {doctor?.district} -{" "}
                          {doctor?.city}
                        </TableCell>
                        <TableCell>{doctor?.gender}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IOSSwitch
                              checked={doctor?.enable === true}
                              onChange={() => handleStatusChange(doctor?.id)}
                            />
                            <Typography
                              sx={{
                                color: doctor?.enable ? "#2ECA45" : "#666",
                                fontSize: "0.875rem",
                              }}
                            >
                              {doctor?.enable ? "Active" : "Inactive"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowEditDoctorModal(true);
                              const provinceObj = options.find(
                                (p) => p.Name === doctor.city
                              );
                              setSelectedProvince(provinceObj);
                              if (provinceObj) {
                                const districtObj = provinceObj.Districts.find(
                                  (d) => d.Name === doctor.district
                                );
                                setSelectedDistrict(districtObj);
                              }
                            }}
                          >
                            <MdEdit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display="flex" justifyContent="center" marginTop={3}>
                <Pagination
                  count={pageMax}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
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
                    onClick={() => {
                      if (selectedRowPatient) {
                        navigate("/admin/patient-detail", {
                          state: { patient: selectedRowPatient },
                        });
                      }
                    }}
                    disabled={!selectedRowPatient}
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
                      <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Số điện thoại
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tên tài khoản
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Trạng thái
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patientData.map((patient) => (
                      <TableRow
                        key={patient.id}
                        onClick={() => setSelectedRowPatient(patient)}
                        selected={selectedRowPatient?.id === patient.id}
                        hover
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{patient?.name}</TableCell>
                        <TableCell>{patient?.email}</TableCell>
                        <TableCell>{patient?.phone}</TableCell>
                        <TableCell>{patient?.username}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IOSSwitch
                              checked={patient?.enable === true}
                              onChange={() =>
                                handleStatusPatientChange(patient?.id)
                              }
                            />
                            <Typography
                              sx={{
                                color: patient?.enable ? "#2ECA45" : "#666",
                                fontSize: "0.875rem",
                              }}
                            >
                              {patient.enable ? "Active" : "Inactive"}
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display="flex" justifyContent="center" marginTop={3}>
                <Pagination
                  count={pageMaxPatient}
                  page={currentPagePatient}
                  onChange={handlePageChangePatient}
                  color="primary"
                />
              </Box>
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
