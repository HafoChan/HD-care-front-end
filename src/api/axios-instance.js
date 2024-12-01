import axios from "axios";
import { notification } from "antd";
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

    // Chèn token ở mỗi request
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
      window.location.href = "doctor/schedule-management";
    } else if (config.data?.result?.roles === "PATIENT")
      window.location.href = "/home";

    return config.data;
  },

  async function (error) {
    const { response } = error;
    console.log("response : ", response);

    if (
      response?.status === 401 &&
      response?.data?.result === "No authenticated"
    ) {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const result = await axios.post(
            "http://localhost:8082/api/v1/auth/refreshToken",
            {
              refreshToken: refreshToken,
            }
          );

          const newAccessToken = result.data.result.accessToken;

          localStorage.setItem("accessToken", newAccessToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);

          // Kiểm tra nếu refresh token thất bại do token hết hạn
          if (
            refreshError.response?.status === 401 &&
            (refreshError.response?.data?.result === "Token expired" ||
              refreshError.response?.data?.code === 1026)
          ) {
            // Xóa toàn bộ localStorage
            localStorage.clear();

            // Hiển thị thông báo và chuyển hướng sang trang login
            notification.error({
              message: "Phiên đăng nhập hết hạn",
              description: "Vui lòng đăng nhập lại.",
              duration: 3,
            });

            // Chuyển hướng sang trang login sau 3 giây
            setTimeout(() => {
              window.location.href = "/login";
            }, 3000);
          }

          return Promise.reject(refreshError);
        }
      }
    } else {
      return Promise.resolve(error.response?.data); // Return the data for 404 errors
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
