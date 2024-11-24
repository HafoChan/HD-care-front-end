import axiosClient from "./axios-instance";

const appointApi = {
  getAppointmentById(id,currentPage) {
    return axiosClient.get(`appointment/doctor-appointments?doctorId=${id}&page=${currentPage}`);
  },
  //--------------doctor_appointment--------------------

  findAppointmentByDoctor() {
    return axiosClient.get(
      "/appointment/doctor-appointments?doctorId=f053016f-15b6-4a36-8a4b-1b422492d9c0"
    );
  },

  filterAppointment(id,date) {
    return axiosClient.get(
      `/appointment/doctor-appointments?doctorId=${id}&date=${date}`
    );
  },

  filterAppointmentByTime(id,week, month) {
    let url = `appointment/doctor-appointment/time?doctorId=${id}`;
    if (week) {
      url += `&week=${week}`;
    }
    if (month) {
      url += `&month=${month}`;
    }
    return axiosClient.get(url);
  },

  filterAppointment(id,date) {
    return axiosClient.get(
      `/appointment/doctor-appointments?doctorId=${id}&date=${date}`
    );
  },
  filterAppointmentByTime(id,week, month) {
    let url = `appointment/doctor-appointment/time?doctorId=${id}`;
    if (week) {
      url += `&week=${week}`;
    }
    if (month) {
      url += `&month=${month}`;
    }
    return axiosClient.get(url);
  },
};
export default appointApi;
