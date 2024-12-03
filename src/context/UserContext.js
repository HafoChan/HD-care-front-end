import React, { createContext, useContext, useState, useEffect } from "react";
import patientApi from "../api/patient";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Tạo context
const UserContext = createContext();

// Tạo provider
export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchUserInfo = async () => {
    try {
      const response = await patientApi.getInfo();
      setUserInfo(response.result);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setSnackbarMessage("Vui lòng đăng nhập để đặt lịch.");
      setSnackbarOpen(true);
      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setId(userInfo?.id || "");
      setName(userInfo?.name || "");
      setEmail(userInfo?.email || "");
      setAddress(userInfo?.address || "");
      setPhone(userInfo?.phone || "");
      setGender(userInfo?.gender || "");
      setDob(userInfo?.dob || "");
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        id,
        name,
        setName,
        email,
        setEmail,
        address,
        setAddress,
        phone,
        setPhone,
        gender,
        setGender,
        dob,
      }}
    >
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage || "Vui lòng đăng nhập để đặt lịch."}
        </MuiAlert>
      </Snackbar>
    </UserContext.Provider>
  );
};

// Hook để sử dụng context
export const useUserContext = () => {
  return useContext(UserContext);
};
