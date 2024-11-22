import React, { createContext, useContext, useState, useEffect } from "react";
import patientApi from "../api/patient";

// Tạo context
const UserContext = createContext();

// Tạo provider
export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null); // Khởi tạo userInfo trước
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const fetchUserInfo = async () => {
    const response = await patientApi.getInfo();
    console.log(response);
    setUserInfo(response.result);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []); // Gọi fetchUserInfo chỉ một lần khi component mount

  useEffect(() => {
    if (userInfo) {
      // Chỉ cập nhật state khi userInfo có dữ liệu
      setId(userInfo?.id || "");
      setName(userInfo?.name || "");
      setEmail(userInfo?.email || "");
      setAddress(userInfo?.address || "");
      setPhone(userInfo?.phone || "");
      setGender(userInfo?.gender || "");
      setDob(userInfo?.dob || "");
    }
  }, [userInfo]); // Cập nhật state khi userInfo thay đổi

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
    </UserContext.Provider>
  );
};

// Hook để sử dụng context
export const useUserContext = () => {
  return useContext(UserContext);
};
