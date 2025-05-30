import axiosInstance from "./axios-instance";

// kéo dữ liệu từ fe về và gán vào đây
// export default registerPatient = () => {
//   const createPatient = async (userRegister) => {
//     try {
//       const response = await axiosInstance.post("/patient", userRegister);
//       return response.data;
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const getPatientById = async (id) => {
//     try {
//       const response = await axiosInstance.get(`/patient/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
// };
const patientApi = {
  create(data) {
    return axiosInstance.post("/patient", data);
  },
  async updatePatient(data) {
    try {
      const response = await axiosInstance.put(`/patient`, data);
      console.log("Update response:", response);
      return response;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  },
  getInfo() {
    return axiosInstance.get("/patient/my-info");
  },

  getById(id) {
    return axiosInstance.get(`/patient/${id}`);
  },

  updatePassword(password) {
    return axiosInstance.post(`/patient/create-password`, {
      password: password,
    });
  },
};
export default patientApi;
