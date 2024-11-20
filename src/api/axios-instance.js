import axios from "axios";
// import { get, set } from "@/hooks/use-local-storage";
import { Router } from "react-router-dom";
const axiosClient = axios.create({
    baseURL : "http://localhost:8082/api/v1/",
    headers : {
        'Content-Type': 'application/json',
    }
})

axiosClient.interceptors.request.use(
    (config) => {
        console.log("Axios request!");
        const accessToken = localStorage.getItem("accessToken");
        const language = localStorage.getItem("language") || "vi";
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        config.headers["Accept-Language"] = language;
        return config;
    },
    (error) => Promise.reject(error)
);
// Add a response interceptor
axiosClient.interceptors.response.use(function (config) {      
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return config.data  ;
  }, async function (error) {
    // Return the response data for both 404 and 200 status codes
    console.log("Axios error");

    const { response } = error;
    console.log("response : ", response);

    if (response?.status === 401 && response?.data?.result === "No authenticated") {
        console.log("inn");
        const originalRequest = error.config;

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken || originalRequest._retry) {
            localStorage.setItem("refreshToken", "");
            window.location.href = "/login";
            return Promise.reject(error);
        }
        try {
            const result = await axiosClient.post("/auth/refreshToken", {
                refreshToken
            });
            console.log(result)
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
    }
    else {
        // Update the styling for self.bangtinh.text()
        const bangtinhElement = document.querySelector('.bangtinh'); // Adjust the selector as needed
        if (bangtinhElement) {
            bangtinhElement.style.textAlign = 'right'; // Align text to the right
            bangtinhElement.style.color = 'white'; // Set text color to white
            bangtinhElement.style.fontSize = 'larger'; // Increase font size
        }
        console.log(error.response.data)
        return Promise.resolve(error.response.data); // Return the data for 404 errors
    }
    return Promise.reject(error);
  });

  export default axiosClient; // Đảm bảo xuất đúng cách