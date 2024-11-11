import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Avatar,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import HeaderComponent from "../../components/patient/HeaderComponent";

function UserDetail() {
  const [selectedTab, setSelectedTab] = useState("Trang chủ");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Box align={"center"}>
      <HeaderComponent
        selectedTab={selectedTab}
        handleTabClick={handleTabClick}
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
        <Card
          sx={{
            display: "flex",
            width: "100%",
            padding: 2,
            boxShadow: "none",
            mt: 4,
          }}
        >
          <Avatar
            alt="User Avatar"
            src="https://via.placeholder.com/100" // Đổi URL này thành ảnh của bạn
            sx={{ width: 80, height: 80, marginRight: 4 }}
          />
          <Box align="left">
            <Typography variant="h6" fontWeight={"bold"} mb={0.5}>
              TuanDat01
            </Typography>
            <Typography color="textSecondary">tuandat12@gmail.com</Typography>
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
              defaultValue="Nguyễn Văn A"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ marginBottom: 6 }}
            />
            <TextField
              label="Birthday"
              defaultValue="12/02/1990"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ marginBottom: 2 }}
            />
            <Box display={"flex"} alignItems={"center"}>
              <Typography variant="subtitle1" mr={6}>
                Giới tính
              </Typography>
              <RadioGroup row defaultValue="Nam">
                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
              </RadioGroup>
            </Box>
          </Box>
          <Box sx={{ flex: 3 }}>
            <TextField
              label="Địa chỉ"
              defaultValue="Tòa nhà GP, 257 Giải Phóng, Phương Mai, Đống Đa, Hà Nội"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ marginBottom: 6 }}
            />
            <TextField
              label="Số điện thoại"
              defaultValue="0123456789"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ marginBottom: 2 }}
            />
          </Box>
        </Box>

        <Box
          width={"100%"}
          sx={{ display: "flex", gap: 2, justifyContent: "end" }}
        >
          <Button variant="contained" color="warning" startIcon={<EditIcon />}>
            Chỉnh sửa thông tin
          </Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
            Lưu
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UserDetail;
