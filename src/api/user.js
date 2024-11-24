import axiosInstance from "./axios-instance";
export const user = {
    getInfo(){
        return axiosInstance.get("/auth/my-info")
      }
}