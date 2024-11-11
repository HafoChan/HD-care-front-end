import React, { useState } from "react";
import HeaderComponent from "../../components/patient/HeaderComponent";
import DoctorProfileComponent from "../../components/patient/DoctorProfileComponent";
import AppointmentSchedulerComponent from "../../components/patient/AppointmentSchedulerComponent";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Rating,
} from "@mui/material";

const reviews = [
  {
    name: "Nguyễn Trần Tuấn Đạt",
    rating: 4.5,
    comment:
      "Bác sĩ tư vấn và chăm sóc nhiệt tình, trị triệt để mụn của mình sau 6 tháng",
  },
  {
    name: "Nguyễn Trần Tuấn Đạt",
    rating: 4.2,
    comment:
      "Bác sĩ tư vấn và chăm sóc nhiệt tình, trị triệt để mụn của mình sau 6 tháng",
  },
  {
    name: "Nguyễn Trần Tuấn Đạt",
    rating: 4,
    comment:
      "Bác sĩ Đoàn tư vấn rất tốt và cẩn thận. Bác chỉ ra được nguyên nhân gây mụn và hướng dẫn các bước chăm sóc da kỹ càng...",
  },
];

const doctors = [
  { name: "BS CKII Lê Thị Thanh Thảo" },
  { name: "BS CKII Lê Thị Thanh Thảo" },
  { name: "BS CKII Lê Thị Thanh Thảo" },
  { name: "BS CKII Lê Thị Thanh Thảo" },
];

function ReviewSection() {
  return (
    <Box paddingX={"24px"} sx={{ bgcolor: "#1d8be4", color: "white", py: 4 }}>
      <Typography
        variant="h5"
        fontWeight={"bold"}
        mb={4}
        mt={2}
        align="center"
        gutterBottom
      >
        Đánh giá của bệnh nhân
      </Typography>

      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={8}>
          {reviews.map((review, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ mr: 2 }}>N</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {review.name}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body2">{review.comment}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3">4.5</Typography>
          <Rating value={4.5} precision={0.1} readOnly />
          <Typography variant="body2">20 bài review</Typography>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "#1d8be4",
            width: "150px",
          }}
        >
          Xem tất cả
        </Button>
      </Box>
    </Box>
  );
}

function OtherDoctorsSection() {
  return (
    <Box sx={{ py: 4, px: "32px" }}>
      <Typography
        variant="h5"
        fontWeight={"bold"}
        mb={4}
        align="center"
        gutterBottom
      >
        Các Bác Sĩ Khác
      </Typography>

      <Grid container spacing={0} justifyContent="center">
        {doctors.map((doctor, index) => (
          <Grid
            item
            xs={6}
            sm={3}
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              sx={{
                textAlign: "center",
                py: 2,
                width: "180px",
                boxShadow: "none",
              }}
            >
              <Box
                sx={{
                  width: "160px",
                  height: "160px",
                  backgroundColor: "#cccccc",
                  margin: "0 auto",
                  borderRadius: "20px",
                }}
              ></Box>
              <Typography
                variant="subtitle1"
                fontWeight={"bold"}
                marginX={2}
                sx={{ mt: 1 }}
              >
                {doctor.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#077CDB",
            color: "white",
            mt: 2,
            width: "150px",
          }}
        >
          Xem tất cả
        </Button>
      </Box>
    </Box>
  );
}

function App() {
  const [selectedTab, setSelectedTab] = useState("Trang chủ");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Box width={"100%"} align="center">
      <Box maxWidth={"1200px"}>
        <HeaderComponent
          selectedTab={selectedTab}
          handleTabClick={handleTabClick}
        />
      </Box>

      <Box width={"100%"} backgroundColor="#1d8be4">
        <Box maxWidth={"1200px"} align="left">
          <DoctorProfileComponent />
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="white">
        <Box maxWidth={"1200px"} align="left">
          <AppointmentSchedulerComponent />
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="#1d8be4">
        <Box maxWidth={"1200px"} align="left">
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#1d8be4",
              margin: "24px",
              boxShadow: "none",
              paddingY: "24px",
            }}
          >
            <CardContent sx={{ padding: "0px", color: "white" }}>
              <Typography variant="h5" fontWeight={"bold"} mb={4} mt={2}>
                Trình Độ Chuyên Môn
              </Typography>
              <Box display={"flex"} gap={6} marginX={6}>
                <Box
                  sx={{
                    border: "2px solid white",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    justifyContent: "center",
                  }}
                >
                  <Typography fontSize={"18px"} textAlign={"center"}>
                    Tốt nghiệp Bác sĩ nội trú Chuyên khoa da liễu - Đại học Y
                    Dược TP.HCM
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "2px solid white",
                    borderRadius: "10px",
                    padding: "10px 20px",
                  }}
                >
                  <Typography fontSize={"18px"} textAlign={"center"}>
                    Tốt nghiệp Bác sĩ nội trú Chuyên khoa da liễu - Đại học Y
                    Dược TP.HCM
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "2px solid white",
                    borderRadius: "10px",
                    padding: "10px 20px",
                  }}
                >
                  <Typography fontSize={"18px"} textAlign={"center"}>
                    Tốt nghiệp Bác sĩ nội trú Chuyên khoa da liễu - Đại học Y
                    Dược TP.HCM
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="white" pb={4}>
        <Box maxWidth={"1200px"} align="left" paddingX={24}>
          <Typography variant="h5" fontWeight={"bold"} mb={2} mt={4}>
            Mô tả
          </Typography>
          <Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Trưởng khoa Khám bệnh, Bệnh viện Đa khoa Quốc tế Thu Cúc
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Nguyên chủ nhiệm khoa thần kinh, Bệnh viện Hữu Nghị Việt Xô
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Bác sĩ có 40 năm kinh nghiệm làm việc chuyên khoa Nội Thần kinh
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Bác sĩ khám cho người bệnh từ 16 tuổi trở lên
            </Typography>
          </Typography>

          <Typography variant="h5" fontWeight={"bold"} mb={2} mt={4}>
            Khám và điều trị
          </Typography>
          <Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Các bệnh đau đầu: Chứng đau nửa đầu, đau đầu căn nguyên mạch
              máu, đau đầu mạn tính hàng ngày..
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Bệnh đau vai gáy do thoái hóa cột sống cổ, thoát vị đĩa đệm cột
              sống cổ, …
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Đau thắt lưng hông do thoái hóa, thoát vị, đau do viêm khớp cùng
              chậu…
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Rối loạn tiền đình
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Điều trị chóng mặt do thiếu máu não
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Tư vấn và điều trị các bệnh lý rối loạn về giấc ngủ: mất ngủ cấp
              tính hoặc mạn tính
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Liệt dây 7 ngoại vi: Viêm các dây thần kinh sọ não và các dây
              thần kinh ngoại vi khác như hội chứng ống cổ tay, đau vai khuỷu
              tay do chơi thể thao
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Liệt nửa người do nhồi máu não
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Các bệnh lý về sa sút trí tuệ: Suy giảm nhận thức nhẹ, suy giảm
              trí nhớ, sa sút trí tuệ nguyên nhân mạch máu (sa sút trí tuệ sau
              đột quỵ), Alzheimer
            </Typography>
            <Typography
              component="span"
              sx={{ display: "block", marginBottom: "8px" }}
            >
              • Bệnh rối loạn vận động như bệnh Parkinson
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="#1d8be4">
        <Box maxWidth={"1200px"} align="left">
          <ReviewSection />
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="white">
        <Box maxWidth={"1200px"} align="left">
          <OtherDoctorsSection />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
