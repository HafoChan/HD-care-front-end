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
      const params = {
        ...(name && { name }),
        ...(district && { district }),
        ...(city && { city }),
        ...(page && { page }),
      };

      const endpoint = "/doctor";
      console.log(endpoint);
      return axiosClient.get(endpoint, { params }); // Truyền params vào axios
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
