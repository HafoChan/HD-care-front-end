import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import HeaderComponent from "../../components/patient/HeaderComponent";

function AppointmentHistory() {
  return (
    <Box align={"center"}>
      <HeaderComponent />

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
        <Box
          sx={{
            marginY: 4,
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h5" fontWeight={"bold"}>
            Lịch sử khám
          </Typography>
          <HistoryIcon sx={{ marginX: 2 }} />
          <Typography fontSize={"17px"}>Mụn viêm và mụn đầu đen</Typography>
        </Box>

        <Card sx={{ width: "100%", padding: 2, pb: 0 }}>
          <CardContent>
            <Box sx={{ display: "flex", gap: 4, marginBottom: 4 }}>
              <TextField
                label="Bác sĩ"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Bệnh nhân"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 4, marginBottom: 4 }}>
              <TextField
                label="Ngày khám"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Thời gian khám"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 4, marginBottom: 4 }}>
              <TextField
                sx={{ width: "40%" }}
                label="Ngày sinh"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", width: "60%" }}>
                <Typography variant="subtitle1" sx={{ marginRight: 4 }}>
                  Giới tính
                </Typography>
                <RadioGroup row defaultValue="Nam">
                  <FormControlLabel
                    value="Nam"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                </RadioGroup>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 4, marginBottom: 4 }}>
              <TextField
                sx={{ width: "40%" }}
                label="Trạng thái"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                sx={{ width: "60%" }}
                label="Mô tả"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            <TextField
              label="Lưu ý"
              multiline
              rows={3}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ marginBottom: 4 }}
            />

            <Button
              variant="contained"
              color="warning"
              startIcon={<VisibilityIcon />}
              sx={{ width: "fit-content", alignSelf: "center" }}
            >
              Xem đơn thuốc
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AppointmentHistory;
