import axiosInstance from "./axios-instance";

export const schedule = {
  getScheduleByDoctorAndDate(idDoctor, date) {
    try {
      const params = {
        ...(idDoctor && { idDoctor }),
        ...(date && { date }),
      };
      const endpoint = "/doctor-schedule";
      return axiosInstance.get(endpoint, { params });
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
