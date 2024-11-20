import axiosClient from "./axios-instance"

const reviewApi = {
    postReview(body){
        return axiosClient.post(`review`,body)
    }

}
export default reviewApi