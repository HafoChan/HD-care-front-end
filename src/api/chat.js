import axiosClient from "./axios-instance";

export const chatApi = {
    saveConversation(data) {
        try {
            const response = axiosClient.post("/message", data);
            return response;
        } catch (error) {
            console.error("Error:", error);
        }
    },

    getConversation(receiver, sender, page) {
        try {
            let url;
            if (page == null) {
                url = `/message?sender=${sender}&receiver=${receiver}`;
            } else {
                url = `/message?sender=${sender}&receiver=${receiver}&page=${page}`;
            }
            console.log("urlPost", url);
            const response = axiosClient.get(url);
            return response;
        } catch (error) {
            console.error("Error:", error);
        }
    }
}