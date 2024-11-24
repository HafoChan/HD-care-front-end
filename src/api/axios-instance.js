import axios from "axios";
// import { get, set } from "@/hooks/use-local-storage";
import { Router } from "react-router-dom";
import {
  getAccessToken,
  getRefreshToken,
} from "../service/otherService/localStorage";
const axiosClient = axios.create({
  baseURL: "http://localhost:8082/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log("Axios request!");
    const accessToken = localStorage.getItem("accessToken");
    const language = localStorage.getItem("language") || "vi";

    // Check if the role is doctor
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers["Accept-Language"] = language;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (config) {
    if (config.data?.result?.roles === "DOCTOR") {
      console.log("doctor");
      window.location.href = "doctor/schedule-management"; // Redirect if role is doctor
    } else if (config.data?.result?.roles === "PATIENT")
      window.location.href = "/home";
    return config.data;
  },
  async function (error) {
    // Return the response data for both 404 and 200 status codes
    console.log("Axios error");

    const { response } = error;
    console.log("response : ", response);

    if (
      response?.status === 401 &&
      response?.data?.result === "No authenticated"
    ) {
      const originalRequest = error.config;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken || originalRequest._retry) {
        localStorage.setItem("refreshToken", "");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        const result = await axiosClient.post("/auth/refreshToken", {
          refreshToken,
        });

        const data = result.result;
        const newAccessToken = data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.setItem("accessToken", "");
        Router.push("/login");
        return Promise.reject(refreshError);
      }
    } else if (response?.status === 401 && response?.code === 1026) {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
      localStorage.setItem("img", "");
    } else {
      // Update the styling for self.bangtinh.text()
      console.log(error.response.data);
      return Promise.resolve(error.response.data); // Return the data for 404 errors
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
