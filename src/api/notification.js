import axiosClient from "./axios-instance"

const notificationApi = {
    getPageNotification(){
        return axiosClient.get('notification')
    },

    putNotification(id){
        return axiosClient.put(`notification/${id}`)
    },

    updateAllStatusRead(){
        return axiosClient.patch('notification')
    },
    
    getAllNotification(){
        return axiosClient.get('notification/get-all')
    },

    getNotificationByDoctorId(idDoctor){
        return axiosClient.get(`notification/type-cancel/${idDoctor}`)
    }

}
export default notificationApi