import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import images from "../../constants/images";

function DoctorProfileComponent() {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1d8be4",
        marginX: "24px",
        boxShadow: "none",
        paddingY: "24px",
      }}
    >
      <CardContent sx={{ padding: "0px", color: "white" }}>
        <Typography variant="h5" fontWeight={"bold"}>
          BS CKII Lê Ngọc Hoa
        </Typography>
        <Typography variant="h6">Chuyên khoa da mặt</Typography>
        <Typography variant="body2" fontSize={"16px"} sx={{ my: 2 }}>
          Bác sĩ CKII Lê Thượng Thụy Vi, với hơn 9 năm kinh nghiệm, trong đó 6
          năm công tác tại bệnh viện Quân y 175 và một số bệnh viện lớn tại TP
          HCM, Bác sĩ trở thành người bạn đồng hành tin cậy của hàng ngàn bệnh
          nhân đến trị mụn tại O2 SKIN.
        </Typography>
        <Button variant="contained" color="warning" sx={{ width: "200px" }}>
          Đặt Lịch Ngay
        </Button>
      </CardContent>

      <img
        alt="Doctor Image"
        src={images.logo}
        style={{
          width: "250px",
          height: "250px",
          borderRadius: "10%",
        }}
        objectFit="cover"
      />
    </Card>
  );
}

export default DoctorProfileComponent;
