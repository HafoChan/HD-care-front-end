import axiosInstance from "./axios-instance";

export default appointment = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  const createAppointment = async (
    idPatient,
    name,
    gender,
    dateOfAppointment,
    address,
    description,
    title,
    nameDoctor,
    startTime,
    endTime,
    dob,
    scheduleId
  ) => {
    try {
      const response = await axiosInstance.post(
        "/appointment",
        {
          idPatient,
          name,
          gender,
          dateOfAppointment,
          address,
          description,
          title,
          nameDoctor,
          startTime,
          endTime,
          dob,
          scheduleId,
        },
        { headers: headers }
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAppointment = async (idPatient, idSchedule, idDoctor) => {
    try {
      const response = await axiosInstance.get(
        "/appointment",
        {
          idPatient,
          idSchedule,
          idDoctor,
        },
        { headers: headers }
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };
};
