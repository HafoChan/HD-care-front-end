import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
} from "@mui/material";
import { useUserContext } from "../../context/UserContext";
import { appointment } from "../../api/appointment";
import { toast } from "react-toastify";

const BookingForm = ({ open, onClose, selectedDate, doctor, schedule }) => {
  const { id, name, email, address, phone, gender, dob } = useUserContext();
  const [nameForm, setNameForm] = useState();
  const [emailForm, setEmailForm] = useState();
  const [addressForm, setAddressForm] = useState();
  const [phoneForm, setPhoneForm] = useState();
  const [genderForm, setGenderForm] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const data = {
    idPatient: id,
    name: nameForm,
    gender: genderForm,
    dob: dob,
    address: addressForm,
    description: description,
    title: title,
    scheduleId: schedule?.id,
    email: emailForm,
  };

  useEffect(() => {
    setNameForm(name);
    setEmailForm(email);
    setAddressForm(address);
    setPhoneForm(phone);
    setGenderForm(gender);
  }, [name, email, address, phone, gender, schedule]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nameForm || !emailForm || !addressForm || !title || !description) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const response = await appointment.createAppointment(data);

      if (response.code === 1000) {
        toast.success("Đặt lịch thành công!");
        setTitle(null);
        setDescription(null);
        onClose();
      } else {
        console.log(response);
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Đặt lịch không thành công!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogContent
        sx={{
          width: "800px",
          maxWidth: "1000px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          fontWeight={"bold"}
        >
          ĐĂNG KÝ LỊCH KHÁM
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 4,
          }}
        >
          {doctor?.avatar != null ? (
            <Avatar
              alt="Avatar"
              src={doctor?.avatar}
              sx={{ width: 56, height: 56 }}
            />
          ) : null}

          <Box>
            <Typography variant="h6" fontWeight={"bold"}>
              {doctor?.name}
            </Typography>
            <Typography>
              {doctor?.district} {doctor?.city}
            </Typography>
          </Box>
        </Box>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Họ và tên"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={nameForm}
            onChange={(e) => setNameForm(e.target.value)}
          />
          <FormControl>
            <FormLabel>Giới tính</FormLabel>
            <RadioGroup
              row
              value={genderForm}
              onChange={(e) => setGenderForm(e.target.value)}
            >
              <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
              <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Ngày"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              value: selectedDate,
              readOnly: true,
            }}
            required
          />
          <TextField
            label="Giờ bắt đầu"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              value: schedule?.start,
              readOnly: true,
            }}
            required
          />
          <TextField
            label="Giờ kết thúc"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              value: schedule?.end,
              readOnly: true,
            }}
            required
          />
          <TextField
            label="Email xác nhận"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            disabled={true}
            value={emailForm}
            onChange={(e) => setEmailForm(e.target.value)}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={phoneForm}
            onChange={(e) => setPhoneForm(e.target.value)}
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={addressForm}
            onChange={(e) => setAddressForm(e.target.value)}
          />
          <TextField
            label="Lý do khám"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Mô tả triệu chứng và nhu cầu thăm khám"
            multiline
            rows={4}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Hủy
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Xác nhận đặt lịch
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingForm;
