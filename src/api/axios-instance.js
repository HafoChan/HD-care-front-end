import axios from "axios";
import { notification } from "antd";
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
      return Promise.reject('Token expired');
    }
    
    const accessToken = localStorage.getItem("accessToken");
    const language = localStorage.getItem("language") || "vi";

    // Chèn token ở mỗi request
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers["Accept-Language"] = language;
      console.log("inn")
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

    if (response?.status === 401 && response?.data?.result === "No authenticated") {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refreshToken");

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
          if (refreshError.response?.status === 401 && 
              refreshError.response?.data?.result === "Token expired") {
            isRefreshTokenFailed = true;
            console.log("loi refresh token")
            notification.error({
              message: "Phiên đăng nhập hết hạn",
              description: "Vui lòng đăng nhập lại.",
              duration: 3
            });

            // Xóa tokens khỏi localStorage
            // localStorage.removeItem("accessToken");
            // localStorage.removeItem("refreshToken");
            
            // // Chuyển hướng về trang login
            // window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
