import axios from "axios";
// import { get, set } from "@/hooks/use-local-storage";
import { Router } from "react-router-dom";
const axiosClient = axios.create({
    baseURL : "http://localhost:8082/api/v1/",
    headers : {
        'Content-Type': 'application/json',
    }
})

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, async function (error) {
    // Do something with request error
    console.log("Axios error")
    
    const {response} = error
    console.log("response : " + response)

    if(response?.status === 401 && response?.data?.message === "Token expired")
    {
        const originalRequest = error.config;
        
        const refreshToken = localStorage.getItem("refreshToken")
        if(!refreshToken || originalRequest._retry){
            localStorage.setItem("accessToken","")
            localStorage.setItem("refreshToken","")
            window.location.href = "/login";
            return Promise.reject(error);
        }
        try{
            const result = await axiosClient.post("/auth/refreshToken",{
                refreshToken
            })
            const data = result.data.result
            const newAccessToken = data.accessToken
            
            localStorage.setItem("accessToken",newAccessToken)
    
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosClient.originalRequest
        }catch(refreshError){
            console.error("Refresh token failed:", refreshError);
            localStorage.setItem("accessToken", "");
            Router.push("/login");
            return Promise.reject(refreshError);
        }
    }
    else if(response?.status === 401 && response?.code === 1026){
        localStorage.setItem("accessToken","")
        localStorage.setItem("refreshToken","")
    }
    return Promise.reject(error);
  });

// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

  export default axiosClient; // Đảm bảo xuất đúng cách
