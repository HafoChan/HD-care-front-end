import axiosClient from "./axios-instance"


const prescriptionApi = {
    findAppointmentByDoctor(id){
        return axiosClient.get(`/appointment/doctor-appointments?doctorId=${id}`)
    },
    getInfoPatient(id){
        return axiosClient.get(`/patient/${id}`)
    },
    createMedicine(id, data){
        return axiosClient.post(`/prescription/${id}/medicine`, data)
    },
    getListMedicine(id){
        return axiosClient.get(`/prescription/${id}/medicine`)
    },
    createPrescription(id, data){
        return axiosClient.put(`/prescription/${id}`, data)
    },
    updateStatus(id, data){
        return axiosClient.put(`/appointment/${id}`, data)
    },
    updateMedicine(id, data){
        return axiosClient.put(`/medicine/${id}`, data)
    }
}
export default prescriptionApi