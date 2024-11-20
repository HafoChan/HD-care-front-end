import axiosClient from "./axios-instance"

const appointApi = {
    getAppointmentById(id){
        return axiosClient.get(`appointment/${id}`)
    }

}
export default appointApi