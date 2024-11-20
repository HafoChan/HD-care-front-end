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
import {getImg, setImg} from "../../service/otherService/localStorage"

function UserDetail() {
  const [selectedTab, setSelectedTab] = useState("Trang chủ");
  const [isEditing, setIsEditing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    gender: "nam",
    address: "",
    img:getImg(),
    dob:""
  });

  const handleCloseSnackBar = (event, reason) => {

    setSnackBarOpen(false);
  };

  const showError = (message) => {
    setSnackType("error");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const showSuccess = (message) => {
    setSnackType("success");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

const handleSubmit = () => {
    patientApi.updatePatient(userInfo)
    .then((response) => {
      if (response.code == 1000)
      {
        console.log("in success")
        showSuccess(response.message)
        setRefresh(prev => !prev)
      }
      else
        throw Error(response.message)
    })
    .catch((e) => {
      showError(e.message)
    })
}

 const getInfo = async () =>{
      const response = await patientApi.getInfo()
      setUserInfo(response.result)
     
    }

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  useEffect(()=>{   
    console.log("innn")
    getInfo()
    setImg(userInfo.img)
  },[refresh])
  
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
    console.log(fileInfo)
    setUserInfo((prevUserInfo)=>({
      ...prevUserInfo,
      img : fileInfo
    }))    // You can update the state or perform any action with the uploaded file info here
  };

  return (
    <Box align={"center"}>
      <HeaderComponent
        selectedTab={selectedTab}
        handleTabClick={handleTabClick}
        userInfo={userInfo}
      />

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
         <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
        <Card
          sx={{
            display: "flex",
            width: "100%",
            padding: 2,
            boxShadow: "none",
            mt: 4,
          }}
        >
          <UploadFiles askUrl = {handleFileUpload} allowAvatarUpload = {true} />
          <Box align="left">
            <Typography variant="h6" fontWeight={"bold"} mb={0.5}>
              {userInfo?.username}
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
              value={userInfo?.dob ? userInfo.dob : ''}
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
       value={userInfo.gender || "nam"} // Sử dụng giá trị mặc định nếu là undefined
       onChange={handleInputChange} 
       disabled={!isEditing}
   >
       <FormControlLabel value="nam" control={<Radio />} label="Nam" />
       <FormControlLabel value="nu" control={<Radio />} label="Nữ" />
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
          <Button variant="contained" color="warning" startIcon={<EditIcon />} onClick={handleEditClick}>
            Chỉnh sửa thông tin
          </Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSubmit}>
            Lưu
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UserDetail;
