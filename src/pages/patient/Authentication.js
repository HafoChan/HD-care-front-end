import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { setItem } from "../../service/otherService/localStorage";

export default function Authenticate() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    const authenticateUser = async () => {
      if (isMatch) {
        const authCode = isMatch[1];
        console.log(authCode);

        try {
          const response = await fetch(
            `http://hdcarebackend-production.up.railway.app/api/v1/auth/outbound/authentication?code=${authCode}`,
            {
              method: "POST",
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log(data.result);

          const { accessToken, refreshToken, userResponse } = data?.result;
          console.log(accessToken);
          console.log(userResponse);

          setItem(accessToken, refreshToken, userResponse.img);
          setIsLoggedin(true);
        } catch (error) {
          console.error("Error during authentication:", error);
        }
      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/home");
    }
  }, [isLoggedin, navigate]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress></CircularProgress>
        <Typography>Authenticating...</Typography>
      </Box>
    </>
  );
}
