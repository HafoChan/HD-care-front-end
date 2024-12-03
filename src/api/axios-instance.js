import axios from "axios";
import { notification } from "antd";
import {
  getAccessToken,
  getRefreshToken,
  remove,
} from "../service/otherService/localStorage";
const axiosClient = axios.create({
  baseURL: "http://localhost:8082/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm biến để theo dõi trạng thái
let isRefreshTokenFailed = false;

axiosClient.interceptors.request.use(
  (config) => {
    // Kiểm tra nếu refresh token đã thất bại thì chặn tất cả request
    if (isRefreshTokenFailed) {
      return Promise.reject("Token expired");
    }

    const accessToken = getAccessToken();
    const language = localStorage.getItem("language") || "vi";

    // Chèn token ở mỗi request
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers["Accept-Language"] = language;
      console.log("inn");
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
    console.log(response);
    if (
      response?.status === 401 &&
      response?.data?.result === "No authenticated"
    ) {
      const originalRequest = error.config;
      const refreshToken = getRefreshToken();

      if (refreshToken && !isRefreshTokenFailed) {
        try {
          const result = await axios.post(
            "http://localhost:8082/api/v1/auth/refreshToken",
            { refreshToken }
          );

          const newAccessToken = result.data.result.accessToken;

          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosClient(originalRequest);
        } catch (refreshError) {
          if (
            refreshError.response?.status === 401 &&
            refreshError.response?.data?.result === "Token expired"
          ) {
            isRefreshTokenFailed = true;
            notification.error({
              message: "Phiên đăng nhập hết hạn",
              description: "Vui lòng đăng nhập lại.",
              duration: 3,
            });
            remove();

            setTimeout(() => {
              window.location.href = "/login";
            }, 3000);
            return Promise.reject(refreshError);
          }
        }
      }
      if (!refreshToken) {
        notification.error({
          message: "Vui lòng đăng nhập lại",
          description: "Chưa đăng nhập thì không thể truy cập",
          duration: 3,
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    } else {
      return response.data;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
