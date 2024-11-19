import { AppBar, Toolbar, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import images from "../../constants/images";
import React, { useEffect, useState } from "react";
import {remove,getImg,getRefreshToken,getAccessToken} from "../../service/otherService/localStorage"
import { useNavigate } from "react-router-dom";


const HeaderComponent = ({ selectedTab, handleTabClick,userInfo }) => {
  const navigate = useNavigate()
  const [img, setImg] = useState(""); // State to hold user info

  const viewInfo = () =>{
    // remove()
    // localStorage.removeItem("userInfo")
    // setUserInfo("")
    navigate("/user-detail")
  }
  const getInfo = () =>{
    const storedUserInfo = getImg();
    if (storedUserInfo) {
      setImg(storedUserInfo); // Parse and set user info if it exists
    }
  }
  useEffect(() => {
   getInfo()
  }, [userInfo]);
  return (
    <Box sx={{ backgroundColor: "white", paddingY: 2 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img
            src={images.logo}
            alt="Logo"
            style={{ width: 60, height: 60, borderRadius: "50%" }}
          />
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Trang chủ", "Về chúng tôi", "Đội ngũ bác sĩ", "Bài viết"].map(
              (tab) => (
                <Button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor:
                      selectedTab === tab ? "#FAC41C" : "transparent",
                    color: selectedTab === tab ? "white" : "black",
                    "&:hover": {
                      backgroundColor: "#FAC41C",
                      color: "white",
                    },
                  }}
                >
                  {tab}
                </Button>
              )
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link to={img ? "/user-detail" : "/login"} style={{ textDecoration: "none" }} onClick={img ? viewInfo : undefined}>
            {img ? ( // Display user avatar if userInfo exists
              <Box display="flex" alignItems="center" sx={{ mt: 0 }}>
                <img src={img} alt="User Icon" style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '8px' }} />
              </Box>
            ) : ( // Show login button if userInfo does not exist
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: "20px" }}
              >
                Đăng nhập
              </Button>
            )}
            </Link>
            <IconButton color="primary">
              <NotificationsNoneIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeaderComponent;
