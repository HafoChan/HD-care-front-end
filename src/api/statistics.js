import axiosClient from "./axios-instance";

export const getVisitStats = (doctorId, from, to) => {
  const params = {
    from,
    to,
  };

  if (doctorId) {
    params.doctorId = doctorId;
  }

  return axiosClient
    .get("/stats/visits", { params })
    .then((response) => {
      return { result: response };
    })
    .catch((error) => {
      console.error("Error fetching visit stats:", error);
      return { result: [] };
    });
};

export const getRevenueStats = (doctorId, from, to) => {
  const params = {
    from,
    to,
  };

  if (doctorId) {
    params.doctorId = doctorId;
  }

  return axiosClient
    .get("/stats/revenue", { params })
    .then((response) => {
      return { result: response };
    })
    .catch((error) => {
      console.error("Error fetching revenue stats:", error);
      return { result: [] };
    });
};

export const getNewsCountStats = (doctorId, from, to) => {
  const params = {
    from,
    to,
  };

  if (doctorId) {
    params.doctorId = doctorId;
  }

  return axiosClient
    .get("/stats/news-count", { params })
    .then((response) => {
      return { result: response };
    })
    .catch((error) => {
      console.error("Error fetching news count stats:", error);
      return { result: [] };
    });
};

export const getFavoriteNewsStats = (from, to, limit = 10) => {
  return axiosClient
    .get("/stats/favorite-news", {
      params: {
        from,
        to,
        limit,
      },
    })
    .then((response) => {
      return { result: response };
    })
    .catch((error) => {
      console.error("Error fetching favorite news stats:", error);
      return { result: [] };
    });
};

export const getNewUsersStats = (from, to) => {
  return axiosClient
    .get("/stats/new-users", {
      params: {
        from,
        to,
      },
    })
    .then((response) => {
      return { result: response };
    })
    .catch((error) => {
      console.error("Error fetching new users stats:", error);
      return { result: { newPatients: 0, newDoctors: 0 } };
    });
};

export const getAppointmentStats = (doctorId, from, to) => {
  const params = {
    from,
    to,
  };

  if (doctorId) {
    params.doctorId = doctorId;
  }

  return axiosClient
    .get("/stats/appointments", { params })
    .then((response) => {
      return { result: response };
    })
    .catch((error) => {
      console.error("Error fetching appointment stats:", error);
      return { result: [] };
    });
};
