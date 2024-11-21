import axiosInstance from "./axios-instance";

export const appointment = {
  async createAppointment(appointmentData) {
    try {
      const response = await axiosInstance.post(
        "/appointment",
        appointmentData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error.response || error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  },

  getAppointment(idPatient, idSchedule, idDoctor) {
    try {
      const response = axiosInstance.get("/appointment", {
        idPatient,
        idSchedule,
        idDoctor,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
