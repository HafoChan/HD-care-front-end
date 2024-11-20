import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import images from "../../constants/images";

function DoctorProfileComponent({ doctorInfo }) {
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
          {doctorInfo?.name}
        </Typography>
        <Typography variant="h6">{doctorInfo?.specialization}</Typography>
        <Typography variant="body2" fontSize={"16px"} sx={{ my: 2 }}>
          {doctorInfo?.experience}
        </Typography>
        <Button variant="contained" color="warning" sx={{ width: "200px" }}>
          Đặt Lịch Ngay
        </Button>
      </CardContent>

      <img
        alt="Doctor Image"
        src={doctorInfo.img}
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
