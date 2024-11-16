import axiosInstance from "./axios-instance";

export default getToken = () => {
  const raw = {
    username: "admin",
    password: "admin",
  };

  const auth = async (raw) => {
    try {
      response = await axiosInstance.post("/auth/token", raw);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };
};
