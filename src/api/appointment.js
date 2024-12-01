import axiosInstance from "./axios-instance";

export const appointment = {
  async createAppointment(appointmentData) {
    try {
      const response = await axiosInstance.post(
        "/appointment",
        appointmentData
      );
      return response;
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
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  async filterByToday(doctorId, status, date, page, name) {
    const query = [
      doctorId ? `doctorId=${doctorId}` : "",
      date ? `date=${date}` : "",
      status ? `status=${status}` : "",
      name ? `name=${name}` : "",
      page ? `page=${page}` : "",
    ]
      .filter(Boolean)
      .join("&");

    console.log(`/appointment/doctor-appointments?${query}`);
    try {
      const response = await axiosInstance.get(
        `/appointment/doctor-appointments?${query}`
      );
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async filterByWeekAndMonth(doctorId, week, month, status, page, name) {
    const query = [
      doctorId ? `doctorId=${doctorId}` : "",
      status ? `status=${status}` : "",
      name ? `name=${name}` : "",
      page ? `page=${page}` : "",
      week ? `week=${week}` : "",
      month ? `month=${month}` : "",
    ]
      .filter(Boolean)
      .join("&");
    try {
      const response = await axiosInstance.get(
        `/appointment/doctor-appointments/time?${query}`
      );
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  // ______________________________

  async getAppointmentByDoctor(doctorId, status, date, page, name) {
    const query = [
      doctorId ? `doctorId=${doctorId}` : "",
      date ? `date=${date}` : "",
      status ? `status=${status}` : "",
      page ? `page=${page}` : "",
      name ? `name=${name}` : "",
    ]
      .filter(Boolean)
      .join("&");
    console.log(`/appointment/doctor-appointments?${query}`);
    try {
      const response = await axiosInstance.get(
        `/appointment/doctor-appointments?${query}`
      );
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async getAppointmentFilter(doctorId, week, month, status, page, name) {
    const query = [
      doctorId ? `doctorId=${doctorId}` : "",
      status ? `status=${status}` : "",
      page ? `page=${page}` : "",
      week ? `week=${week}` : "",
      month ? `month=${month}` : "",
      name ? `name=${name}` : "",
    ]
      .filter(Boolean)
      .join("&");
    try {
      const response = await axiosInstance.get(
        `/appointment/doctor-appointments/time?${query}`
      );
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async changeAppointmentStatus(appointmentId, data) {
    try {
      const response = await axiosInstance.put(
        `/appointment/doctor-appointment/${appointmentId}/status`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async getAppointmentById(id) {
    try {
      const response = await axiosInstance.get(`/appointment/${id}`);
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async getAppointmentByPatientId(patientId, date, week, month, status, page) {
    const query = [
      patientId ? `patientId=${patientId}` : "",
      date ? `date=${date}` : "",
      week ? `week=${week}` : "",
      month ? `month=${month}` : "",
      status ? `status=${status}` : "",
      page ? `page=${page}` : "",
    ]
      .filter(Boolean)
      .join("&");
    try {
      const response = await axiosInstance.get(
        `/appointment/patient-appointment?${query}`
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async getPrescription(id, status) {
    try {
      const response = await axiosInstance.get(`/appointment/pdf/${id}`, {
        params: status ? { status } : {},
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(id);

      // Trả về trực tiếp response
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};
