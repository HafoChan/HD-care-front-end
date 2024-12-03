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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [noPassword, setNoPassword] = useState(false);

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
    toast.success("Cập nhật thông tin người dùng thành công");
  };

  const handleSubmit = () => {
    patientApi
      .updatePatient(userInfo)
      .then((response) => {
        if (response.code == 1000) {
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
        setNoPassword(response.result.noPassword);
      } else {
        showError("Không thể tải thông tin người dùng");
      }
    } catch (error) {
      if (error.response && error.response.status !== 401) {
        showError("Đã có lỗi xảy ra khi tải thông tin");
      }
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      showError("Mật khẩu không khớp!");
      return;
    }
    try {
      console.log(newPassword)
      const response = await patientApi.updatePassword(newPassword);
      if (response.code === 1000) {
        showSuccess("Cập nhật mật khẩu thành công!");
        setOpenPasswordDialog(false);
        setNoPassword(false);
      } else {
        throw Error(response.message);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
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
      img: fileInfo[0],
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
            <>
              <Button
                variant="contained"
                color="warning"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa thông tin
              </Button>
              {noPassword && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenPasswordDialog(true)}
                >
                  Tạo mật khẩu
                </Button>
              )}
            </>
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

      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Tạo mật khẩu mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mật khẩu mới"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)} color="error">
            Hủy
          </Button>
          <Button onClick={handlePasswordUpdate} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserDetail;
