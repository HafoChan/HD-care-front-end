import axiosClient from "./axios-instance";

export const doctor = {
  createDoctor(data) {
    try {
      const response = axiosClient.post("/doctor", data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  },

  filterDoctor(page, name, district, city) {
    try {
      const query = [
        city ? `city=${city}` : "",
        name ? `name=${name}` : "",
        district ? `district=${district}` : "",
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
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
