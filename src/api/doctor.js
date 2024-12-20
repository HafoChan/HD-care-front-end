import axiosClient from "./axios-instance";

export const doctor = {
  createDoctor(data) {
    try {
      const response = axiosClient.post("/doctor", data);
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  filterDoctor(page, name, district, city, sorted) {
    try {
      const query = [
        city ? `city=${city}` : "",
        name ? `name=${name}` : "",
        district ? `district=${district}` : "",
        sorted ? `order=${sorted}` : "",
      ]
        .filter(Boolean)
        .join("&");

      const endpoint = query
        ? `/doctor?${query}&page=${page}`
        : `/doctor?page=${page}`;
      console.log(endpoint);

      return axiosClient.get(endpoint);
    } catch (error) {
      console.error("Error:", error);
    }
  },

  getDoctorById(id) {
    try {
      const response = axiosClient.get(`/doctor/${id}`);
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  getReviewDoctorById(id) {
    try {
      const response = axiosClient.get(`/doctor/${id}/review`);
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  getInfo() {
    try {
      const response = axiosClient.get("/doctor/my-info");
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  getPatient(id, page, keyword) {
    try {
      const query = [
        id ? `doctorId=${id}` : "",
        page ? `page=${page}` : "",
        keyword ? `keyword=${keyword}` : "",
      ]
        .filter(Boolean)
        .join("&");

      const response = axiosClient.get(
        `/appointment/doctor-appointment/manage-patient?${query}`
      );
      console.log(`/appointment/doctor-appointment/manage-patient?${query}`);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  getOtherDoctor(id){
    try {
      const response = axiosClient.get(`/doctor/otherDoctor/${id}`);
      return response;
    } catch (error) {
    }
  },

  getStatistic(){
    try {
      const response = axiosClient.get(`/doctor/statistic`);
      return response;
    } catch (error) {
    }
  }
};
