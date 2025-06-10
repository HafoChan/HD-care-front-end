import React, { Component } from "react";
import {
  Avatar,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
  DialogActions,
} from "@mui/material";
import { Rating } from "@mui/lab"; // Đảm bảo bạn đã cài đặt @mui/lab
import appointApi from "../../api/appointApi";
import { getImg } from "../../service/otherService/localStorage";
import UploadFiles from "./uploadFile"; // Import the UploadFiles component
import reviewApi from "../../api/reviewApi";

export default class EvaluateForm extends Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search); // Lấy tham số từ URL
    this.state = {
      idAppointment: urlParams.get("idAppointment") || "", // Lấy tên bác sĩ từ URL
      content: "",
      rating: 0,
      doctorName: "", // Thêm trạng thái cho tên bác sĩ
      doctorImage: "", // Thêm trạng thái cho ảnh bác sĩ
      appointmentStartDate: "", // Thêm trạng thái cho ngày bắt đầu khám
      appointmentEndDate: "", // Thêm trạng thái cho ngày kết thúc khám
      uploadedImage: [], // Added state for uploaded image
      snackBarOpen: false, // Moved snackbar state to component state
      snackBarMessage: "",
      snackType: "error",
      onClose: this.props.onClose,
    };
  }

  handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackBarOpen: false }); // Updated to use this.setState
  };

  showError = (message) => {
    this.setState({
      snackType: "error",
      snackBarMessage: message,
      snackBarOpen: true,
    }); // Updated to use this.setState
  };

  showSuccess = (message) => {
    this.setState({
      snackType: "success",
      snackBarMessage: message,
      snackBarOpen: true,
    }); // Updated to use this.setState
    setTimeout(() => {
      this.state.onClose(); // Call onClose after 2 seconds
    }, 2000); // Changed to 2000 milliseconds (2 seconds)
  };

  componentDidMount() {
    const { idAppointment } = this.state;
    appointApi
      .getAppointmentByAppointmentId(idAppointment) // Gọi API để lấy thông tin bác sĩ
      .then((response) => {
        this.setState({
          doctorName: response.result?.nameDoctor, // Giả sử response có thuộc tính name
          doctorImage: response.result?.img, // Giả sử response có thuộc tính image
          appointmentStartDate: response.result?.start, // Giả sử response có thuộc tính startDate
          appointmentEndDate: response.result?.end, // Giả sử response có thuộc tính endDate
          doctorId: response.result?.idDoctor,
        });
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
      });
  }

  handleContentChange = (event) => {
    this.setState({ content: event.target.value });
  };

  handleRatingChange = (event, newValue) => {
    this.setState({ rating: newValue });
  };

  handleImageUpload = (file) => {
    this.setState((prevState) => ({
      uploadedImage: [...prevState.uploadedImage, ...file],
    }));
  };

  handleSubmit = () => {
    const body = {
      content: this.state.content,
      rating: this.state.rating,
      img: [...this.state.uploadedImage],
      idAppointment: this.state.idAppointment,
    };
    console.log(body.img);
    reviewApi
      .postReview(body)
      .then((response) => {
        if (response.message) {
          this.showSuccess(response.message);
        } else throw new Error("Đánh giá thất bại");
      })
      .catch((e) => this.showError(e.message || "Đánh giá thất bại"));
  };

  render() {
    const {
      doctorName,
      doctorImage,
      content,
      rating,
      appointmentStartDate,
      appointmentEndDate,
      uploadedImage,
      snackBarOpen,
      snackBarMessage,
      snackType,
    } = this.state;
    const { open, onClose } = this.props; // Nhận props để điều khiển dialog
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Avatar
              src={doctorImage ? doctorImage : ""}
              sx={{
                width: 180,
                height: 180,
                margin: "0 auto",
                objectFit: "cover",
              }}
            />
            <Snackbar
              open={snackBarOpen}
              onClose={this.handleCloseSnackBar}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={this.handleCloseSnackBar}
                severity={snackType}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackBarMessage}
              </Alert>
            </Snackbar>
            <Typography
              variant="h6"
              style={{ marginBottom: "16px", fontWeight: "bold" }}
            >
              {doctorName || "nguyen van a"}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <Typography variant="body1">{`Thời gian bắt đầu: ${
                appointmentStartDate || "Chưa xác định"
              }`}</Typography>
              <br />
              <Typography variant="body1">{`Thời gian kết thúc: ${
                appointmentEndDate || "Chưa xác định"
              }`}</Typography>
            </div>
            <TextField
              label="Nội dung đánh giá"
              multiline
              rows={4}
              value={content}
              onChange={this.handleContentChange}
              fullWidth
              variant="outlined"
              margin="normal"
              style={{ marginBottom: "16px" }}
            />
            <Rating
              name="doctor-rating"
              value={rating}
              onChange={this.handleRatingChange}
              precision={0.5}
              style={{ marginBottom: "16px" }}
            />
            <UploadFiles
              askUrl={this.handleImageUpload}
              allowAvatarUpload={false}
            />{" "}
            {/* Add the UploadFiles component */}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
              style={{ width: "100%" }}
            >
              Gửi Đánh Giá
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
