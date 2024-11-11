import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import HeaderComponent from "../../components/patient/HeaderComponent";
import images from "../../constants/images";

function Profile() {
  const [selectedTab, setSelectedTab] = useState("Trang chủ");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      <HeaderComponent
        selectedTab={selectedTab}
        handleTabClick={handleTabClick}
      />
      <Box
        sx={{
          backgroundColor: "#cfe8fc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingY: 4,
        }}
      >
        <Container>
          <Typography
            variant="h4"
            fontWeight={"bold"}
            component="h1"
            gutterBottom
          >
            Trang Của Bạn
          </Typography>

          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              paddingY: 2,
              paddingX: 10,
              maxWidth: "100%",
            }}
          >
            <Avatar
              alt="User Avatar"
              src={images.logo} // Đổi URL này thành ảnh của bạn
              sx={{ width: 180, height: 180, marginRight: 10 }}
            />
            <CardContent>
              <Typography variant="h5" fontWeight={"bold"}>
                Nguyễn Trần Minh Quân
              </Typography>
              <Typography variant="h6" sx={{ marginY: 2 }}>
                <EmailIcon
                  fontSize="medium"
                  sx={{ verticalAlign: "middle", marginRight: 0.5 }}
                />
                minhquan@gmail.com
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 1,
                }}
              >
                <Box textAlign="center" marginRight={8} display={"flex"}>
                  <Typography variant="h6" fontWeight={"bold"} mr={1}>
                    20
                  </Typography>
                  <Typography variant="h6">Đã khám</Typography>
                </Box>
                <Box textAlign="center" marginRight={8} display={"flex"}>
                  <Typography variant="h6" fontWeight={"bold"} mr={1}>
                    11
                  </Typography>
                  <Typography variant="h6">Bài viết</Typography>
                </Box>
                <Box textAlign="center" display={"flex"}>
                  <Typography variant="h6" fontWeight={"bold"} mr={1}>
                    15
                  </Typography>
                  <Typography variant="h6">Đã đánh giá</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginTop: 2,
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="contained" color="primary" sx={{ paddingX: 4 }}>
              Lịch sử khám
            </Button>
            <Button variant="contained" color="primary" sx={{ paddingX: 4 }}>
              Xem chi tiết
            </Button>
            <Button variant="contained" color="primary" sx={{ paddingX: 4 }}>
              Chỉnh sửa thông tin
            </Button>
          </Box>

          <Divider orientation="horizontal" flexItem sx={{ mt: 4 }} />

          <Typography
            variant="h5"
            color="textSecondary"
            sx={{ marginTop: 2, textAlign: "center" }}
          >
            Sau này làm thêm phần bài viết ở đây
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Profile;
