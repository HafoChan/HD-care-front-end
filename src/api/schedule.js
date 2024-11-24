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

  postCreateSchedule(idDoctor, data) {
    try {
      const response = axiosInstance.post(
        `/doctor-schedule?idDoctor=${idDoctor}`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  deleteSchedule(idDoctor, data) {
    try {
      const response = axiosInstance.post(
        `/doctor-schedule/delete-schedules?idDoctor=${idDoctor}`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
