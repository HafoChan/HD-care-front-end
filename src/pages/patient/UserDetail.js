import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Snackbar,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  Alert,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import HeaderComponent from "../../components/patient/HeaderComponent";
import patientApi from "../../api/patient";
import UploadFiles from "../../components/patient/uploadFile";
import { getImg, setImg } from "../../service/otherService/localStorage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
    img: getImg(),
    dob: "",
  });

  const handleCloseSnackBar = (event, reason) => {
    setSnackBarOpen(false);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showSuccess = (message) => {
    toast.success(message);
  };

  const handleSubmit = () => {
    patientApi
      .updatePatient(userInfo)
      .then((response) => {
        if (response.code == 1000) {
          console.log("in success");
          showSuccess(response.message);
          setRefresh((prev) => !prev);
        } else throw Error(response.message);
      })
      .catch((e) => {
        showError(e.message);
      });
  };

  const getInfo = async () => {
    try {
      const response = await patientApi.getInfo();
      if (response && response.result) {
        console.log("User info:", response.result);
        setUserInfo(response.result);
      } else {
        // Xử lý trường hợp response không có dữ liệu
        showError("Không thể tải thông tin người dùng");
      }
    } catch (error) {
      console.log("loi: " + error);
      // Xử lý các lỗi khác nhau
      if (error.response && error.response.status === 401) {
        // Lỗi unauthorized - có thể do refreshToken không hợp lệ
        showError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        // Có thể thêm logic chuyển hướng đến trang đăng nhập
      } else {
        // Các lỗi khác
        showError(error.message || "Đã có lỗi xảy ra khi tải thông tin");
      }
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    console.log("innn");
    getInfo();
    setImg(userInfo.img);
  }, [refresh]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFileUpload = (fileInfo) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      img: fileInfo,
    })); // You can update the state or perform any action with the uploaded file info here
  };

  return (
    <Box align={"center"}>
      <HeaderComponent userInfo={userInfo} />

      <Divider
        orientation="horizontal"
        flexItem
        style={{ maxWidth: "1200px" }}
      />

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={6000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Card
          sx={{
            display: "flex",
            width: "100%",
            padding: 2,
            boxShadow: "none",
            mt: 4,
          }}
        >
          <UploadFiles askUrl={handleFileUpload} allowAvatarUpload={true} />
          <Box align="left" mt={2}>
            <Typography variant="h6" fontWeight={"bold"} mb={0.5}>
              {userInfo?.name}
            </Typography>
            <Typography color="textSecondary">{userInfo?.email}</Typography>
          </Box>
        </Card>

        <Box
          align={"left"}
          sx={{
            width: "100%",
            marginY: 2,
          }}
        >
          <Typography variant="h5" fontWeight={"bold"}>
            Thông tin chi tiết
          </Typography>
        </Box>

        <Box
          align={"left"}
          sx={{ display: "flex", gap: 6, width: "100%", marginTop: 2 }}
        >
          <Box sx={{ flex: 2 }}>
            <TextField
              label="Họ tên"
              name="name"
              value={userInfo?.name}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 6 }}
              InputProps={{ readOnly: !isEditing }}
            />
            <TextField
              label="Birthday"
              type="date"
              name="dob"
              value={userInfo?.dob || ""}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
              InputProps={{ readOnly: !isEditing }}
            />
            <Box display={"flex"} alignItems={"center"}>
              <Typography variant="subtitle1" mr={6}>
                Giới tính
              </Typography>
              <RadioGroup
                row
                name="gender"
                value={userInfo?.gender || "Nam"}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="Nam"
                  control={<Radio disabled={!isEditing} />}
                  label="Nam"
                />
                <FormControlLabel
                  value="Nữ"
                  control={<Radio disabled={!isEditing} />}
                  label="Nữ"
                />
              </RadioGroup>
            </Box>
          </Box>
          <Box sx={{ flex: 3 }}>
            <TextField
              label="Địa chỉ"
              name="address"
              value={userInfo?.address}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 6 }}
              InputProps={{ readOnly: !isEditing }}
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={userInfo?.phone}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
              InputProps={{ readOnly: !isEditing }}
            />
          </Box>
        </Box>

        <Box
          width={"100%"}
          sx={{ display: "flex", gap: 2, justifyContent: "end" }}
        >
          {!isEditing ? (
            <Button
              variant="contained"
              color="warning"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa thông tin
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={() => {
                  handleSubmit(); // Lưu thông tin
                  setIsEditing(false); // Thoát chế độ chỉnh sửa
                }}
              >
                Lưu
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setIsEditing(false); // Quay về trạng thái ban đầu
                  setRefresh((prev) => !prev); // Làm mới dữ liệu nếu cần
                }}
              >
                Hủy
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default UserDetail;
