import axiosClient from "./axios-instance"

const reviewApi = {
    postReview(body){
        return axiosClient.get(`review`,body)
    },

    getReview(id, sortBy, rating, page = 1) {
        console.log(rating)
        let url = `doctor/${id}/review?page=${page}`;
        if (sortBy) url += `&sort=${sortBy}`;
        if (rating !== null) url += `&star=${rating}`;
        return axiosClient.get(url);
    }

}
export default reviewApi