import axiosClient from "../../api/axios-instance";

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();
    file.forEach((file) => {
      formData.append("file", file); // Ensure the key matches what the backend expects
    });

    return axiosClient.post("patient/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }
}

export default new UploadFilesService();
