import axiosClient from "./axios-instance";

const appointApi = {
  getAppointmentById(id,currentPage,name) {
    let url = `appointment/doctor-appointments?doctorId=${id}&page=${currentPage}`;
    if (name !== null) {
      url += `&name=${name}`;
    }
    return axiosClient.get(url);
  },
  //--------------doctor_appointment--------------------


  filterAppointment(id,date,page,status) {
    return axiosClient.get(
      `/appointment/doctor-appointments?doctorId=${id}&date=${date}&page=${page}`
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
